"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { BRAND, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-firefly ${
        scrolled ? "shadow-md" : ""
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between h-[70px]">
        <a href="#" className="relative z-[1001] flex items-center">
          <Image
            src={BRAND.logos.primaryWhite}
            alt="Tribes"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white font-medium px-4 py-2 rounded transition-colors hover:bg-white/10"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            className="bg-casablanca text-firefly font-semibold px-6 py-2 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-casablanca/30"
          >
            Join Waitlist
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative z-[1001] w-12 h-12 flex flex-col items-center justify-center gap-[5px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white rounded transition-all duration-300 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed top-[70px] left-0 right-0 bottom-0 bg-firefly flex flex-col pt-8 px-4 transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white text-lg font-medium py-4 border-b border-white/10"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#waitlist"
            className="mt-6 bg-casablanca text-firefly font-semibold py-4 rounded-lg text-center text-lg"
            onClick={() => setMenuOpen(false)}
          >
            Join Waitlist
          </a>
        </div>
      </div>
    </nav>
  );
}
