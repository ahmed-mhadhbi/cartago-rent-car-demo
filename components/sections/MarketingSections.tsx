"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Building2, Car, CheckCircle2, Clock3, Compass, Hotel, MapPin, MessageCircle, Navigation, Phone, Plane, ShieldCheck, Star, Users } from "lucide-react";
import { contact } from "../../data/contact";
import { demoTestimonials } from "../../data/testimonials";
import type { Locale } from "../../i18n/translations";
import { BookingSearch } from "../booking/BookingSearch";

export function Hero({ locale, t, onSearch }: { locale: Locale; t: (key: string) => string; onSearch: () => void }) {
  return (
    <section className="hero" id="accueil">
      <div className="hero-image" aria-hidden="true" />
      <div className="hero-shade" />
      <div className="shell hero-inner">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <span className="hero-eyebrow"><MapPin size={15} /> {t("hero.eyebrow")}</span>
          <h1>{t("hero.title")}</h1>
          <p>{t("hero.subtitle")}</p>
          <div className="hero-proof"><span><ShieldCheck /> Estimation transparente</span><span><Clock3 /> {t("hero.trust")}</span><span><MessageCircle /> Confirmation WhatsApp</span></div>
        </motion.div>
        <motion.div className="hero-search-wrap" initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .12 }}>
          <div className="search-topline"><span>{locale === "fr" ? "Trouvez votre voiture" : "Find your car"}</span><em><i /> {locale === "fr" ? "Réponse rapide" : "Quick response"}</em></div>
          <BookingSearch t={t} onSearch={onSearch} />
        </motion.div>
      </div>
      <div className="hero-caption"><span>{"Photo d'ambiance générée pour le prototype"}</span><strong>Mahdia · 35.5047° N</strong></div>
    </section>
  );
}

const recommendationData = [
  { id: "couple", icon: Users, title: { fr: "Solo / Couple", en: "Solo / Couple" }, copy: { fr: "Compacte, économique et facile à garer.", en: "Compact, economical and easy to park." }, cta: "recommend.viewCity", filter: "Citadine" },
  { id: "family", icon: Car, title: { fr: "Famille", en: "Family" }, copy: { fr: "Plus d'espace pour les passagers et les bagages.", en: "More room for passengers and luggage." }, cta: "recommend.viewFamily", filter: "Berline" },
  { id: "long", icon: Compass, title: { fr: "Long trajet", en: "Long journey" }, copy: { fr: "Confort et sérénité pour prendre la route.", en: "Comfort and confidence for the open road." }, cta: "recommend.viewComfort", filter: "SUV" },
  { id: "city", icon: Building2, title: { fr: "Ville", en: "City" }, copy: { fr: "Maniable, sobre et pensée pour le quotidien.", en: "Nimble, efficient and made for everyday use." }, cta: "recommend.viewCity", filter: "Citadine" },
];

export function Recommendations({ locale, t, onRecommend }: { locale: Locale; t: (key: string) => string; onRecommend: (category: string) => void }) {
  return (
    <section className="section recommendation-section">
      <div className="shell">
        <div className="section-heading centered"><span className="eyebrow">{t("recommend.eyebrow")}</span><h2>{t("recommend.title")}</h2><p>{t("recommend.subtitle")}</p></div>
        <div className="recommendation-grid">
          {recommendationData.map((item, index) => { const Icon = item.icon; return (
            <motion.button key={item.id} onClick={() => onRecommend(item.filter)} className="recommendation-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .06 }}>
              <span className="recommend-icon"><Icon /></span><span><strong>{item.title[locale]}</strong><small>{item.copy[locale]}</small></span><em>{t(item.cta)} <ArrowRight size={16} /></em>
            </motion.button>
          ); })}
        </div>
      </div>
    </section>
  );
}

const howSteps = [
  { icon: Clock3, title: { fr: "Choisissez vos dates", en: "Choose your dates" }, copy: { fr: "Indiquez votre période de location.", en: "Enter your rental period." } },
  { icon: Car, title: { fr: "Choisissez votre voiture", en: "Choose your car" }, copy: { fr: "Comparez les véhicules disponibles.", en: "Compare available vehicles." } },
  { icon: CheckCircle2, title: { fr: "Recevez votre estimation", en: "Get your estimate" }, copy: { fr: "Visualisez immédiatement un prix indicatif.", en: "See an indicative price instantly." } },
  { icon: MessageCircle, title: { fr: "Confirmez sur WhatsApp", en: "Confirm on WhatsApp" }, copy: { fr: "Envoyez toutes les informations en un clic.", en: "Send all the details in one tap." } },
];

