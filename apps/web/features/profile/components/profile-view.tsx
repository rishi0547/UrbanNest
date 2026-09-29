"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
  ExternalLink,
  Edit3,
  Check,
  AlertCircle,
  Loader2,
  Camera,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { updateProfileAction } from "@/features/auth/actions";

interface ProfileViewProps {
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
  };
}

export function ProfileView({ user, profile, ordersSummary }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile.fullName);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || "");
  const [avatarError, setAvatarError] = useState(false);

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
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "UN";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await updateProfileAction({
        fullName,
        avatarUrl: avatarUrl.trim() || undefined,
      });

      if (!res.success) {
        setStatusMessage({
          type: "error",
          text: res.error || "Failed to update profile. Please try again.",
        });
      } else {
        setStatusMessage({
          type: "success",
          text: "Profile updated successfully.",
        });
        setIsEditing(false);
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
    setFullName(profile.fullName);
    setAvatarUrl(profile.avatarUrl || "");
    setStatusMessage(null);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation & Breadcrumb Header */}
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
              Home
            </Link>
            <ChevronRight className="size-3 text-[#A3A3A3]" />
            <span className="font-semibold text-[#1A1A1A]">My Profile</span>
          </nav>
        </div>

        {/* Status Notification */}
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

        {/* Profile Header Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* User Avatar with Image or Luxury Monogram */}
              <div className="relative flex size-20 shrink-0 items-center justify-center rounded-2xl bg-[#5D6B4D]/10 border border-[#5D6B4D]/20 text-[#5D6B4D] font-heading text-2xl font-bold tracking-tight shadow-inner overflow-hidden">
                {avatarUrl && !avatarError ? (
                  <Image
                    src={avatarUrl}
                    alt={fullName}
                    width={80}
                    height={80}
                    className="size-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
                    {fullName}
                  </h1>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#5D6B4D] text-white px-2.5 py-0.5 text-xs font-semibold tracking-wide shadow-2xs">
                      <ShieldCheck className="size-3.5" />
                      Administrator
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F6F2] border border-[#E5E2DC] px-3 py-0.5 text-xs font-medium text-[#1A1A1A]">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Verified Patron
                    </span>
                  )}
                </div>
                <p className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6B7280]">
                  <Mail className="size-3.5 text-[#5D6B4D]" />
                  <span>{profile.email}</span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[#8A8F98]">
                  <Calendar className="size-3 text-[#5D6B4D]" />
                  <span>Member since {memberSince}</span>
                </p>
              </div>
            </div>

            <div className="sm:self-center">
              <Button
                variant={isEditing ? "secondary" : "outline"}
                onClick={() => {
                  setIsEditing(!isEditing);
                  setStatusMessage(null);
                }}
                className="rounded-full border-[#E5E2DC] text-xs font-semibold flex items-center gap-1.5"
              >
                <Edit3 className="size-3.5" />
                {isEditing ? "Close Editor" : "Edit Profile"}
              </Button>
            </div>
          </div>
        </div>

        {/* Edit Profile Section */}
        {isEditing && (
          <div className="rounded-2xl border border-[#5D6B4D]/30 bg-white p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in-50 duration-200">
            <div className="border-b border-[#E5E2DC] pb-4 flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">
                  Edit Profile Information
                </h2>
                <p className="text-xs text-[#6B7280] mt-0.5">
                  Update your display name and public avatar photo
                </p>
              </div>
              <span className="text-[11px] font-medium text-[#5D6B4D] bg-[#5D6B4D]/10 px-2.5 py-1 rounded-full">
                Supabase Profiles Sync
              </span>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="full_name" className="text-xs font-semibold text-[#1A1A1A]">
                    Full Name
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
                      className="pl-10 h-10 rounded-xl border-[#E5E2DC] focus:border-[#5D6B4D] text-sm"
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
                        setAvatarUrl(e.target.value);
                        setAvatarError(false);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="pl-10 h-10 rounded-xl border-[#E5E2DC] focus:border-[#5D6B4D] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Live Avatar Preview helper */}
              {avatarUrl && (
                <div className="p-3 rounded-xl bg-[#F8F6F2] border border-[#E5E2DC] flex items-center gap-3">
                  <div className="size-10 rounded-lg overflow-hidden bg-white border shrink-0">
                    <Image
                      src={avatarUrl}
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
                        ? "Unable to load image from this URL. Please verify the link."
                        : "Image loaded successfully."}
                    </p>
                  </div>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="rounded-full border-[#E5E2DC] text-xs font-semibold px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-full bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold px-6 flex items-center gap-2"
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

        {/* Orders Summary Cards */}
        <div className="space-y-3">
          <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Orders Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Total Orders Card */}
            <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-[#5D6B4D]/40">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
                  Total Orders
                </p>
                <p className="font-heading text-3xl font-bold text-[#1A1A1A]">
                  {ordersSummary.totalOrders}
                </p>
                <p className="text-xs text-[#6B7280]">All recorded lifetime orders</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-[#5D6B4D]/10 text-[#5D6B4D]">
                <Package className="size-6" />
              </div>
            </div>

            {/* Completed Orders Card */}
            <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 shadow-xs flex items-center justify-between transition-all hover:border-[#5D6B4D]/40">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider font-semibold text-[#6B7280]">
                  Completed Orders
                </p>
                <p className="font-heading text-3xl font-bold text-[#5D6B4D]">
                  {ordersSummary.completedOrders}
                </p>
                <p className="text-xs text-[#6B7280]">Successfully delivered pieces</p>
              </div>
              <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="size-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E5E2DC] pb-4">
            <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Account Details</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Personal credentials and registered membership information
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E5E2DC]/80 bg-[#F8F6F2]/50 p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <UserIcon className="size-3.5 text-[#5D6B4D]" />
                Full Name
              </p>
              <p className="text-sm font-semibold text-[#1A1A1A]">{fullName}</p>
            </div>

            <div className="rounded-xl border border-[#E5E2DC]/80 bg-[#F8F6F2]/50 p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <Mail className="size-3.5 text-[#5D6B4D]" />
                Email Address
              </p>
              <p className="text-sm font-semibold text-[#1A1A1A]">{profile.email}</p>
            </div>

            <div className="rounded-xl border border-[#E5E2DC]/80 bg-[#F8F6F2]/50 p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <Calendar className="size-3.5 text-[#5D6B4D]" />
                Member Since
              </p>
              <p className="text-sm font-semibold text-[#1A1A1A]">{memberSince}</p>
            </div>

            <div className="rounded-xl border border-[#E5E2DC]/80 bg-[#F8F6F2]/50 p-4 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] flex items-center gap-1.5">
                <Shield className="size-3.5 text-emerald-600" />
                Security Status
              </p>
              <p className="text-sm font-semibold text-emerald-700">
                Active Authenticated Session
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E2DC]/60 bg-[#F8F6F2]/30 p-3.5 text-xs text-[#6B7280] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="font-mono text-[11px] truncate">User ID: {user.id}</span>
            <span className="text-[11px] text-[#A3A3A3]">Secured by Supabase Identity</span>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="rounded-2xl border border-[#E5E2DC] bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#1A1A1A]">Account Actions</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/orders">
              <Button className="bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-full px-5 text-xs font-semibold flex items-center gap-2">
                <Package className="size-3.5" />
                View Orders
              </Button>
            </Link>

            <Link href="/">
              <Button
                variant="outline"
                className="border-[#E5E2DC] bg-white hover:bg-[#F8F6F2] text-[#1A1A1A] rounded-full px-5 text-xs font-semibold flex items-center gap-2"
              >
                <Home className="size-3.5" />
                Storefront
              </Button>
            </Link>

            {isAdmin && (
              <Link href="/admin">
                <Button className="bg-[#5D6B4D] hover:bg-[#4E5A40] text-white rounded-full px-5 text-xs font-semibold flex items-center gap-2">
                  <ShieldCheck className="size-3.5" />
                  Admin Dashboard
                  <ExternalLink className="size-3" />
                </Button>
              </Link>
            )}

            <LogoutButton
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-full px-5 text-xs font-semibold ml-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
