import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-midnight text-ivory/80 mt-24">
      <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="text-gold text-[11px] tracking-[0.4em] uppercase mb-6">NexMansion</p>
          <h2 className="text-ivory font-serif text-3xl max-w-md leading-tight mb-4">
            Exceptional homes.<br />Curated stays.
          </h2>
          <p className="text-sm leading-relaxed max-w-sm text-ivory/60">
            A private collection of extraordinary homes, selected for remarkable stays. Currently curating Bali, with Dubai, the French Riviera, Mykonos, Maldives and Saint-Barth to follow.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/concierge" className="btn-gold text-[11px]">Speak with concierge</Link>
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/collections/bali" className="hover:text-gold">Bali Collection</Link></li>
            <li><Link href="/villas" className="hover:text-gold">All villas</Link></li>
            <li><Link href="/concierge" className="hover:text-gold">Concierge</Link></li>
            <li><Link href="/about" className="hover:text-gold">About</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Support</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/help" className="hover:text-gold">Help &amp; FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-gold">Contact</Link></li>
            <li><Link href="/account" className="hover:text-gold">My account</Link></li>
            <li><Link href="/host" className="hover:text-gold">Host with us</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-5">Legal</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/terms" className="hover:text-gold">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-gold">Privacy</Link></li>
            <li><Link href="/cookies" className="hover:text-gold">Cookies</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ivory/10">
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-ivory/50 tracking-widest uppercase">
          <p>© {new Date().getFullYear()} NexMansion. Curated luxury stays.</p>
          <p>Concierge · concierge@nexmansion.com</p>
        </div>
      </div>
    </footer>
  );
}
