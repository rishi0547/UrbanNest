"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Package,
  CheckCircle2,
  ShieldCheck,
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Home,
  ArrowRight,
  Edit3,
  Check,
  AlertCircle,
  Loader2,
  Camera,
  X,
  Copy,
  ExternalLink,
  Clock,
  Sparkles,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { updateProfileAction } from "@/features/profile/actions";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { formatINR } from "@/utils/currency";
import { isValidImageUrl, extractUrlIfHtml } from "../utils";

export interface OrderItemSummary {
  id: string;
  product_name: string;
  quantity: number;
  line_total: number;
}

export interface UserOrderRecord {
  id: string;
  order_number?: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  total_amount?: number;
  created_at: string;
  order_items?: OrderItemSummary[];
}

export interface ProfileViewProps {
  user: {
    id: string;
    email?: string;
    createdAt?: string;
  };
  profile: {
    fullName: string;
    email: string;
    role: string;
    avatarUrl?: string | null;
    createdAt?: string;
  };
  ordersSummary: {
    totalOrders: number;
    completedOrders: number;
    inProgressOrders?: number;
  };
  recentOrders?: UserOrderRecord[];
  redirectTo?: string | null;
}

export function ProfileView({
  user,
  profile,
  ordersSummary,
  recentOrders = [],
  redirectTo,
}: ProfileViewProps) {
  const router = useRouter();
  const [currentProfile, setCurrentProfile] = useState({
    fullName: profile.fullName,
    avatarUrl: profile.avatarUrl || "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [avatarError, setAvatarError] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Form submit state
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isAdmin = profile.role === "admin";

  const memberSince = profile.createdAt || user.createdAt
    ? new Date(profile.createdAt || user.createdAt!).toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "Recently joined";

  // Monogram / Avatar initials
  const initials =
    currentProfile.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "UN";

  const handleCopyUserId = async () => {
    try {
      if (typeof window !== "undefined" && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(user.id);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      } else if (typeof document !== "undefined") {
        const textArea = document.createElement("textarea");
        textArea.value = user.id;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
      }
    } catch {
      // Gracefully handle clipboard errors
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const trimmedName = fullName.trim();
    const rawAvatar = extractUrlIfHtml(avatarUrl.trim());

    if (rawAvatar && !isValidImageUrl(rawAvatar)) {
      setStatusMessage({
        type: "error",
        text: "Please provide a valid direct image URL starting with https:// or http://",
      });
      setIsSaving(false);
      return;
    }

    try {
      const res = await updateProfileAction({
        fullName: trimmedName,
        avatarUrl: rawAvatar || undefined,
      });

      if (!res.success) {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to update profile. Please review details.",
        });
      } else {
        setCurrentProfile({
          fullName: trimmedName,
          avatarUrl: rawAvatar,
        });
        setFullName(trimmedName);
        setAvatarUrl(rawAvatar);
        setStatusMessage({
          type: "success",
          text: "Profile updated successfully.",
        });
        setIsEditing(false);
        router.refresh();
      }
    } catch {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(currentProfile.fullName);
    setAvatarUrl(currentProfile.avatarUrl);
    setAvatarError(false);
    setStatusMessage(null);
    setIsEditing(false);
  };

  const inProgressCount =
    ordersSummary.inProgressOrders ??
    Math.max(0, ordersSummary.totalOrders - ordersSummary.completedOrders);

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E5E2DC] pb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-[#1A1A1A] transition-colors group"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Storefront</span>
          </Link>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[#6B7280]">
            <Link href="/" className="hover:text-[#1A1A1A] transition-colors">
              Storefront
            </Link>
            <ChevronRight className="size-3 text-[#A3A3A3]" />
            <span className="font-semibold text-[#1A1A1A]">My Account</span>
          </nav>
        </div>

        {/* Page Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#1A1A1A]">
            My Account
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Manage your personal profile, order fulfillment activity and account preferences.
          </p>
        </div>

        {/* Account Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none border-b border-[#E5E2DC] pb-3">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-lg bg-[#5D6B4D] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs"
          >
            <UserIcon className="size-3.5" />
            <span>Overview</span>
          </Link>

          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-[#E5E2DC] px-3.5 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]/60 transition-colors shadow-2xs"
          >
            <Package className="size-3.5 text-[#A3A3A3]" />
            <span>Orders ({ordersSummary.totalOrders})</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-white border border-[#E5E2DC] px-3.5 py-1.5 text-xs font-medium text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]/60 transition-colors shadow-2xs"
          >
            <ShoppingBag className="size-3.5 text-[#A3A3A3]" />
            <span>Browse Catalog</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-[#5D6B4D]/30 px-3.5 py-1.5 text-xs font-semibold text-[#5D6B4D] hover:bg-[#5D6B4D]/10 transition-colors shadow-2xs ml-auto"
            >
              <ShieldCheck className="size-3.5" />
              <span>Admin Console</span>
              <ExternalLink className="size-3 text-[#5D6B4D]/70" />
            </Link>
          )}
        </div>

        {/* Admin Access Callout (Visible only to Administrators) */}
        {isAdmin && (
          <div className="rounded-xl border border-[#5D6B4D]/30 bg-white p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="size-10 rounded-xl bg-[#5D6B4D]/10 border border-[#5D6B4D]/20 text-[#5D6B4D] flex items-center justify-center shrink-0">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5D6B4D] block">
                  Administrative Access Granted
                </span>
                <h2 className="text-sm font-bold text-[#1A1A1A] mt-0.5">
                  UrbanNest Executive Console
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  You hold operations permissions to manage catalog pieces, pricing, inventory and the order pipeline.
                </p>
              </div>
            </div>

            <Link href={redirectTo || "/admin"} className="shrink-0">
              <Button
                size="sm"
                className="rounded-lg bg-[#5D6B4D] hover:bg-[#4E5A40] text-white text-xs font-semibold px-4 h-9 shadow-xs flex items-center gap-1.5"
              >
                <span>Open Admin Console</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Redirect notice if user came with redirectTo=/admin */}
        {redirectTo && redirectTo.startsWith("/admin") && !isAdmin && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 flex items-center gap-2.5">
            <AlertCircle className="size-4 shrink-0 text-amber-600" />
            <span>
              You requested access to an administrative area, but your current account holds customer permissions.
            </span>
          </div>
        )}

        {/* Status Notification Banner */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between gap-3 border transition-all ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-rose-50 text-rose-800 border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === "success" ? (
                <Check className="size-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle className="size-4 shrink-0 text-rose-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-[#6B7280] hover:text-[#1A1A1A] p-1 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        {/* Profile Hero (Main Identity Section) */}
        <div className="relative overflow-hidden rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            {/* Identity & Avatar */}
            <div className="flex flex-col min-[480px]:flex-row items-start min-[480px]:items-center gap-5">
              {/* Avatar Frame with Monogram or Image */}
              <div className="relative flex size-20 sm:size-24 shrink-0 items-center justify-center rounded-2xl bg-[#F0EDE8] border border-[#E5E2DC] text-[#1A1A1A] font-heading text-2xl sm:text-3xl font-bold tracking-tight shadow-inner overflow-hidden">
                {isValidImageUrl(currentProfile.avatarUrl) && !avatarError ? (
                  <Image
                    src={currentProfile.avatarUrl!}
                    alt={currentProfile.fullName}
                    width={96}
                    height={96}
                    className="size-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Identity Details */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A] break-words">
                    {currentProfile.fullName}
                  </h2>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#5D6B4D] text-white px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider shadow-2xs">
                      <ShieldCheck className="size-3" />
                      Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0EDE8] border border-[#E5E2DC] px-2.5 py-0.5 text-[11px] font-semibold text-[#5D6B4D]">
                      <span className="size-1.5 rounded-full bg-[#5D6B4D]" />
                      Verified Patron
                    </span>
                  )}
                </div>

                <p className="flex items-center gap-2 text-xs sm:text-sm text-[#6B7280] font-medium truncate">
                  <Mail className="size-3.5 text-[#5D6B4D] shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </p>

                <p className="flex items-center gap-2 text-xs text-[#8A8F98]">
                  <Calendar className="size-3 text-[#A3A3A3] shrink-0" />
                  <span>Member since {memberSince}</span>
                </p>
              </div>
            </div>

            {/* Edit Action Button */}
            <div className="sm:self-center w-full sm:w-auto">
              <Button
                variant={isEditing ? "secondary" : "outline"}
                onClick={() => {
                  if (isEditing) {
                    handleCancel();
                  } else {
                    setIsEditing(true);
                    setStatusMessage(null);
                  }
                }}
                className="w-full sm:w-auto rounded-lg border-[#E5E2DC] bg-white text-xs font-semibold px-4 h-10 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#F0EDE8]/60 transition-colors"
              >
                <Edit3 className="size-3.5 text-[#5D6B4D]" />
                <span>{isEditing ? "Close Editor" : "Edit Profile"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Inline Profile Editor Form */}
        {isEditing && (
          <div className="rounded-xl border border-[#5D6B4D]/30 bg-white p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in-50 duration-200">
            <div className="border-b border-[#E5E2DC] pb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                  Account Settings
                </span>
                <h3 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                  Edit Personal Information
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Update your patron name and public monogram avatar photo
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#5D6B4D] bg-[#5D6B4D]/10 px-2.5 py-1 rounded-full">
                Supabase Sync
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs font-semibold text-[#1A1A1A]">
                    Full Name <span className="text-rose-600">*</span>
                  </Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8A8F98]" />
                    <Input
                      id="full_name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name"
                      required
                      className="pl-10 h-10 rounded-lg border-[#E5E2DC] focus:border-[#5D6B4D] text-xs sm:text-sm bg-[#F8F6F2]/30"
                    />
                  </div>
                </div>

                {/* Avatar URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="avatar_url" className="text-xs font-semibold text-[#1A1A1A]">
                    Avatar Image URL
                  </Label>
                  <div className="relative">
                    <Camera className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#8A8F98]" />
                    <Input
                      id="avatar_url"
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => {
                        const cleaned = extractUrlIfHtml(e.target.value);
                        setAvatarUrl(cleaned);
                        setAvatarError(false);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="pl-10 h-10 rounded-lg border-[#E5E2DC] focus:border-[#5D6B4D] text-xs sm:text-sm bg-[#F8F6F2]/30"
                    />
                  </div>
                </div>
              </div>

              {/* Avatar Preview */}
              {avatarUrl.trim() && (
                <div className="p-3.5 rounded-lg bg-[#F8F6F2] border border-[#E5E2DC] flex items-center gap-3">
                  {isValidImageUrl(avatarUrl.trim()) ? (
                    <>
                      <div className="size-10 rounded-lg overflow-hidden bg-white border border-[#E5E2DC] shrink-0">
                        <Image
                          src={avatarUrl.trim()}
                          alt="Avatar Preview"
                          width={40}
                          height={40}
                          className="size-full object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      </div>
                      <div className="text-xs">
                        <p className="font-semibold text-[#1A1A1A]">Avatar Preview</p>
                        <p className="text-[11px] text-[#6B7280]">
                          {avatarError
                            ? "Unable to load image from this URL. Please verify the direct image link."
                            : "Image loaded and ready to save."}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2.5 text-xs text-amber-800">
                      <AlertCircle className="size-4 shrink-0 text-amber-600" />
                      <span>
                        Please enter a direct image URL (starting with https:// or http://). Attribution text or HTML tags cannot be used as an image URL.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-lg border-[#E5E2DC] text-xs font-semibold px-4 h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-lg bg-[#5D6B4D] hover:bg-[#4E5A40] text-white text-xs font-semibold px-6 h-9 flex items-center justify-center gap-2 shadow-xs"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Orders at a Glance & Recent Activity */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#E5E2DC] pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
                Orders At A Glance
              </span>
              <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
                Purchasing &amp; Delivery Activity
              </h2>
              <p className="text-xs text-[#6B7280]">
                Review the progress of your architectural furnishings and shipments.
              </p>
            </div>
            
            <Link
              href="/orders"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors"
            >
              <span>View All Orders ({ordersSummary.totalOrders})</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {/* Metric Counters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Orders */}
            <div className="rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/40 p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                  Total Orders
                </span>
                <div className="font-heading text-2xl font-bold text-[#1A1A1A] mt-1">
                  {ordersSummary.totalOrders}
                </div>
                <span className="text-[11px] text-[#6B7280]">Lifetime transactions</span>
              </div>
              <div className="size-9 rounded-lg bg-white border border-[#E5E2DC] text-[#5D6B4D] flex items-center justify-center">
                <Package className="size-4" />
              </div>
            </div>

            {/* Completed Orders */}
            <div className="rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/40 p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                  Delivered Pieces
                </span>
                <div className="font-heading text-2xl font-bold text-emerald-700 mt-1">
                  {ordersSummary.completedOrders}
                </div>
                <span className="text-[11px] text-[#6B7280]">Successfully received</span>
              </div>
              <div className="size-9 rounded-lg bg-white border border-[#E5E2DC] text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="size-4" />
              </div>
            </div>

            {/* In-Progress */}
            <div className="rounded-lg border border-[#E5E2DC] bg-[#F8F6F2]/40 p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] block">
                  Active Fulfillment
                </span>
                <div className="font-heading text-2xl font-bold text-amber-700 mt-1">
                  {inProgressCount}
                </div>
                <span className="text-[11px] text-[#6B7280]">
                  {inProgressCount === 0 ? "All pieces delivered" : "Awaiting dispatch"}
                </span>
              </div>
              <div className="size-9 rounded-lg bg-white border border-[#E5E2DC] text-amber-600 flex items-center justify-center">
                <Clock className="size-4" />
              </div>
            </div>
          </div>

          {/* Recent Orders List / Empty State */}
          {recentOrders.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#E5E2DC] bg-[#F8F6F2]/30 py-12 px-4 text-center max-w-sm mx-auto space-y-3">
              <div className="size-11 rounded-full bg-white border border-[#E5E2DC] mx-auto flex items-center justify-center text-[#6B7280]">
                <ShoppingBag className="size-5" />
              </div>
              <div>
                <h4 className="font-heading text-base font-bold text-[#1A1A1A]">
                  No orders recorded yet
                </h4>
                <p className="text-xs text-[#6B7280] mt-1">
                  Your curated furniture acquisitions will appear here once you place your first order.
                </p>
              </div>
              <Link href="/products">
                <Button
                  size="sm"
                  className="rounded-lg bg-[#5D6B4D] hover:bg-[#4E5A40] text-white text-xs font-semibold px-4 h-9 shadow-xs"
                >
                  Explore Collections
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E5E2DC] text-[11px] uppercase tracking-wider text-[#6B7280] font-semibold">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Date Placed</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Total</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E2DC]/60 font-medium">
                  {recentOrders.map((order) => {
                    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const orderTotal = formatINR(Number(order.total || order.total_amount || 0));
                    const displayId = order.order_number || `#${order.id.slice(0, 8).toUpperCase()}`;

                    return (
                      <tr key={order.id} className="hover:bg-[#F8F6F2]/60 transition-colors group">
                        <td className="py-3.5 px-3 font-mono font-bold text-[#1A1A1A]">
                          {displayId}
                        </td>
                        <td className="py-3.5 px-3 text-[#6B7280]">
                          {orderDate}
                        </td>
                        <td className="py-3.5 px-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-[#1A1A1A]">
                          {orderTotal}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <Link
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors"
                          >
                            <span>View Order</span>
                            <ArrowRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Account Details & Security Information Panel */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="border-b border-[#E5E2DC] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
              Registry
            </span>
            <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
              Account Details &amp; Identity
            </h2>
            <p className="text-xs text-[#6B7280]">
              Personal credentials and registered membership information.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="rounded-lg border border-[#E5E2DC]/80 bg-[#F8F6F2]/40 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <UserIcon className="size-3.5 text-[#5D6B4D]" />
                Full Name
              </span>
              <p className="text-sm font-semibold text-[#1A1A1A]">{currentProfile.fullName}</p>
            </div>

            {/* Email Address */}
            <div className="rounded-lg border border-[#E5E2DC]/80 bg-[#F8F6F2]/40 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <Mail className="size-3.5 text-[#5D6B4D]" />
                Email Address
              </span>
              <p className="text-sm font-semibold text-[#1A1A1A] truncate">{profile.email}</p>
            </div>

            {/* Member Since */}
            <div className="rounded-lg border border-[#E5E2DC]/80 bg-[#F8F6F2]/40 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#5D6B4D]" />
                Member Since
              </span>
              <p className="text-sm font-semibold text-[#1A1A1A]">{memberSince}</p>
            </div>

            {/* Account Security */}
            <div className="rounded-lg border border-[#E5E2DC]/80 bg-[#F8F6F2]/40 p-4 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <Shield className="size-3.5 text-emerald-600" />
                Security Status
              </span>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-emerald-500" />
                <p className="text-sm font-semibold text-emerald-700">
                  Secure Session Active
                </p>
              </div>
            </div>
          </div>

          {/* Technical Metadata Row with Copy ID */}
          <div className="rounded-lg border border-[#E5E2DC]/70 bg-[#F8F6F2]/30 p-3.5 text-xs text-[#6B7280] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-[11px] truncate">
              <span className="text-[#A3A3A3]">USER ID:</span>
              <span className="text-[#1A1A1A] select-all truncate">{user.id}</span>
              <button
                type="button"
                onClick={handleCopyUserId}
                className="inline-flex items-center gap-1 text-[11px] font-sans font-semibold text-[#5D6B4D] hover:text-[#4E5A40] transition-colors ml-1 cursor-pointer"
                title="Copy User ID to clipboard"
              >
                {copiedId ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <span className="text-[11px] text-[#A3A3A3]">
              Secured by Supabase Identity &amp; PostgreSQL RLS
            </span>
          </div>
        </div>

        {/* Quick Links Section */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-2xs space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#5D6B4D]">
              Navigation
            </span>
            <h2 className="font-heading text-lg font-bold text-[#1A1A1A] mt-0.5">
              Quick Shortcuts
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Orders shortcut */}
            <Link
              href="/orders"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/50 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <Package className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Orders
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    View and track purchases
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Storefront shortcut */}
            <Link
              href="/products"
              className="group flex items-center justify-between p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/50 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all duration-200 shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#E5E2DC] group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                  <Home className="size-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                    Storefront
                  </h3>
                  <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                    Browse design collections
                  </p>
                </div>
              </div>
              <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>

            {/* Admin Dashboard shortcut if admin */}
            {isAdmin ? (
              <Link
                href={redirectTo || "/admin"}
                className="group flex items-center justify-between p-4 rounded-xl border border-[#5D6B4D]/30 bg-[#5D6B4D]/5 hover:bg-[#5D6B4D] hover:border-[#5D6B4D] transition-all duration-200 shadow-2xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-white border border-[#5D6B4D]/30 group-hover:bg-white/20 group-hover:border-white/30 text-[#5D6B4D] group-hover:text-white transition-colors">
                    <ShieldCheck className="size-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1A1A1A] group-hover:text-white transition-colors">
                      Admin Console
                    </h3>
                    <p className="text-xs text-[#6B7280] group-hover:text-white/80 transition-colors">
                      Manage catalog &amp; orders
                    </p>
                  </div>
                </div>
                <ArrowRight className="size-4 text-[#A3A3A3] group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
            ) : (
              <div className="p-4 rounded-xl border border-[#E5E2DC] bg-[#F8F6F2]/30 flex items-center gap-3 text-xs text-[#6B7280]">
                <Sparkles className="size-4 text-[#5D6B4D]" />
                <span>Complimentary design consultation available on all pieces.</span>
              </div>
            )}
          </div>
        </div>

        {/* Account Session / Sign Out Section */}
        <div className="rounded-xl border border-[#E5E2DC] bg-white p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">
              Session Management
            </h3>
            <p className="text-xs text-[#6B7280]">
              Sign out of your UrbanNest patron account on this device.
            </p>
          </div>

          <LogoutButton
            variant="outline"
            className="rounded-lg border-rose-200 bg-white text-rose-700 hover:bg-rose-50 hover:text-rose-800 text-xs font-semibold px-4 h-9 shadow-2xs transition-colors"
          />
        </div>

        {/* Concierge Support Notice */}
        <div className="rounded-xl border border-[#E5E2DC] bg-[#F0EDE8]/60 p-5 text-center space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5D6B4D] block">
            UrbanNest Concierge
          </span>
          <p className="text-xs text-[#6B7280] max-w-lg mx-auto">
            Questions regarding an order delivery, custom dimensions or account assistance? Our white-glove team is available daily at{" "}
            <a href="mailto:hello@urbannest.com" className="text-[#1A1A1A] font-semibold underline hover:text-[#5D6B4D]">
              hello@urbannest.com
            </a>
          </p>
        </div>

      </div>
    </div>
  );
}
