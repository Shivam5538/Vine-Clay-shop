import React from "react";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { ToastContainer } from "@/features/admin/components/ToastContainer";
import { OrderSidePanel } from "@/features/admin/components/OrderSidePanel";
import { BookingSidePanel } from "@/features/admin/components/BookingSidePanel";
import { CustomerSidePanel } from "@/features/admin/components/CustomerSidePanel";
import { NewBookingModal } from "@/features/admin/components/NewBookingModal";
import { NewLocationModal } from "@/features/admin/components/NewLocationModal";
import { NewMenuItemModal } from "@/features/admin/components/NewMenuItemModal";
import { InviteStaffModal } from "@/features/admin/components/InviteStaffModal";
import { AdminDataLoader } from "@/features/admin/components/AdminDataLoader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-sans antialiased">
      {/* Supabase live data sync — invisible, runs once on mount */}
      <AdminDataLoader />

      {/* Persistent Left Sidebar */}
      <AdminSidebar />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Sticky Top Header */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      {/* Floating Drawers & Modals */}
      <ToastContainer />
      <OrderSidePanel />
      <BookingSidePanel />
      <CustomerSidePanel />
      <NewBookingModal />
      <NewLocationModal />
      <NewMenuItemModal />
      <InviteStaffModal />
    </div>
  );
}
