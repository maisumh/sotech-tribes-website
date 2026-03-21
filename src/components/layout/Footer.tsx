import Image from "next/image";
import { BRAND, FOOTER } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-firefly text-white py-16">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Image
              src={BRAND.logos.primaryWhite}
              alt="Tribes"
              width={120}
              height={40}
              className="h-10 w-auto mb-4"
            />
            <p className="text-white/70 text-sm leading-relaxed">
              Share resources, build community, strengthen neighborhoods.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-semibold text-casablanca mb-4">
              Explore
            </h4>
            <ul className="space-y-2">
              {FOOTER.links.explore.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-casablanca mb-4">
              Questions?
            </h4>
            <a
              href={`mailto:${FOOTER.email}`}
              className="text-white/70 hover:text-white transition-colors text-sm"
            >
              {FOOTER.email}
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center">
          <p className="text-white/50 text-sm">{FOOTER.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
