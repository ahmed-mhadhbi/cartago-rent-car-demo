"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { Briefcase, ChevronRight, Fuel, Info, SlidersHorizontal, Snowflake, Users, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBooking } from "../../context/BookingContext";
import { demoFleet } from "../../data/fleet";
import { calculateQuote } from "../../lib/pricing";
import { demoRentalOptions } from "../../data/options";
import type { Locale } from "../../i18n/translations";
import type { Vehicle } from "../../types/vehicle";

type SortMode = "recommended" | "low" | "high";

const categoryEn: Record<string, string> = { Citadine: "City", Économique: "Economy", Berline: "Sedan", SUV: "SUV" };
const transmissionEn: Record<string, string> = { Manuelle: "Manual", Automatique: "Automatic" };

export function FleetSection({ locale, t, onReserve, recommendation }: { locale: Locale; t: (key: string) => string; onReserve: (vehicle: Vehicle) => void; recommendation?: { category: string; nonce: number } | null }) {
  const [category, setCategory] = useState(recommendation?.category ?? "Toutes");
  const [transmission, setTransmission] = useState("Toutes");
  const [seats, setSeats] = useState(4);
  const [budget, setBudget] = useState(200);
  const [sort, setSort] = useState<SortMode>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);

  const visibleFleet = useMemo(() => {
    const filtered = demoFleet.filter((vehicle) =>
      (category === "Toutes" || vehicle.category === category) &&
      (transmission === "Toutes" || vehicle.transmission === transmission) &&
      vehicle.seats >= seats && vehicle.dailyRate <= budget,
    );
    return filtered.sort((a, b) => sort === "low" ? a.dailyRate - b.dailyRate : sort === "high" ? b.dailyRate - a.dailyRate : Number(b.featured) - Number(a.featured));
  }, [category, transmission, seats, budget, sort]);

  const categoryLabel = (value: string) => locale === "en" ? categoryEn[value] ?? value : value;
  const transmissionLabel = (value: string) => locale === "en" ? transmissionEn[value] ?? value : value;

  const filters = (
    <div className="filters-panel">
      <div className="filters-mobile-head"><strong>{t("filter.title")}</strong><button onClick={() => setFiltersOpen(false)} aria-label="Fermer les filtres"><X /></button></div>
      <fieldset>
        <legend>{t("filter.category")}</legend>
        <div className="filter-chips">
          {["Toutes", "Citadine", "Économique", "Berline", "SUV"].map((value) => (
            <button type="button" key={value} className={category === value ? "active" : ""} onClick={() => setCategory(value)}>{value === "Toutes" ? t("filter.all") : categoryLabel(value)}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("filter.transmission")}</legend>
        <div className="segmented-control">
          {["Toutes", "Manuelle", "Automatique"].map((value) => (
            <button type="button" key={value} className={transmission === value ? "active" : ""} onClick={() => setTransmission(value)}>{value === "Toutes" ? t("filter.all") : transmissionLabel(value)}</button>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{t("filter.seats")}</legend>
        <div className="segmented-control two">
          {[4, 5].map((value) => <button type="button" key={value} className={seats === value ? "active" : ""} onClick={() => setSeats(value)}>{value}+</button>)}
        </div>
      </fieldset>
      <fieldset>
        <legend><span>{t("filter.budget")}</span><strong>{budget} DT</strong></legend>
        <input className="range" type="range" min="90" max="200" step="5" value={budget} onChange={(e) => setBudget(Number(e.target.value))} aria-label={t("filter.budget")} />
        <div className="range-labels"><span>90 DT</span><span>200 DT</span></div>
      </fieldset>
      <button type="button" className="button button-dark filter-apply" onClick={() => setFiltersOpen(false)}>{visibleFleet.length} · {t("filter.show")}</button>
    </div>
  );

  return (
    <section className="section fleet-section" id="voitures">
      <div className="shell">
        <div className="section-heading split-heading">
          <div><span className="eyebrow">{t("fleet.eyebrow")}</span><h2>{t("fleet.title")}</h2></div>
          <p><strong>{visibleFleet.length}</strong> {t("fleet.available")}<small>{t("fleet.demo")}</small></p>
        </div>

        <div className="fleet-toolbar">
          <button className="filter-trigger" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={18} /> {t("filter.title")}</button>
          <label>{t("filter.sort")}
            <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)}>
              <option value="recommended">{t("filter.recommended")}</option>
              <option value="low">{t("filter.low")}</option>
              <option value="high">{t("filter.high")}</option>
            </select>
          </label>
        </div>

        <div className="fleet-layout">
          <aside className="filters-desktop">{filters}</aside>
          <div className="vehicle-grid" aria-live="polite">
            <AnimatePresence mode="popLayout">
              {visibleFleet.map((vehicle, index) => (
                <motion.article className="vehicle-card" key={vehicle.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .28, delay: index * .035 }}>
                  <button className="vehicle-image-button" onClick={() => setActiveVehicle(vehicle)} aria-label={`${t("fleet.details")} — ${vehicle.name}`}>
                    <Image src={vehicle.images[0]} alt={`${vehicle.name} — véhicule de démonstration`} width={1200} height={720} />
                    <span className={`availability ${vehicle.availability}`}><i />{vehicle.availability === "limited" ? t("fleet.limited") : t("fleet.availableStatus")}</span>
                  </button>
                  <div className="vehicle-card-body">
                    <div className="vehicle-title-row"><div><span>{categoryLabel(vehicle.category)}</span><h3>{vehicle.name}</h3></div><div className="vehicle-price"><small>{t("fleet.from")}</small><strong>{vehicle.dailyRate} DT</strong><span>/ {t("fleet.day")}</span></div></div>
                    <div className="vehicle-specs">
                      <span><Users />{vehicle.seats} {t("fleet.seats")}</span>
                      <span><Briefcase />{vehicle.bags} {t("fleet.bags")}</span>
                      <span><span className="gear-letter">M</span>{transmissionLabel(vehicle.transmission)}</span>
                      <span><Fuel />{vehicle.fuel}</span>
                      <span><Snowflake />{t("fleet.ac")}</span>
                    </div>
                    <div className="vehicle-actions">
                      <button className="button button-ghost" onClick={() => setActiveVehicle(vehicle)}>{t("fleet.details")}</button>
                      <button className="button button-dark" onClick={() => onReserve(vehicle)}>{t("fleet.book")} <ChevronRight size={17} /></button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
            {!visibleFleet.length && <div className="empty-fleet"><Info /><h3>Aucun véhicule dans cette sélection</h3><p>Augmentez votre budget ou modifiez les filtres.</p><button className="button button-dark" onClick={() => { setCategory("Toutes"); setTransmission("Toutes"); setSeats(4); setBudget(200); }}>Réinitialiser</button></div>}
          </div>
        </div>
      </div>

      <AnimatePresence>{filtersOpen && <motion.div className="filters-sheet-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="sheet-backdrop" aria-label="Fermer" onClick={() => setFiltersOpen(false)} /><motion.div className="filters-sheet" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 320 }}>{filters}</motion.div></motion.div>}</AnimatePresence>
      <AnimatePresence>{activeVehicle && <VehicleModal vehicle={activeVehicle} locale={locale} t={t} onClose={() => setActiveVehicle(null)} onReserve={() => { onReserve(activeVehicle); setActiveVehicle(null); }} />}</AnimatePresence>
    </section>
  );
}

function VehicleModal({ vehicle, locale, t, onClose, onReserve }: { vehicle: Vehicle; locale: Locale; t: (key: string) => string; onClose: () => void; onReserve: () => void }) {
  const { booking } = useBooking();
  const closeRef = useRef<HTMLButtonElement>(null);
  const quote = calculateQuote(booking.pickupDate, booking.returnDate, vehicle, booking.selectedOptions, demoRentalOptions);
  const date = (value: string) => new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <motion.div className="modal-wrap" role="dialog" aria-modal="true" aria-labelledby="vehicle-modal-title" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="modal-backdrop" onClick={onClose} aria-label="Fermer" />
      <motion.div className="vehicle-modal" initial={{ opacity: 0, y: 32, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: .25 }}>
        <button className="modal-close" ref={closeRef} onClick={onClose} aria-label="Fermer la fenêtre"><X /></button>
        <div className="modal-media"><Image src={vehicle.images[0]} alt={`${vehicle.name} — vue extérieure`} width={1200} height={720} /><span className="demo-badge">Photo illustrative</span></div>
        <div className="modal-content">
          <div className="modal-details">
            <span className="eyebrow">{locale === "fr" ? vehicle.category : categoryEn[vehicle.category]}</span>
            <h2 id="vehicle-modal-title">{vehicle.name}</h2>
            <p>{vehicle.description}</p>
            <div className="modal-spec-grid">
              <span><Users /><small>{t("fleet.seats")}</small><strong>{vehicle.seats}</strong></span>
              <span><Briefcase /><small>{t("fleet.bags")}</small><strong>{vehicle.bags}</strong></span>
              <span><span className="gear-letter">M</span><small>{t("filter.transmission")}</small><strong>{locale === "fr" ? vehicle.transmission : transmissionEn[vehicle.transmission]}</strong></span>
              <span><Fuel /><small>Carburant</small><strong>{vehicle.fuel}</strong></span>
              <span><Snowflake /><small>Confort</small><strong>{t("fleet.ac")}</strong></span>
            </div>
            <p className="demo-inline"><Info size={15} /> Véhicule présenté à titre de démonstration.</p>
          </div>
          <aside className="modal-quote">
            <h3>{t("quote.title")}</h3>
            <div className="modal-date-row"><span><small>{t("booking.pickup")}</small><strong>{date(booking.pickupDate)}</strong><em>{booking.pickupTime}</em></span><span><small>{t("booking.return")}</small><strong>{date(booking.returnDate)}</strong><em>{booking.returnTime}</em></span></div>
            <div className="modal-duration"><span>{t("booking.duration")}</span><strong>{quote.rentalDays} {t("quote.days")}</strong></div>
            <div className="modal-rate"><span>{quote.rentalDays} {t("quote.days")} × {vehicle.dailyRate} DT</span><strong>{quote.rentalSubtotal} DT</strong></div>
            <div className="modal-total"><span>{t("quote.estimate")}</span><strong>{quote.total} DT</strong></div>
            <p>{t("quote.note")}</p>
            <button className="button button-accent button-block" onClick={onReserve}>{t("details.continue")} <ChevronRight size={18} /></button>
          </aside>
        </div>
      </motion.div>
    </motion.div>
  );
}
