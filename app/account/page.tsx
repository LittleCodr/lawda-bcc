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
  razorpayOrderId: string;
  razorpayPaymentId: string;
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
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }) || "",
        })) as Order[];
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
    
    // Header
    doc.setFontSize(20);
    doc.text("INVOICE / RECEIPT", 14, 22);
    
    doc.setFontSize(10);
    doc.text("Octopus Lifestyle Private Limited", 14, 32);
    doc.text("1401, 14th Floor, Emaar Palm Spring Plaza", 14, 38);
    doc.text("Sector 54, Gurgaon, Haryana – 122011", 14, 44);
    doc.text("Email: support@octopusperfumes.in", 14, 50);
    
    // Order Info
    doc.text(`Order ID: ${order.id}`, 120, 32);
    doc.text(`Date: ${order.createdAt}`, 120, 38);
    doc.text(`Payment ID: ${order.razorpayPaymentId || "N/A"}`, 120, 44);
    doc.text(`Status: ${order.status || "Completed"}`, 120, 50);
    
    // Customer Info
    doc.text("Billed To:", 14, 65);
    doc.text(order.shipping.name || "Customer", 14, 71);
    doc.text(`${order.shipping.address || ""}`, 14, 77);
    doc.text(`${order.shipping.city || ""}, ${order.shipping.state || ""} ${order.shipping.zip || ""}`, 14, 83);
    doc.text(`Phone: ${order.shipping.phone || "N/A"}`, 14, 89);
    
    // Items Table
    const tableData = order.items.map(item => [
      item.name,
      item.quantity.toString(),
      `Rs. ${item.price.toFixed(2)}`,
      `Rs. ${(item.price * item.quantity).toFixed(2)}`
    ]);
    
    const subtotal = order.subtotal || order.total;
    const discount = order.discount || 0;
    // Calculate shipping safely
    let shippingCost = order.total - subtotal + discount;
    if (shippingCost < 0 || Math.abs(shippingCost) < 1) shippingCost = 0; // handle rounding or weird edge cases

    autoTable(doc, {
      startY: 100,
      head: [['Item', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      foot: [
        ['', '', 'Subtotal', `Rs. ${subtotal.toFixed(2)}`],
        ['', '', 'Discount', `Rs. ${discount.toFixed(2)}`],
        ['', '', 'Shipping', `Rs. ${shippingCost.toFixed(2)}`],
        ['', '', 'Total (Inc. 18% GST)', `Rs. ${order.total.toFixed(2)}`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [26, 26, 26] },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
    });
    
    doc.save(`Receipt_${order.id.slice(0,8)}.pdf`);
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
