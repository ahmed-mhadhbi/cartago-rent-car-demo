"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, CalendarDays, Clock3, MapPin } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { validateDateRange } from "../../lib/pricing";

const nextDay = (value: string) => {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function BookingSearch({ t, compact = false, onSearch }: { t: (key: string) => string; compact?: boolean; onSearch: () => void }) {
  const { booking, updateBooking } = useBooking();
  const [error, setError] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateDateRange(booking.pickupDate, booking.returnDate);
    if (validation) {
      setError(t("search.error"));
      return;
    }
    setError("");
    onSearch();
  };

  return (
    <form className={`booking-search ${compact ? "booking-search-compact" : ""}`} onSubmit={submit} noValidate>
      <div className="search-field search-location">
        <label htmlFor={compact ? "pickup-place-compact" : "pickup-place"}>{t("search.location")}</label>
        <div className="field-control"><MapPin size={18} /><input id={compact ? "pickup-place-compact" : "pickup-place"} value="Mahdia" readOnly /></div>
      </div>
      <div className="search-field">
        <label htmlFor={compact ? "pickup-date-compact" : "pickup-date"}>{t("search.pickupDate")}</label>
        <div className="field-control"><CalendarDays size={18} /><input id={compact ? "pickup-date-compact" : "pickup-date"} type="date" value={booking.pickupDate} min="2026-08-16" onChange={(e) => updateBooking({ pickupDate: e.target.value })} required /></div>
      </div>
      <div className="search-field time-field">
        <label htmlFor={compact ? "pickup-time-compact" : "pickup-time"}>{t("search.pickupTime")}</label>
        <div className="field-control"><Clock3 size={18} /><input id={compact ? "pickup-time-compact" : "pickup-time"} type="time" value={booking.pickupTime} onChange={(e) => updateBooking({ pickupTime: e.target.value })} required /></div>
      </div>
      <div className="search-field">
        <label htmlFor={compact ? "return-date-compact" : "return-date"}>{t("search.returnDate")}</label>
        <div className="field-control"><CalendarDays size={18} /><input id={compact ? "return-date-compact" : "return-date"} type="date" value={booking.returnDate} min={nextDay(booking.pickupDate)} onChange={(e) => updateBooking({ returnDate: e.target.value })} required /></div>
      </div>
      <div className="search-field time-field">
        <label htmlFor={compact ? "return-time-compact" : "return-time"}>{t("search.returnTime")}</label>
        <div className="field-control"><Clock3 size={18} /><input id={compact ? "return-time-compact" : "return-time"} type="time" value={booking.returnTime} onChange={(e) => updateBooking({ returnTime: e.target.value })} required /></div>
      </div>
      <button className="search-submit" type="submit"><span>{t("search.submit")}</span><ArrowRight size={20} /></button>
      {error && <p className="form-error search-error" role="alert">{error}</p>}
    </form>
  );
}
