"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ArrowLeft, Baby, Check, CheckCircle2, ChevronRight, CircleUserRound, Clock3, MapPin, MessageCircle, PackageCheck, Route, Truck, UserPlus } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useBooking } from "../../context/BookingContext";
import { contact } from "../../data/contact";
import { demoRentalOptions, pickupLocations } from "../../data/options";
import type { Locale } from "../../i18n/translations";
import { calculateQuote } from "../../lib/pricing";
import { buildBookingMessage, buildWhatsAppUrl } from "../../lib/whatsapp";
import { BookingSearch } from "./BookingSearch";
import { QuoteCard } from "./QuoteCard";

const optionIcons = { baby: Baby, driver: UserPlus, delivery: Truck, route: Route };

export function BookingFlow({ locale, t, step, setStep, onChooseCar }: { locale: Locale; t: (key: string) => string; step: number; setStep: (step: number) => void; onChooseCar: () => void }) {
  const { booking, updateBooking } = useBooking();
  const [customerError, setCustomerError] = useState("");
  const quote = useMemo(() => calculateQuote(booking.pickupDate, booking.returnDate, booking.selectedVehicle, booking.selectedOptions, demoRentalOptions), [booking]);
  const message = useMemo(() => buildBookingMessage(booking, quote, demoRentalOptions, pickupLocations), [booking, quote]);
  const whatsappUrl = buildWhatsAppUrl(contact.whatsapp, message);
  const steps = ["booking.step1", "booking.step2", "booking.step3", "booking.step4", "booking.step5"];

  const toggleOption = (id: string) => {
    const selected = booking.selectedOptions.includes(id);
    updateBooking({ selectedOptions: selected ? booking.selectedOptions.filter((item) => item !== id) : [...booking.selectedOptions, id] });
  };

  const submitCustomer = (event: FormEvent) => {
    event.preventDefault();
    if (!booking.customer.firstName.trim() || !booking.customer.lastName.trim() || !booking.customer.phone.trim()) {
      setCustomerError(t("booking.required"));
      return;
    }
    setCustomerError("");
    setStep(5);
  };

  const formatDate = (value: string) => new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB").format(new Date(`${value}T12:00:00`));
  const selectedLocation = pickupLocations.find((item) => item.id === booking.pickupLocation)?.label[locale] ?? "Mahdia";

  return (
    <section className="section booking-section" id="reservation">
      <div className="shell">
        <div className="section-heading booking-heading"><span className="eyebrow">Réservation guidée</span><h2>{t("booking.title")}</h2><p>{t("booking.subtitle")}</p></div>
        <ol className="booking-stepper" aria-label="Étapes de réservation">
          {steps.map((key, index) => {
            const number = index + 1;
            const completed = number < step;
            return <li key={key} className={number === step ? "active" : completed ? "completed" : ""}>
              <button disabled={number > step} onClick={() => setStep(number)} aria-current={number === step ? "step" : undefined}>
                <span>{completed ? <Check size={16} /> : number}</span><em>{t(key)}</em>
              </button>
            </li>;
          })}
        </ol>

        <div className="booking-app">
          <AnimatePresence mode="wait">
            <motion.div className="booking-main" key={step} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: .22 }}>
              {step === 1 && (
                <div className="booking-panel">
                  <div className="panel-icon"><Clock3 /></div>
                  <h3>{locale === "fr" ? "Quand souhaitez-vous partir ?" : "When would you like to go?"}</h3>
                  <p>{locale === "fr" ? "Choisissez vos horaires pour voir une estimation adaptée." : "Choose your times to see a tailored estimate."}</p>
                  <BookingSearch t={t} compact onSearch={() => setStep(2)} />
                </div>
              )}

              {step === 2 && (
                <div className="booking-panel choose-car-panel">
                  <div className="panel-icon"><PackageCheck /></div>
                  <h3>{booking.selectedVehicle ? booking.selectedVehicle.name : locale === "fr" ? "Choisissez votre voiture" : "Choose your car"}</h3>
                  {booking.selectedVehicle ? (
                    <div className="selected-car-card">
                      <Image src={booking.selectedVehicle.images[0]} alt={booking.selectedVehicle.name} width={460} height={300} />
                      <div><span>{booking.selectedVehicle.category}</span><strong>{booking.selectedVehicle.name}</strong><p>{booking.selectedVehicle.seats} {t("fleet.seats")} · {booking.selectedVehicle.transmission} · {booking.selectedVehicle.dailyRate} DT / {t("fleet.day")}</p></div>
                    </div>
                  ) : <p>{locale === "fr" ? "Comparez les véhicules disponibles et sélectionnez celui qui vous convient." : "Compare the available vehicles and choose the right one."}</p>}
                  <div className="booking-nav-actions">
                    <button className="button button-ghost" onClick={() => setStep(1)}><ArrowLeft size={17} /> {t("booking.back")}</button>
                    <button className="button button-dark" onClick={onChooseCar}>{t("booking.changeCar")} <ChevronRight size={17} /></button>
                    {booking.selectedVehicle && <button className="button button-accent" onClick={() => setStep(3)}>{t("booking.continue")} <ChevronRight size={17} /></button>}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="booking-panel options-panel">
                  <div className="panel-title-row"><div><span className="step-kicker">03</span><h3>{t("booking.where")}</h3></div><MapPin /></div>
                  <div className="location-grid">
                    {pickupLocations.map((location) => (
                      <label key={location.id} className={booking.pickupLocation === location.id ? "selected" : ""}>
                        <input type="radio" name="pickup-location" value={location.id} checked={booking.pickupLocation === location.id} onChange={() => updateBooking({ pickupLocation: location.id })} />
                        <span className="radio-dot" /><span>{location.label[locale]}</span>
                      </label>
                    ))}
                  </div>
                  {booking.pickupLocation === "custom" && <label className="custom-address"><span>{t("booking.address")}</span><input value={booking.customAddress} onChange={(e) => updateBooking({ customAddress: e.target.value })} placeholder="Rue, hôtel ou point de repère" /></label>}
                  <p className="info-line"><MapPin size={15} />{t("booking.whereNote")}</p>
                  <hr />
                  <h3>{t("booking.extras")}</h3>
                  <p>{t("booking.extrasNote")}</p>
                  <div className="extras-grid">
                    {demoRentalOptions.map((option) => {
                      const Icon = optionIcons[option.icon];
                      const checked = booking.selectedOptions.includes(option.id);
                      return <label key={option.id} className={`extra-card ${checked ? "selected" : ""}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleOption(option.id)} />
                        <span className="extra-icon"><Icon /></span>
                        <span><strong>{option.label[locale]}</strong><small>{option.description[locale]}</small></span>
                        <em>{option.price === null ? t("quote.onRequest") : `+${option.price} DT`}</em>
                        <i>{checked && <Check size={14} />}</i>
                      </label>;
                    })}
                  </div>
                  <div className="booking-nav-actions"><button className="button button-ghost" onClick={() => setStep(2)}><ArrowLeft size={17} /> {t("booking.back")}</button><button className="button button-accent" onClick={() => setStep(4)}>{t("booking.continue")} <ChevronRight size={17} /></button></div>
                </div>
              )}

              {step === 4 && (
                <form className="booking-panel customer-panel" onSubmit={submitCustomer}>
                  <div className="panel-title-row"><div><span className="step-kicker">04</span><h3>{t("booking.customerTitle")}</h3></div><CircleUserRound /></div>
                  <div className="customer-grid">
                    <label><span>{t("booking.firstName")} *</span><input autoComplete="given-name" value={booking.customer.firstName} onChange={(e) => updateBooking({ customer: { ...booking.customer, firstName: e.target.value } })} required /></label>
                    <label><span>{t("booking.lastName")} *</span><input autoComplete="family-name" value={booking.customer.lastName} onChange={(e) => updateBooking({ customer: { ...booking.customer, lastName: e.target.value } })} required /></label>
                    <label><span>{t("booking.phone")} *</span><input type="tel" autoComplete="tel" placeholder="+216 XX XXX XXX" value={booking.customer.phone} onChange={(e) => updateBooking({ customer: { ...booking.customer, phone: e.target.value } })} required /></label>
                    <label><span>{t("booking.email")}</span><input type="email" autoComplete="email" placeholder="vous@email.com" value={booking.customer.email} onChange={(e) => updateBooking({ customer: { ...booking.customer, email: e.target.value } })} /></label>
                    <label className="full"><span>{t("booking.message")}</span><textarea rows={4} placeholder={locale === "fr" ? "Une précision sur votre arrivée ?" : "Anything we should know about your arrival?"} value={booking.customer.message} onChange={(e) => updateBooking({ customer: { ...booking.customer, message: e.target.value } })} /></label>
                  </div>
                  {customerError && <p className="form-error" role="alert">{customerError}</p>}
                  <div className="booking-nav-actions"><button type="button" className="button button-ghost" onClick={() => setStep(3)}><ArrowLeft size={17} /> {t("booking.back")}</button><button className="button button-accent" type="submit">{t("booking.continue")} <ChevronRight size={17} /></button></div>
                </form>
              )}

              {step === 5 && (
                <div className="booking-panel confirmation-panel">
                  <div className="confirmation-heading"><span><CheckCircle2 /></span><div><small>05 · {t("booking.step5")}</small><h3>{t("booking.summary")}</h3><p>{locale === "fr" ? "Vérifiez vos informations avant d'envoyer la demande." : "Check your details before sending your request."}</p></div></div>
                  <div className="summary-list">
                    <div><span>{t("booking.vehicle")}</span><strong>{booking.selectedVehicle?.name}</strong></div>
                    <div><span>{t("booking.pickup")}</span><strong>{formatDate(booking.pickupDate)} · {booking.pickupTime}</strong></div>
                    <div><span>{t("booking.return")}</span><strong>{formatDate(booking.returnDate)} · {booking.returnTime}</strong></div>
                    <div><span>{t("booking.duration")}</span><strong>{quote.rentalDays} {t("quote.days")}</strong></div>
                    <div><span>{t("booking.location")}</span><strong>{selectedLocation}{booking.customAddress ? ` — ${booking.customAddress}` : ""}</strong></div>
                    <div><span>{t("booking.options")}</span><strong>{booking.selectedOptions.length ? demoRentalOptions.filter((o) => booking.selectedOptions.includes(o.id)).map((o) => o.label[locale]).join(", ") : t("booking.none")}</strong></div>
                    <div><span>{t("booking.customer")}</span><strong>{booking.customer.firstName} {booking.customer.lastName}<small>{booking.customer.phone}</small></strong></div>
                  </div>
                  <div className="confirmation-estimate"><span>{t("quote.estimate")}</span><strong>{quote.total} DT</strong></div>
                  <p className="info-line">{t("quote.note")}</p>
                  <a className="button button-whatsapp button-block" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={20} /> {t("booking.confirm")}</a>
                  <button className="text-button" onClick={() => setStep(4)}>{t("booking.modify")}</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          {step >= 3 && booking.selectedVehicle && <QuoteCard locale={locale} t={t} />}
        </div>
      </div>
    </section>
  );
}
