"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { formatINR } from "@/lib/products";
import {
  downloadOrderInvoicePDF,
  type InvoiceOrderInput,
  type InvoiceOrderItem,
  type InvoiceShippingDetails,
} from "@/lib/invoice";
import {
  Download,
  Package,
  ExternalLink,
  User,
  Edit3,
  X,
  Heart,
  Loader2,
  ShieldCheck,
  Tag,
} from "lucide-react";
import toast from "react-hot-toast";

type AccountTab = "profile" | "orders" | "favourites";

interface AccountOrderItem extends InvoiceOrderItem {
  name?: string;
  title?: string;
  image?: string;
  quantity: number;
  price: number;
  variantTitle?: string;
}

interface Order extends InvoiceOrderInput {
  id: string;
  createdAt: string;
  total: number;
  subtotal?: number;
  discount?: number;
  discountAmount?: number;
  shippingFee?: number;
  promoCode?: string | null;
  status?: string;
  rawStatus?: string;
  paymentMode?: string;
  paymentMethod?: string;
  deliveryMethod?: string;
  trackingId?: string;
  trackingUrl?: string;
  items: AccountOrderItem[];
  shipping?: InvoiceShippingDetails;
  shippingDetails?: InvoiceShippingDetails;
  gokwikOrderId?: string;
}

interface UserProfile {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface Favourite {
  id: string;
  handle?: string;
  title: string;
  price: number;
  image: string;
  addedAt?: unknown;
}

function getOrderStatusStyle(status?: string): string {
  const s = (status || "").toLowerCase();
  if (s.includes("delivered") || s.includes("confirmed") || s.includes("paid") || s.includes("dispatched") || s.includes("out for")) {
    return "bg-[#EDF7F1] border-[#C6E5D2] text-[#347A54]";
  }
  if (s.includes("pending")) {
    return "bg-[#FBF6EE] border-[#E8D7BC] text-[#9A7953]";
  }
  return "bg-[#F7F6F3] border-[#E8E6E1] text-[#242424]";
}

function AccountContent() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlTabParam = searchParams.get("tab") ?? "";
  const urlTab: AccountTab =
    urlTabParam === "orders" || urlTabParam === "favourites"
      ? urlTabParam
      : "profile";

  const [manualTab, setManualTab] = useState<{
    urlKey: string;
    tab: AccountTab;
  } | null>(null);
  const activeTab: AccountTab =
    manualTab && manualTab.urlKey === urlTabParam ? manualTab.tab : urlTab;

