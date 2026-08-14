"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { formatINR } from "@/lib/products";
import { Download, Package, ExternalLink, User, Settings, Edit3, X, Heart } from "lucide-react";
import toast from "react-hot-toast";


type Order = {
  id: string;
  createdAt: string;
  total: number;
  subtotal?: number;
  discount?: number;
  status?: string;
  trackingId?: string;
  trackingUrl?: string;
  items: { name: string; quantity: number; price: number; image: string; variantTitle?: string }[];
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

type Favourite = {
  id: string;
  handle?: string;
  title: string;
  price: number;
  image: string;
  addedAt: any;
};

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "favourites">("profile");
  const [editForm, setEditForm] = useState<UserProfile>({
    name: "", phone: "", address: "", city: "", state: "", zip: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "orders" || tab === "favourites") {
        setActiveTab(tab);
      }
    }
  }, []);

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
            dynamicStatus = "Order completion failed, package returning to seller.";
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

    const fetchFavourites = async () => {
      try {
        const favRef = collection(db, "users", user.uid, "favourites");
        const q = query(favRef, orderBy("addedAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => doc.data() as Favourite);
        setFavourites(data);
      } catch (err) {
        console.error("Error fetching favourites:", err);
      } finally {
        setLoadingFavs(false);
      }
    };

    fetchProfile();
    fetchOrders();
    fetchFavourites();
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    try {
      await setDoc(doc(db, "users", user.uid), editForm, { merge: true });
      setProfile(editForm);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile", err);
      toast.error("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const generateReceipt = async (order: Order) => {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    
    // Theme colors matching new aesthetic
    const primaryColor = [128, 0, 32]; // Burgundy #800020
    const secondaryColor = [100, 100, 100];

    // Header Background
    doc.setFillColor(253, 248, 245); // Blush #FDF8F5
    doc.rect(0, 0, 210, 40, 'F');
    
    // Company Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("EVERLASTING SHOP", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text("Premium Personalized Jewelry", 14, 26);
    
    // Invoice Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(200, 200, 200);
    doc.text("INVOICE", 150, 25);
    
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    
    // Company Details (Left)
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Everlasting Lifestyle Private Limited", 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text("Email: support@everlasting.shop", 14, 55);
    
    // Order Details (Right)
    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details", 140, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Order ID:`, 140, 55);
    doc.text(order.id.slice(0, 12).toUpperCase(), 165, 55);
    
    doc.text(`Date:`, 140, 60);
    doc.text(order.createdAt, 165, 60);
    
    doc.text(`Payment:`, 140, 65);
    doc.text("Prepaid", 165, 65);

    // Bill To & Ship To
    doc.setDrawColor(229, 184, 183); // #E5B8B7
    doc.line(14, 75, 196, 75);
    
    const shipping = (order as any).shippingDetails || order.shipping || {} as any;

    doc.setFont("helvetica", "bold");
    doc.text("Billed & Shipped To:", 14, 82);
    doc.setFont("helvetica", "normal");
    doc.text(shipping.name || "Customer", 14, 87);
    const addressLines = doc.splitTextToSize(`${shipping.address || ""}, ${shipping.city || ""}, ${shipping.state || ""} ${shipping.zip || ""}`, 80);
    doc.text(addressLines, 14, 92);
    doc.text(`Phone: ${shipping.phone || "N/A"}`, 14, 92 + (addressLines.length * 5));

    // Items Table
    const tableData = order.items.map((item, index) => {
      const itemName = item.name || (item as any).title || "Unknown Item";
      return [
        (index + 1).toString(),
        item.variantTitle ? `${itemName} (${item.variantTitle})` : itemName,
        item.quantity.toString(),
        `Rs. ${item.price.toFixed(2)}`,
        `Rs. ${(item.price * item.quantity).toFixed(2)}`
      ];
    });
    
    const subtotal = order.subtotal || order.total;
    const discount = order.discount || 0;
    // Calculate shipping safely
    let shippingCost = order.total - subtotal + discount;
    if (shippingCost < 0 || Math.abs(shippingCost) < 1) shippingCost = 0; 

    autoTable(doc, {
      startY: 105 + (addressLines.length * 5),
      head: [['#', 'Item Description', 'Qty', 'Unit Price', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [128, 0, 32],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'right' },
        4: { halign: 'right' }
      },
      bodyStyles: {
        textColor: [60, 60, 60]
      },
      alternateRowStyles: {
        fillColor: [253, 248, 245]
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
    doc.setDrawColor(229, 184, 183);
    doc.line(totalsX, totalY, valuesX, totalY);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total Amount:", totalsX, totalY + 7);
    doc.text(`Rs. ${order.total.toFixed(2)}`, valuesX, totalY + 7, { align: 'right' });
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // Footer / Terms
    const footerY = 250;
    doc.setDrawColor(229, 184, 183);
    doc.line(14, footerY, 196, footerY);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Terms & Conditions:", 14, footerY + 5);
    doc.text("1. This is a computer generated invoice and does not require a physical signature.", 14, footerY + 9);
    doc.text("2. Crafted with care to be everlasting.", 14, footerY + 13);
    
    doc.save(`Everlasting_Invoice_${order.id.slice(0,8)}.pdf`);
    toast.success("Invoice downloaded!");
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="w-8 h-8 border-2 border-[#E5B8B7] border-t-[#800020] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pt-24 pb-32">
      <div className="mx-auto max-w-[1000px] px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-2">My Account</h1>
            <p className="text-stone-500 font-medium">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await logout();
              toast.success("Logged out successfully.");
              router.push("/");
            }}
            className="border border-[#800020] text-[#800020] px-8 py-3 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#800020] hover:text-white transition-colors duration-300 w-fit"
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-[#E5B8B7]/30 mb-12">
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-4 text-xs uppercase tracking-widest font-bold transition-colors relative ${activeTab === "profile" ? "text-[#800020]" : "text-stone-500 hover:text-stone-900"}`}
          >
            Profile
            {activeTab === "profile" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#800020]"></span>}
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 text-xs uppercase tracking-widest font-bold transition-colors relative ${activeTab === "orders" ? "text-[#800020]" : "text-stone-500 hover:text-stone-900"}`}
          >
            Orders
            {activeTab === "orders" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#800020]"></span>}
          </button>
          <button
            onClick={() => setActiveTab("favourites")}
            className={`pb-4 text-xs uppercase tracking-widest font-bold transition-colors relative flex items-center gap-2 ${activeTab === "favourites" ? "text-[#800020]" : "text-stone-500 hover:text-stone-900"}`}
          >
            Favourites
            <span className="bg-[#fdfaf8] text-[#800020] px-2 py-0.5 rounded-full text-[9px] border border-[#E5B8B7]/30">{favourites.length}</span>
            {activeTab === "favourites" && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#800020]"></span>}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white border border-[#E5B8B7]/50 shadow-sm p-8 md:p-12 mb-16 relative animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-10 border-b border-[#E5B8B7]/30 pb-6">
              <h2 className="font-serif text-2xl text-stone-900 flex items-center gap-3">
                <User className="text-[#800020]" />
                Profile Details
              </h2>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs uppercase tracking-widest text-[#800020] font-bold hover:opacity-70 transition-opacity flex items-center gap-2"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#800020] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#800020] transition-colors text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Address</label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#800020] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">City</label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                      className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#800020] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">State</label>
                    <input
                      type="text"
                      value={editForm.state}
                      onChange={(e) => setEditForm({...editForm, state: e.target.value})}
                      className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#800020] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={editForm.zip}
                      onChange={(e) => setEditForm({...editForm, zip: e.target.value})}
                      className="w-full border-b border-stone-300 py-2 bg-transparent focus:outline-none focus:border-[#800020] transition-colors text-sm"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-8 pt-8 border-t border-[#E5B8B7]/30">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-[#800020] text-white px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors duration-300 disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(profile || { name: "", phone: "", address: "", city: "", state: "", zip: "" });
                    }}
                    className="text-xs uppercase tracking-widest text-stone-500 font-bold hover:text-stone-900 transition-colors flex items-center gap-2"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block mb-2">Name</span>
                  <span className="text-stone-900 font-medium text-lg">{profile?.name || user.displayName || "Not set"}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block mb-2">Email</span>
                  <span className="text-stone-900 font-medium text-lg">{user.email}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block mb-2">Phone</span>
                  <span className="text-stone-900 font-medium text-lg">{profile?.phone || "Not set"}</span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block mb-2">Shipping Address</span>
                  {profile?.address ? (
                    <address className="not-italic text-stone-900 text-lg leading-relaxed">
                      {profile.address}<br />
                      {profile.city}, {profile.state} {profile.zip}
                    </address>
                  ) : (
                    <span className="text-stone-400 italic">Not set</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order History */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in duration-300">
            {loadingOrders ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-[#E5B8B7] border-t-[#800020] rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-24 bg-white border border-[#E5B8B7]/50 shadow-sm flex flex-col items-center">
                <Package size={48} className="text-[#E5B8B7] mb-6" strokeWidth={1} />
                <p className="text-stone-500 mb-8 text-lg font-serif">You haven&apos;t placed any orders yet.</p>
                <Link
                  href="/collections/all"
                  className="bg-[#800020] text-white px-10 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors duration-300 shadow-lg shadow-[#800020]/20"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-[#E5B8B7]/50 shadow-sm overflow-hidden group">
                    {/* Order Header */}
                    <div className="bg-[#FDF8F5]/50 border-b border-[#E5B8B7]/50 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors group-hover:bg-[#FDF8F5]">
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#800020]">Order</p>
                          <p className="text-lg font-bold text-stone-900">#{order.id.slice(0, 12).toUpperCase()}</p>
                        </div>
                        <p className="text-sm text-stone-500 mb-4 font-medium">{order.createdAt}</p>
                        
                        {order.status && (
                          <span className="px-4 py-1.5 bg-white border border-[#E5B8B7] text-[#800020] text-[10px] uppercase tracking-widest font-bold inline-flex items-center gap-2 shadow-sm">
                            <div className="w-1.5 h-1.5 bg-[#800020] rounded-full animate-pulse"></div>
                            {order.status}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-6 border-t md:border-t-0 border-[#E5B8B7]/30 pt-6 md:pt-0">
                        <p className="font-serif text-3xl text-stone-900">{formatINR(order.total)}</p>
                        <button 
                          onClick={() => generateReceipt(order)}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#800020] border-b-2 border-transparent hover:border-[#800020] transition-colors pb-0.5"
                        >
                          <Download size={14} />
                          Download Invoice
                        </button>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-6 md:p-8">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {order.items.map((item, i) => (
                          <li key={i} className="flex gap-4 items-center">
                            <div className="relative w-20 h-20 bg-stone-50 shrink-0 border border-stone-100 rounded-sm overflow-hidden">
                              <Image src={item.image || "/logo.png"} alt={item.name || (item as any).title || "Product"} fill sizes="80px" className="object-cover" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-serif font-medium text-stone-900 leading-tight mb-1">{item.name || (item as any).title}</p>
                              {item.variantTitle && (
                                <p className="text-xs text-stone-500 mb-2">{item.variantTitle}</p>
                              )}
                              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-stone-500 mt-2">
                                <span>Qty: {item.quantity}</span>
                                <span className="font-bold text-stone-900">{formatINR(item.price)}</span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      
                      {order.trackingId && (
                        <div className="mt-8 pt-6 border-t border-[#E5B8B7]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-sm text-stone-600">
                            <Package size={16} className="text-[#800020]" />
                            Tracking ID: <span className="font-bold text-stone-900">{order.trackingId}</span>
                          </div>
                          {order.trackingUrl && (
                            <a 
                              href={order.trackingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-xs uppercase tracking-widest font-bold text-white bg-stone-900 px-6 py-2.5 hover:bg-stone-800 transition-colors inline-flex items-center justify-center gap-2"
                            >
                              Track Package <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Favourites Section */}
        {activeTab === "favourites" && (
          <div className="animate-in fade-in duration-300">
            {loadingFavs ? (
              <div className="py-12 flex justify-center">
                <div className="w-8 h-8 border-2 border-[#E5B8B7] border-t-[#800020] rounded-full animate-spin"></div>
              </div>
            ) : favourites.length === 0 ? (
              <div className="text-center py-16 bg-white border border-[#E5B8B7]/50 shadow-sm flex flex-col items-center">
                <Heart size={48} className="text-[#E5B8B7] mb-6" strokeWidth={1} />
                <p className="text-stone-500 text-lg font-serif mb-6">You haven't saved any favourites yet.</p>
                <Link
                  href="/collections/all"
                  className="bg-[#800020] text-white px-10 py-4 text-xs tracking-[0.2em] uppercase font-bold hover:bg-[#E5B8B7] hover:text-[#800020] transition-colors duration-300 shadow-lg shadow-[#800020]/20"
                >
                  Discover Gifts
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {favourites.map((fav) => (
                  <Link key={fav.id} href={`/products/${fav.handle || fav.id}`} className="group bg-white border border-[#E5B8B7]/30 shadow-sm overflow-hidden flex flex-col hover:border-[#800020] transition-colors relative">
                    <div className="relative aspect-[4/5] bg-stone-50 w-full overflow-hidden">
                      <Image src={fav.image} alt={fav.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between bg-white z-10 relative">
                      <p className="font-serif text-sm text-stone-900 leading-tight mb-2 line-clamp-2">{fav.title}</p>
                      <p className="font-bold text-[#800020] text-sm">{formatINR(fav.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