export function HowItWorks({ locale, t }: { locale: Locale; t: (key: string) => string }) {
  return (
    <section className="section how-section" id="comment-ca-marche">
      <div className="shell">
        <div className="section-heading"><span className="eyebrow eyebrow-light">{t("how.eyebrow")}</span><h2>{t("how.title")}</h2></div>
        <div className="how-grid">
          {howSteps.map((item, index) => { const Icon = item.icon; return <div className="how-card" key={item.title.fr}><span className="how-number">0{index + 1}</span><Icon /><h3>{item.title[locale]}</h3><p>{item.copy[locale]}</p>{index < howSteps.length - 1 && <ArrowRight className="how-arrow" />}</div>; })}
        </div>
      </div>
    </section>
  );
}

const arrivalItems = [
  { icon: MapPin, label: { fr: "Mahdia", en: "Mahdia" }, text: { fr: "Agence et points de rencontre", en: "Agency and meeting points" } },
  { icon: Plane, label: { fr: "Aéroports", en: "Airports" }, text: { fr: "Demande de prise en charge", en: "Pickup request" } },
  { icon: Hotel, label: { fr: "Hôtels", en: "Hotels" }, text: { fr: "Adresse précisée en avance", en: "Address shared in advance" } },
  { icon: MessageCircle, label: { fr: "WhatsApp", en: "WhatsApp" }, text: { fr: "Confirmation avec l'équipe", en: "Confirmation with the team" } },
];

export function Tourism({ locale, t, onBook }: { locale: Locale; t: (key: string) => string; onBook: () => void }) {
  return (
    <section className="section tourism-section">
      <div className="shell tourism-card">
        <div className="tourism-visual"><Image src="/images/hero-mahdia.png" alt="Route côtière à Mahdia avec un véhicule de démonstration" width={1536} height={1024} /><span><Navigation /> Mahdia, Tunisie</span></div>
        <div className="tourism-content"><span className="eyebrow">Voyage & arrivée</span><h2>{t("tourism.title")}</h2><p>{t("tourism.copy")}</p><div className="arrival-grid">{arrivalItems.map((item) => { const Icon = item.icon; return <div key={item.label.fr}><Icon /><span><strong>{item.label[locale]}</strong><small>{item.text[locale]}</small></span></div>; })}</div><p className="tourism-note">{locale === "fr" ? "Demandez une prise en charge adaptée à votre arrivée. Disponibilité à confirmer." : "Ask for a pickup arrangement suited to your arrival. Availability to be confirmed."}</p><button className="button button-dark" onClick={onBook}>{t("tourism.cta")} <ArrowRight size={17} /></button></div>
      </div>
    </section>
  );
}

export function Reviews({ t }: { t: (key: string) => string }) {
  return (
    <section className="section reviews-section">
      <div className="shell"><div className="section-heading split-heading"><div><span className="eyebrow">{t("reviews.eyebrow")}</span><h2>{t("reviews.title")}</h2></div><p className="reviews-note">Avis fictifs pour la maquette — à remplacer par les avis Google réels.</p></div>
        <div className="reviews-grid">{demoTestimonials.map((review) => <article key={review.name}><div className="stars" aria-label="5 étoiles"><Star /><Star /><Star /><Star /><Star /></div><blockquote>“{review.quote}”</blockquote><footer><span>{review.name.slice(0, 1)}</span><div><strong>{review.name}</strong><small>{review.trip} · Témoignage démo</small></div></footer></article>)}</div>
      </div>
    </section>
  );
}

export function ContactSection({ t }: { t: (key: string) => string }) {
  return (
    <section className="section contact-section" id="contact">
      <div className="shell contact-card">
        <div className="map-wrap"><iframe title="Carte de Cartago Rent Car à Mahdia" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Cartago%20rent%20car%20Mahdia%20Tunisia&output=embed" /><div className="map-pin-card"><MapPin /><span><strong>Cartago Rent Car</strong><small>Mahdia 5100</small></span></div></div>
        <div className="contact-content"><span className="eyebrow">{t("contact.eyebrow")}</span><h2>{t("contact.title")}</h2><p>{contact.address}</p><a className="contact-phone" href={`tel:${contact.phoneLink}`}><Phone />{contact.phoneDisplay}</a><div className="contact-actions"><a className="button button-dark" href={`tel:${contact.phoneLink}`}><Phone size={17} /> {t("contact.call")}</a><a className="button button-whatsapp" href="https://wa.me/21699044766" target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a><a className="button button-ghost" href={contact.mapsUrl} target="_blank" rel="noreferrer">{t("contact.directions")} <ArrowUpRight size={17} /></a></div><div className="contact-assurance"><ShieldCheck /><span><strong>Contact direct</strong><small>{"Chaque demande est confirmée par l'équipe Cartago."}</small></span></div></div>
      </div>
    </section>
  );
}
