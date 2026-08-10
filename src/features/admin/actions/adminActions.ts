"use server";

import {
  OrderStatusSchema,
  BookingFormSchema,
  LocationFormSchema,
  MenuItemFormSchema,
  StaffUserFormSchema,
} from "../lib/validation";
import { UserRole } from "../types/admin";

export async function updateOrderStatusAction(
  formData: unknown,
  userRole: UserRole
) {
  const result = OrderStatusSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  // Role validation: staff, manager, owner can update order status
  if (!["owner", "manager", "staff"].includes(userRole)) {
    return { success: false, error: "Unauthorized: Insufficient role permissions." };
  }

  // Simulated server mutation delay
  await new Promise((res) => setTimeout(res, 200));

  return {
    success: true,
    data: result.data,
    message: `Order #${result.data.orderId} status updated to ${result.data.status}.`,
  };
}

export async function createBookingAction(
  formData: unknown,
  userRole: UserRole
) {
  const result = BookingFormSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  if (!["owner", "manager", "staff"].includes(userRole)) {
    return { success: false, error: "Unauthorized: Insufficient permissions to create booking." };
  }

  await new Promise((res) => setTimeout(res, 250));

  return {
    success: true,
    data: result.data,
    message: `Booking created for ${result.data.customerName} (${result.data.partySize} guests).`,
  };
}

export async function updateLocationAction(
  formData: unknown,
  userRole: UserRole
) {
  if (userRole !== "owner") {
    return {
      success: false,
      error: "Permission Denied: Only Owners can edit location hours and settings.",
    };
  }

  const result = LocationFormSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  return {
    success: true,
    data: result.data,
    message: "Location configuration updated successfully.",
  };
}

export async function updateMenuItemAction(
  formData: unknown,
  userRole: UserRole
) {
  if (!["owner", "manager"].includes(userRole)) {
    return {
      success: false,
      error: "Permission Denied: Staff members cannot modify menu catalog.",
    };
  }

  const result = MenuItemFormSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  return {
    success: true,
    data: result.data,
    message: "Menu item updated.",
  };
}

export async function inviteStaffAction(
  formData: unknown,
  userRole: UserRole
) {
  if (userRole !== "owner") {
    return {
      success: false,
      error: "Permission Denied: Only Owners can invite or assign staff roles.",
    };
  }

  const result = StaffUserFormSchema.safeParse(formData);
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }

  return {
    success: true,
    data: result.data,
    message: `Invitation sent to ${result.data.email} as ${result.data.role.toUpperCase()}.`,
  };
}