  const setActiveTab = (tab: AccountTab) => {
    setManualTab({ urlKey: urlTabParam, tab });
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(null);

  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [editForm, setEditForm] = useState<UserProfile>({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
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
          const isAddressObj =
            typeof data.address === "object" && data.address !== null;
          const p: UserProfile = {
            name: data.name || user.displayName || "",
            phone: data.phone || "",
            address: isAddressObj
              ? data.address.address || ""
              : data.address || "",
            city: data.city || (isAddressObj ? data.address.city : ""),
            state: data.state || (isAddressObj ? data.address.state : ""),
            zip: data.zip || (isAddressObj ? data.address.zip : ""),
          };
          setProfile(p);
          setEditForm(p);
        } else {
          const p: UserProfile = {
            name: user.displayName || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zip: "",
          };
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
        const data = snapshot.docs.map((docSnap) => {
          const rawData = docSnap.data() as Record<string, unknown>;
          const rawCreated = rawData.createdAt as
            | { toDate?: () => Date }
            | string
            | number
            | undefined;
          const createdDateObj =
            typeof rawCreated === "object" && rawCreated?.toDate
              ? rawCreated.toDate()
              : new Date((rawCreated as string | number) || Date.now());
          const diffInMs = Date.now() - createdDateObj.getTime();
          const diffInHours = diffInMs / (1000 * 60 * 60);
          const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

          const rawStatus = String(rawData.status || "");
          let dynamicStatus =
            rawStatus === "Paid"
              ? "Order Confirmed & Processing"
              : rawStatus === "pending_payment"
              ? "Awaiting Payment"
              : rawStatus || "Order Processing";

          if (rawStatus === "Paid") {
            if (diffInHours >= 6 && diffInDays < 2) {
              dynamicStatus = "Dispatched via Express Air";
            } else if (diffInDays >= 2 && diffInDays < 4) {
              dynamicStatus = "Out for Delivery";
            } else if (diffInDays >= 4) {
              dynamicStatus = "Delivered";
            }
          }

          return {
            id: docSnap.id,
            ...(rawData as Partial<Order>),
            items: Array.isArray(rawData.items)
              ? (rawData.items as AccountOrderItem[])
              : [],
            total: Number(rawData.total ?? rawData.amountPaid ?? 0),
            discountAmount:
              typeof rawData.discountAmount === "number"
                ? rawData.discountAmount
                : typeof rawData.discount === "number"
                ? rawData.discount
                : undefined,
            rawStatus,
            status: dynamicStatus,
            createdAt: createdDateObj.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
          } as Order;
        });
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
        const data = snapshot.docs.map((docSnap) => docSnap.data() as Favourite);
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

  const handleDownloadInvoice = async (order: Order) => {
    setDownloadingOrderId(order.id);
    try {
      await downloadOrderInvoicePDF({
        ...order,
        orderId: order.id,
        items: order.items.map((item) => ({
          ...item,
          title: item.title || item.name || "Signature Eau De Parfum",
        })),
      });
      toast.success("Official invoice PDF downloaded");
    } catch (err) {
      console.error("Invoice generation failed:", err);
      toast.error("Could not generate invoice PDF");
    } finally {
      setDownloadingOrderId(null);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F7F6F3]">
        <Loader2 size={28} className="text-[#9A7953] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-[#F7F6F3] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-[1040px] px-4 sm:px-6 lg:px-8">
        {/* Account Header */}
        <div className="rounded-[12px] bg-[#141210] text-white p-6 sm:p-8 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-b-[3px] border-[#9A7953]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D4AF7A] mb-1.5">
              Patron Account · Octopus Perfumes
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
              {profile?.name || user.displayName || "My Account"}
            </h1>
            <p className="text-sm text-[#C8C2B8] mt-1">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await logout();
              toast.success("Logged out successfully.");
              router.push("/");
            }}
            className="border border-white/25 text-white hover:bg-white hover:text-[#141210] px-6 py-2.5 rounded-[6px] text-xs tracking-[0.16em] uppercase font-bold transition-colors w-fit cursor-pointer"
          >
            Sign Out
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 border-b border-[#E8E6E1] mb-8">
          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`pb-3.5 text-xs uppercase tracking-[0.16em] font-bold transition-colors relative cursor-pointer ${
              activeTab === "profile"
                ? "text-[#141210]"
                : "text-[#777777] hover:text-[#242424]"
            }`}
          >
            Profile
            {activeTab === "profile" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9A7953]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`pb-3.5 text-xs uppercase tracking-[0.16em] font-bold transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "text-[#141210]"
                : "text-[#777777] hover:text-[#242424]"
            }`}
          >
            <span>Orders</span>
            <span className="bg-white text-[#9A7953] px-2 py-0.5 rounded-full text-[10px] border border-[#E8E6E1]">
              {orders.length}
            </span>
            {activeTab === "orders" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9A7953]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("favourites")}
            className={`pb-3.5 text-xs uppercase tracking-[0.16em] font-bold transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === "favourites"
                ? "text-[#141210]"
                : "text-[#777777] hover:text-[#242424]"
            }`}
          >
            <span>Saved Scents</span>
            <span className="bg-white text-[#9A7953] px-2 py-0.5 rounded-full text-[10px] border border-[#E8E6E1]">
              {favourites.length}
            </span>
            {activeTab === "favourites" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9A7953]" />
            )}
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white border border-[#E8E6E1] rounded-[12px] shadow-sm p-6 sm:p-10 mb-12">
            <div className="flex items-center justify-between mb-8 border-b border-[#E8E6E1] pb-5">
              <h2 className="font-serif text-2xl text-[#242424] flex items-center gap-3">
                <User size={20} className="text-[#9A7953]" />
                <span>Profile &amp; Delivery Address</span>
              </h2>
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs uppercase tracking-[0.14em] text-[#9A7953] font-bold hover:text-[#141210] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 size={14} /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={saveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#777777] font-semibold mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="fc-input px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#777777] font-semibold mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      className="fc-input px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-widest text-[#777777] font-semibold mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      className="fc-input px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#777777] font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={(e) =>
                        setEditForm({ ...editForm, city: e.target.value })
                      }
                      className="fc-input px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#777777] font-semibold mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      value={editForm.state}
                      onChange={(e) =>
                        setEditForm({ ...editForm, state: e.target.value })
                      }
                      className="fc-input px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-[#777777] font-semibold mb-2">
                      PIN / ZIP Code
                    </label>
                    <input
                      type="text"
                      value={editForm.zip}
                      onChange={(e) =>
                        setEditForm({ ...editForm, zip: e.target.value })
                      }
                      className="fc-input px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-[#E8E6E1]">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-luxury-primary px-7 py-3 text-xs cursor-pointer disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm(
                        profile || {
                          name: "",
                          phone: "",
                          address: "",
                          city: "",
                          state: "",
                          zip: "",
                        }
                      );
                    }}
                    className="text-xs uppercase tracking-widest text-[#5C5954] font-bold hover:text-[#141210] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <X size={14} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#9A7953] block mb-1.5">
                    Name
                  </span>
                  <span className="text-[#242424] font-medium text-base">
                    {profile?.name || user.displayName || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#9A7953] block mb-1.5">
                    Email
                  </span>
                  <span className="text-[#242424] font-medium text-base">
                    {user.email}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#9A7953] block mb-1.5">
                    Phone
                  </span>
                  <span className="text-[#242424] font-medium text-base">
                    {profile?.phone || "Not set"}
                  </span>
                </div>
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#9A7953] block mb-1.5">
                    Saved Shipping Address
                  </span>
                  {profile?.address ? (
                    <address className="not-italic text-[#242424] text-base leading-relaxed">
                      {profile.address}
                      <br />
                      {[profile.city, profile.state, profile.zip]
                        .filter(Boolean)
                        .join(", ")}
                    </address>
                  ) : (
                    <span className="text-[#777777] italic text-sm">Not set</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === "orders" && (
          <div>
            {loadingOrders ? (
              <div className="py-16 flex justify-center">
                <Loader2 size={28} className="text-[#9A7953] animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#E8E6E1] rounded-[12px] shadow-sm flex flex-col items-center px-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F6F3] border border-[#E8E6E1] flex items-center justify-center mb-5">
                  <Package size={28} className="text-[#9A7953]" />
                </div>
                <h2 className="font-serif text-2xl font-semibold text-[#242424] mb-2">
                  No orders yet
                </h2>
                <p className="text-sm text-[#5C5954] mb-7 max-w-md">
                  Your confirmed orders, PDF tax invoices, and live courier tracking links will appear here after your first order.
                </p>
                <Link
                  href="/collections/bestsellers"
                  className="btn-luxury-primary px-8 py-3.5 text-xs"
                >
                  Explore Bestselling Scents
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const savings = Number(order.discountAmount ?? order.discount ?? 0);
                  const isDownloading = downloadingOrderId === order.id;

                  return (
                    <article
                      key={order.id}
                      className="bg-white border border-[#E8E6E1] rounded-[12px] shadow-sm overflow-hidden"
                    >
                      {/* Obsidian-Topped Order Summary Row */}
                      <div className="bg-[#FAF9F6] border-b border-[#E8E6E1] p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#9A7953]">
                              Order Reference
                            </span>
                            <span className="font-mono text-sm sm:text-base font-bold text-[#141210]">
                              #{order.id.toUpperCase()}
                            </span>
                            <span className="text-xs text-[#777777]">· {order.createdAt}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2.5 pt-1">
                            {order.status && (
                              <span
                                className={`px-3 py-1 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1.5 ${getOrderStatusStyle(
                                  order.status
                                )}`}
                              >
                                <ShieldCheck size={12} />
                                {order.status}
                              </span>
                            )}
                            {order.promoCode && (
                              <span className="px-2.5 py-1 rounded-full bg-white border border-[#E8E6E1] text-[11px] font-semibold text-[#9A7953] inline-flex items-center gap-1">
                                <Tag size={11} /> {order.promoCode}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 border-t md:border-t-0 border-[#E8E6E1] pt-4 md:pt-0">
                          <div className="md:text-right">
                            <span className="block text-[10px] uppercase tracking-[0.16em] text-[#777777]">
                              Order Total
                            </span>
                            <p className="font-serif text-2xl sm:text-3xl font-semibold text-[#141210] tabular-nums">
                              {formatINR(order.total)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDownloadInvoice(order)}
                            disabled={isDownloading}
                            className="inline-flex items-center gap-2 rounded-[6px] bg-[#141210] hover:bg-[#2C2824] text-white text-[11px] font-bold uppercase tracking-[0.14em] px-4 py-2 transition-colors cursor-pointer disabled:opacity-60"
                          >
                            {isDownloading ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <Download size={13} className="text-[#D4AF7A]" />
                            )}
                            <span>{isDownloading ? "Preparing..." : "Download PDF Invoice"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Item Grid & Totals Meta */}
                      <div className="p-5 sm:p-7 space-y-5">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {order.items.map((item, idx) => {
                            const displayTitle =
                              item.title || item.name || "Signature Eau De Parfum";
                            return (
                              <li
                                key={`${order.id}-item-${idx}`}
                                className="flex gap-3.5 items-center p-3 rounded-[8px] bg-[#F7F6F3] border border-[#E8E6E1]"
                              >
                                <div className="relative w-16 h-16 bg-white shrink-0 border border-[#E8E6E1] rounded-[6px] overflow-hidden p-1">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={displayTitle}
                                    fill
                                    sizes="64px"
                                    className="object-contain"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-[#242424] leading-snug line-clamp-2">
                                    {displayTitle}
                                  </p>
                                  {item.variantTitle &&
                                    item.variantTitle !== "Default Title" && (
                                      <p className="text-[11px] text-[#777777] mt-0.5">
                                        {item.variantTitle}
                                      </p>
                                    )}
                                  <div className="flex justify-between items-center text-xs text-[#5C5954] mt-1.5">
                                    <span>Qty: {item.quantity || 1}</span>
                                    <span className="font-bold text-[#242424] tabular-nums">
                                      {Number(item.price || 0) === 0
                                        ? "FREE"
                                        : formatINR(item.price)}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>

                        {(savings > 0 || order.paymentMode || order.trackingId) && (
                          <div className="pt-4 border-t border-[#E8E6E1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5C5954]">
                            <div className="flex flex-wrap items-center gap-4">
                              {savings > 0 && (
                                <span className="font-semibold text-[#347A54]">
                                  Total Savings: −{formatINR(savings)}
                                </span>
                              )}
                              {order.paymentMode && (
                                <span>
                                  Mode:{" "}
                                  <strong className="text-[#242424] uppercase">
                                    {order.paymentMode}
                                  </strong>
                                </span>
                              )}
                              {order.trackingId && (
                                <span className="inline-flex items-center gap-1.5">
                                  <Package size={14} className="text-[#9A7953]" />
                                  AWB:{" "}
                                  <strong className="font-mono text-[#242424]">
                                    {order.trackingId}
                                  </strong>
                                </span>
                              )}
                            </div>

                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-luxury-secondary px-4 py-2 text-[11px] inline-flex items-center gap-1.5 w-fit"
                              >
                                <span>Track Shipment</span>
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Saved Favourites Tab */}
        {activeTab === "favourites" && (
          <div>
            {loadingFavs ? (
              <div className="py-16 flex justify-center">
                <Loader2 size={28} className="text-[#9A7953] animate-spin" />
              </div>
            ) : favourites.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#E8E6E1] rounded-[12px] shadow-sm flex flex-col items-center px-4">
                <div className="w-16 h-16 rounded-full bg-[#F7F6F3] border border-[#E8E6E1] flex items-center justify-center mb-5">
                  <Heart size={28} className="text-[#9A7953]" />
                </div>
                <p className="text-[#5C5954] text-lg font-serif mb-6">
                  You haven&apos;t saved any favourite fragrances yet.
                </p>
                <Link
                  href="/collections/all"
                  className="btn-luxury-primary px-8 py-3.5 text-xs"
                >
                  Discover Fragrances
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {favourites.map((fav) => (
                  <Link
                    key={fav.id}
                    href={`/products/${fav.handle || fav.id}`}
                    className="group bg-white border border-[#E8E6E1] rounded-[10px] shadow-sm overflow-hidden flex flex-col hover:border-[#9A7953] transition-colors"
                  >
                    <div className="relative aspect-[4/5] bg-[#F7F6F3] w-full overflow-hidden p-3">
                      <Image
                        src={fav.image || "/placeholder.svg"}
                        alt={fav.title}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between bg-white border-t border-[#E8E6E1]">
                      <p className="font-serif text-sm font-medium text-[#242424] leading-snug mb-2 line-clamp-2">
                        {fav.title}
                      </p>
                      <p className="font-bold text-[#9A7953] text-sm tabular-nums">
                        {formatINR(fav.price)}
                      </p>
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

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center bg-[#F7F6F3]">
          <Loader2 size={28} className="text-[#9A7953] animate-spin" />
        </div>
      }
    >
      <AccountContent />
    </Suspense>
  );
}
