"use client";

import { CalendarDays, Clock3, Info, MapPin } from "lucide-react";
import Image from "next/image";
import { useBooking } from "../../context/BookingContext";
import { demoRentalOptions, pickupLocations } from "../../data/options";
import type { Locale } from "../../i18n/translations";
import { calculateQuote } from "../../lib/pricing";

export function QuoteCard({ locale, t, showBreakdown = true }: { locale: Locale; t: (key: string) => string; showBreakdown?: boolean }) {
  const { booking } = useBooking();
  const quote = calculateQuote(booking.pickupDate, booking.returnDate, booking.selectedVehicle, booking.selectedOptions, demoRentalOptions);
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
  const location = pickupLocations.find((item) => item.id === booking.pickupLocation)?.label[locale];

  return (
    <aside className="quote-card" aria-label={t("quote.title")}>
      <div className="quote-topline"><span>{t("quote.title")}</span><span className="secure-pill">SSL · 100%</span></div>
      {booking.selectedVehicle && (
        <div className="quote-vehicle">
          <Image src={booking.selectedVehicle.images[0]} alt="" width={144} height={104} />
          <div><strong>{booking.selectedVehicle.name}</strong><span>{booking.selectedVehicle.category}</span></div>
        </div>
      )}
      <div className="quote-dates">
        <div><CalendarDays size={17} /><span><small>{t("booking.pickup")}</small><strong>{formatDate(booking.pickupDate)}</strong><em><Clock3 size={13} /> {booking.pickupTime}</em></span></div>
        <div><CalendarDays size={17} /><span><small>{t("booking.return")}</small><strong>{formatDate(booking.returnDate)}</strong><em><Clock3 size={13} /> {booking.returnTime}</em></span></div>
        {location && <div><MapPin size={17} /><span><small>{t("booking.location")}</small><strong>{location}</strong></span></div>}
      </div>
      {showBreakdown && booking.selectedVehicle && (
        <div className="quote-breakdown">
          <div><span>{quote.rentalDays} {t("quote.days")} × {booking.selectedVehicle.dailyRate} DT</span><strong>{quote.rentalSubtotal} DT</strong></div>
          {demoRentalOptions.filter((o) => booking.selectedOptions.includes(o.id)).map((option) => (
            <div key={option.id}><span>{option.label[locale]}</span><strong>{option.price === null ? t("quote.onRequest") : `+${option.price} DT`}</strong></div>
          ))}
        </div>
      )}
      <div className="quote-total"><span>{t("quote.estimate")}</span><strong>{quote.total} <small>DT</small></strong></div>
      <p className="quote-note"><Info size={14} /> {t("quote.note")}</p>
    </aside>
  );
}
