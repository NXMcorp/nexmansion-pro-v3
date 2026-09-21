import Link from "next/link";

export default function NotFound() {
  return (
    <div id="main-content" className="pt-36 pb-32 text-center px-5">
      <p className="label-gold mb-4">404</p>
      <h1 className="font-serif text-5xl text-midnight mb-6">We couldn't find that page.</h1>
      <p className="text-charcoal/70 mb-8 max-w-md mx-auto">The page you're looking for may have moved, or it may not exist. Your reservation hasn't been charged.</p>
      <Link href="/" className="btn-gold text-[11px]">Return home</Link>
    </div>
  );
}
