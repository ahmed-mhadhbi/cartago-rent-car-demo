"use client";

import { CarFront } from "lucide-react";
import { useEffect, useState } from "react";
import { BookingFlow } from "./booking/BookingFlow";
import { useBooking } from "../context/BookingContext";
import { FleetSection } from "./fleet/FleetSection";
import { Footer } from "./layout/Footer";
import { Header } from "./layout/Header";
import { ContactSection, Hero, HowItWorks, Recommendations, Reviews, Tourism } from "./sections/MarketingSections";
import { translations, type Locale } from "../i18n/translations";
import type { Vehicle } from "../types/vehicle";

const scrollTo = (id: string) => window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);

export function CartagoSite() {
  const [locale, setLocale] = useState<Locale>("fr");
  const [step, setStep] = useState(1);
  const [recommendation, setRecommendation] = useState<{ category: string; nonce: number } | null>(null);
  const [showMobileCta, setShowMobileCta] = useState(false);
  const { updateBooking } = useBooking();
  const t = (key: string) => translations[locale][key] ?? translations.fr[key] ?? key;

  useEffect(() => {
    const onScroll = () => setShowMobileCta(window.scrollY > 620);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const search = () => {
    setStep(2);
    scrollTo("voitures");
  };

  const reserve = (vehicle: Vehicle) => {
    updateBooking({ selectedVehicle: vehicle });
    setStep(3);
    scrollTo("reservation");
  };

  const recommend = (category: string) => {
    setRecommendation({ category, nonce: Date.now() });
    scrollTo("voitures");
  };

  const openBooking = () => {
    setStep(1);
    scrollTo("reservation");
  };

  return (
    <div className="site-root">
      <Header locale={locale} setLocale={setLocale} t={t} onBook={openBooking} />
      <main>
        <Hero locale={locale} t={t} onSearch={search} />
        <Recommendations locale={locale} t={t} onRecommend={recommend} />
        <FleetSection key={recommendation?.nonce ?? "fleet"} locale={locale} t={t} onReserve={reserve} recommendation={recommendation} />
        <BookingFlow locale={locale} t={t} step={step} setStep={setStep} onChooseCar={() => scrollTo("voitures")} />
        <HowItWorks locale={locale} t={t} />
        <Tourism locale={locale} t={t} onBook={openBooking} />
        <Reviews t={t} />
        <ContactSection t={t} />
      </main>
      <Footer t={t} />
      <button className={`mobile-book-cta ${showMobileCta && step === 1 ? "is-visible" : ""}`} onClick={openBooking}><CarFront size={19} /> {t("mobile.cta")}</button>
    </div>
  );
}
