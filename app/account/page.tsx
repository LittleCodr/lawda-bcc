"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { formatINR } from "@/lib/products";
import { Download, Package, ExternalLink } from "lucide-react";


type Order = {
  id: string;
  createdAt: string;
  total: number;
  subtotal?: number;
  discount?: number;
  status?: string;
  trackingId?: string;
  trackingUrl?: string;
  items: { name: string; quantity: number; price: number; image: string }[];
  shipping: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  gokwikOrderId?: string;
};

type UserProfile = {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
};

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({
    name: "", phone: "", address: "", city: "", state: "", zip: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth?redirect=/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    
    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const isAddressObj = typeof data.address === 'object' && data.address !== null;
          const p = {
            name: data.name || user.displayName || "",
            phone: data.phone || "",
            address: isAddressObj ? (data.address.address || "") : (data.address || ""),
            city: data.city || (isAddressObj ? data.address.city : ""),
            state: data.state || (isAddressObj ? data.address.state : ""),
            zip: data.zip || (isAddressObj ? data.address.zip : ""),
          };
          setProfile(p);
          setEditForm(p);
        } else {
          const p = { name: user.displayName || "", phone: "", address: "", city: "", state: "", zip: "" };
          setProfile(p);
          setEditForm(p);
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    
    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, "users", user.uid, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => {
          const rawData = doc.data();
          const createdDateObj = rawData.createdAt?.toDate?.() || new Date(rawData.createdAt || Date.now());
          const now = new Date();
          const diffInMs = now.getTime() - createdDateObj.getTime();
          const diffInHours = diffInMs / (1000 * 60 * 60);
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

          let dynamicStatus = rawData.status || "Order Processing";
          
          if (diffInHours >= 10 && diffInDays < 6) {
            dynamicStatus = "Order on the way";
          } else if (diffInDays >= 6 && diffInDays < 7) {
            dynamicStatus = "Out for delivery";
          } else if (diffInDays >= 7 && diffInDays < 10) {
            dynamicStatus = "Delivery partner was unable to connect to the customer, will try again delivery today";
          } else if (diffInDays >= 10) {
            dynamicStatus = "Order completion failed, package returning to seller. Once returned, the customer will get refund within 7 days AFTER the package is received by the seller";
          }

          return {
            id: doc.id,
            ...rawData,
            status: dynamicStatus,
            createdAt: createdDateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          };
        }) as Order[];
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      await setDoc(doc(db, "users", user.uid), editForm, { merge: true });
      setProfile(editForm);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile", err);
    } finally {
      setSavingProfile(false);
    }
  };

  const generateReceipt = async (order: Order) => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    
    // Theme colors
    const primaryColor = [41, 41, 41];
    const secondaryColor = [100, 100, 100];

    // Header Background
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Company Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("OCTOPUS LIFESTYLE", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("Premium Fragrances & Lifestyle", 14, 26);
    
    // Invoice Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(200, 200, 200);
    doc.text("INVOICE", 150, 25);
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    // Company Details (Left)
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Octopus Lifestyle Private Limited", 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text("1401, 14th Floor, Emaar Palm Spring Plaza", 14, 55);
    doc.text("Sector 54, Gurgaon, Haryana - 122011", 14, 60);
    doc.text("Email: support@octopusperfume.in", 14, 65);
    doc.text("GSTIN: 06AAECO7617A1ZR", 14, 70); // Added GSTIN
    
    // Order Details (Right)
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details", 140, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID:`, 140, 55);
    doc.text(order.id.slice(0, 12).toUpperCase(), 165, 55);
    
    doc.text(`Date:`, 140, 60);
    doc.text(order.createdAt, 165, 60);
    
    doc.text(`Ref ID:`, 140, 65);
    doc.text(order.gokwikOrderId || "N/A", 165, 65);
    
    doc.text(`Payment:`, 140, 70);
    doc.text("Prepaid", 165, 70);

    // Bill To & Ship To
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 75, 196, 75);
    
    doc.setFont("helvetica", "bold");
    doc.text("Billed & Shipped To:", 14, 82);
    doc.setFont("helvetica", "normal");
    doc.text(order.shipping.name || "Customer", 14, 87);
    const addressLines = doc.splitTextToSize(`${order.shipping.address || ""}, ${order.shipping.city || ""}, ${order.shipping.state || ""} ${order.shipping.zip || ""}`, 80);
    doc.text(addressLines, 14, 92);
    doc.text(`Phone: ${order.shipping.phone || "N/A"}`, 14, 92 + (addressLines.length * 5));

    // Items Table
    const tableData = order.items.map((item, index) => [
      (index + 1).toString(),
      item.name,
      "330300", // HSN code for perfumes
      item.quantity.toString(),
      `Rs. ${item.price.toFixed(2)}`,
      "18%",
      `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    const subtotal = order.subtotal || order.total;
    const discount = order.discount || 0;
    // Calculate shipping safely
    let shippingCost = order.total - subtotal + discount;
    if (shippingCost < 0 || Math.abs(shippingCost) < 1) shippingCost = 0; // handle rounding or weird edge cases

    autoTable(doc, {
      startY: 105 + (addressLines.length * 5),
      head: [['#', 'Item Description', 'HSN/SAC', 'Qty', 'Unit Price', 'Tax', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 41, 41],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'right' },
        5: { halign: 'center' },
        6: { halign: 'right' }
      },
      bodyStyles: {
        textColor: [60, 60, 60]
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250]
      },
      margin: { top: 10 }
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    // Totals section (aligned to right)
    const totalsX = 130;
    const valuesX = 196;
    
    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", totalsX, finalY);
    doc.text(`Rs. ${subtotal.toFixed(2)}`, valuesX, finalY, { align: 'right' });
    
    if (discount > 0) {
        doc.text("Discount:", totalsX, finalY + 6);
        doc.text(`- Rs. ${discount.toFixed(2)}`, valuesX, finalY + 6, { align: 'right' });
    }
    
    doc.text("Shipping:", totalsX, finalY + (discount > 0 ? 12 : 6));
    doc.text(`Rs. ${shippingCost.toFixed(2)}`, valuesX, finalY + (discount > 0 ? 12 : 6), { align: 'right' });
    
    // Divider
    const totalY = finalY + (discount > 0 ? 18 : 12);
    doc.setDrawColor(200, 200, 200);
    doc.line(totalsX, totalY, valuesX, totalY);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Amount (Inc. GST):", totalsX, totalY + 7);
    doc.text(`Rs. ${order.total.toFixed(2)}`, valuesX, totalY + 7, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // Footer / Terms
    const footerY = 250;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, footerY, 196, footerY);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Terms & Conditions:", 14, footerY + 5);
    doc.text("1. This is a computer generated invoice and does not require a physical signature.", 14, footerY + 9);
    doc.text("2. Returns are accepted within 7 days of delivery as per the return policy.", 14, footerY + 13);
    doc.text("3. All disputes are subject to Haryana jurisdiction.", 14, footerY + 17);
    
    // Authorized Signatory
    doc.setTextColor(41, 41, 41);
    doc.setFont("helvetica", "bold");
    doc.text("For Octopus Lifestyle Private Limited", 196, footerY + 5, { align: 'right' });
    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signatory", 196, footerY + 17, { align: 'right' });
    
    doc.save(`Invoice_${order.id.slice(0,8)}.pdf`);
  };

  if (loading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 md:py-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
        <div>
          <h1 className="font-serif-display text-4xl md:text-5xl">My Account</h1>
          <p className="text-muted text-sm mt-2">{user.email}</p>
        </div>
        <button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="border border-ink px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:bg-ink hover:text-paper transition-colors w-fit"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-12 p-6 border border-ink/10 bg-white/50 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif-display text-2xl">Profile Details</h2>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs uppercase tracking-widest text-ink hover:opacity-60 transition-opacity underline"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={saveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">Address</label>
                <input
                  type="text"
                  value={editForm.address}
                  onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                  className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">State</label>
                <input
                  type="text"
                  value={editForm.state}
                  onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                  className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted mb-2">ZIP Code</label>
                <input
                  type="text"
                  value={editForm.zip}
                  onChange={(e) => setEditForm({...editForm, zip: e.target.value})}
                  className="w-full border-b border-ink/20 py-2 bg-transparent focus:outline-none focus:border-ink transition-colors text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-ink/10">
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-ink text-paper px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm(profile || { name: "", phone: "", address: "", city: "", state: "", zip: "" });
                }}
                className="text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-xs uppercase tracking-widest text-muted block mb-1">Name</span>
              <span>{profile?.name || user.displayName || "Not set"}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-muted block mb-1">Email</span>
              <span>{user.email}</span>
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-muted block mb-1">Phone</span>
              <span>{profile?.phone || "Not set"}</span>
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs uppercase tracking-widest text-muted block mb-1">Shipping Address</span>
              {profile?.address ? (
                <address className="not-italic">
                  {profile.address}<br />
                  {profile.city}, {profile.state} {profile.zip}
                </address>
              ) : (
                <span className="text-muted">Not set</span>
              )}
            </div>
          </div>
        )}
      </div>

      <h2 className="font-serif-display text-2xl mb-6">Order History</h2>

      {loadingOrders ? (
        <p className="text-muted text-sm">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 border border-ink/10 bg-white/50">
          <p className="text-muted mb-6">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/collections/all"
            className="border border-ink px-8 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-ink hover:text-paper transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-ink/10 bg-white/50 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4 border-b border-ink/10 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="text-xs uppercase tracking-widest text-muted">Order</p>
                    <p className="text-sm font-bold">{order.id.slice(0, 12).toUpperCase()}</p>
                    {order.status && (
                      <span className="px-2 py-0.5 bg-ink/5 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1.5">
                        <Package size={10} />
                        {order.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mb-3">{order.createdAt}</p>
                  
                  {order.trackingId && (
                    <div className="text-xs">
                      <span className="text-muted">Tracking ID: </span>
                      <span className="font-medium">{order.trackingId}</span>
                      {order.trackingUrl && (
                        <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-ink hover:opacity-60 underline inline-flex items-center gap-1">
                          Track <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                  <p className="font-serif-display text-xl md:text-lg">{formatINR(order.total)}</p>
                  <button 
                    onClick={() => generateReceipt(order)}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-ink border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
                  >
                    <Download size={14} />
                    Receipt
                  </button>
                </div>
              </div>
              <ul className="space-y-3">
                {order.items.map((item, i) => (
                  <li key={i} className="flex gap-3 items-center">
                    <div className="relative w-12 h-14 bg-white shrink-0 border border-ink/5">
                      <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-muted">Qty: {item.quantity} - {formatINR(item.price)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
