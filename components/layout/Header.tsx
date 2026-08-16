"use client";

import { useEffect, useState } from "react";
import { CarFront, Menu, MessageCircle, X } from "lucide-react";
import type { Locale } from "../../i18n/translations";

interface HeaderProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  onBook: () => void;
}

export function Header({ locale, setLocale, t, onBook }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["#accueil", "nav.home"],
    ["#voitures", "nav.cars"],
    ["#reservation", "nav.booking"],
    ["#comment-ca-marche", "nav.how"],
    ["#contact", "nav.contact"],
  ];

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-inner shell">
        <a className="brand" href="#accueil" aria-label="Cartago Rent Car — Accueil">
          <span className="brand-mark"><CarFront size={22} strokeWidth={1.8} /></span>
          <span>CARTAGO <b>RENT CAR</b></span>
        </a>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {links.map(([href, key]) => <a key={href} href={href}>{t(key)}</a>)}
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label="Language">
            <button className={locale === "fr" ? "active" : ""} onClick={() => setLocale("fr")} aria-pressed={locale === "fr"}>FR</button>
            <span>/</span>
            <button className={locale === "en" ? "active" : ""} onClick={() => setLocale("en")} aria-pressed={locale === "en"}>EN</button>
          </div>
          <a className="button button-dark button-small header-whatsapp" href="https://wa.me/21699044766" target="_blank" rel="noreferrer">
            <MessageCircle size={17} /> {t("nav.whatsapp")}
          </a>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label="Ouvrir le menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <nav aria-label="Navigation mobile">
            {links.map(([href, key]) => <a key={href} href={href} onClick={() => setOpen(false)}>{t(key)}</a>)}
          </nav>
          <button className="button button-accent" onClick={() => { onBook(); setOpen(false); }}>{t("mobile.cta")}</button>
        </div>
      )}
    </header>
  );
}
