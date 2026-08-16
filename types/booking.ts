import type { Vehicle } from "./vehicle";

export interface RentalOption {
  id: string;
  label: { fr: string; en: string };
  description: { fr: string; en: string };
  price: number | null;
  icon: "baby" | "driver" | "delivery" | "route";
}

export interface PickupLocation {
  id: string;
  label: { fr: string; en: string };
}

export interface Customer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  message: string;
}

export interface Booking {
  pickupDate: string;
  pickupTime: string;
  returnDate: string;
  returnTime: string;
  pickupLocation: string;
  customAddress: string;
  selectedVehicle: Vehicle | null;
  selectedOptions: string[];
  customer: Customer;
}

export interface Quote {
  rentalDays: number;
  rentalSubtotal: number;
  extrasTotal: number;
  total: number;
}
