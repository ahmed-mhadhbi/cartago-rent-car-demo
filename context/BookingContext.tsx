"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Booking } from "../types/booking";

const initialBooking: Booking = {
  pickupDate: "2026-08-18",
  pickupTime: "10:00",
  returnDate: "2026-08-22",
  returnTime: "10:00",
  pickupLocation: "agency",
  customAddress: "",
  selectedVehicle: null,
  selectedOptions: [],
  customer: { firstName: "", lastName: "", phone: "", email: "", message: "" },
};

interface BookingContextValue {
  booking: Booking;
  updateBooking: (patch: Partial<Booking>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<Booking>(initialBooking);

  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem("cartago-booking");
      if (saved) window.setTimeout(() => setBooking({ ...initialBooking, ...JSON.parse(saved) }), 0);
    } catch {
      // Storage is an enhancement; the booking still works without it.
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem("cartago-booking", JSON.stringify(booking));
    } catch {
      // Ignore restricted browser storage.
    }
  }, [booking]);

  const value = useMemo(() => ({
    booking,
    updateBooking: (patch: Partial<Booking>) => setBooking((current) => ({ ...current, ...patch })),
    resetBooking: () => setBooking(initialBooking),
  }), [booking]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used inside BookingProvider");
  return context;
}
