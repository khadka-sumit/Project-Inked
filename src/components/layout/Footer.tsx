'use client';

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/projectinked' },
  { label: 'TikTok', href: 'https://tiktok.com/@projectinked' },
  { label: 'Email', href: 'mailto:hello@projectinked.com' },
];

const policyLinks = [
  { label: 'Shipping', href: '/policies/shipping' },
  { label: 'Returns', href: '/policies/returns' },
];

export function Footer() {
  return (
    <footer className="border-t border-grey-dark/50 bg-ink py-16 text-silver">
      <div className="container-custom grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-grey">PROJECT INKED</p>
          <p className="max-w-md text-base leading-relaxed text-bone/90">
            Ink form, garment logic, and limited drops designed for the ones who move quietly but leave a mark.
          </p>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-grey">Links</p>
          <ul className="mt-6 space-y-4 text-base">
            <li>
              <a href="/shop" className="transition-colors duration-200 hover:text-bone">
                Shop
              </a>
            </li>
            <li>
              <a href="/lookbook" className="transition-colors duration-200 hover:text-bone">
                Lookbook
              </a>
            </li>
            <li>
              <a href="/about" className="transition-colors duration-200 hover:text-bone">
                About
              </a>
            </li>
            <li>
              <a href="/contact" className="transition-colors duration-200 hover:text-bone">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-grey">Connect</p>
          <ul className="mt-6 space-y-4 text-base">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-colors duration-200 hover:text-bone"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-4 text-sm text-grey">
            {policyLinks.map((link) => (
              <div key={link.href}>
                <a href={link.href} className="transition-colors duration-200 hover:text-bone">
                  {link.label}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
