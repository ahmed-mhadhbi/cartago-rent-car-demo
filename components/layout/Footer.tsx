"use client";

import { CarFront, MessageCircle } from "lucide-react";

export function Footer({ t }: { t: (key: string) => string }) {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <a className="brand brand-light" href="#accueil">
            <span className="brand-mark"><CarFront size={22} /></span>
            <span>CARTAGO <b>RENT CAR</b></span>
          </a>
          <p>Mahdia, Tunisia</p>
        </div>
        <nav aria-label="Navigation de pied de page">
          <a href="#voitures">{t("nav.cars")}</a>
          <a href="#reservation">{t("nav.booking")}</a>
          <a href="#contact">{t("nav.contact")}</a>
          <a href="https://wa.me/21699044766" target="_blank" rel="noreferrer"><MessageCircle size={15} /> WhatsApp</a>
        </nav>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 Cartago Rent Car</span>
        <span>Prototype digital réalisé pour démonstration.</span>
      </div>
    </footer>
  );
}
