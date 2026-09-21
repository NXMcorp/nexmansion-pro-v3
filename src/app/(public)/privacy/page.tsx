export const metadata = { title: "Privacy Policy" };
export default function PrivacyPage() {
  return (
    <div id="main-content" className="pt-28 pb-20">
      <article className="mx-auto max-w-3xl px-5 md:px-10 editorial">
        <p className="label-gold mb-4">Legal</p>
        <h1 className="text-4xl md:text-5xl mb-6">Privacy Policy</h1>
        <p className="text-sm text-stone">Last updated: {new Date().toLocaleDateString("en-GB")}</p>
        <h2>Summary</h2>
        <p>NexMansion collects the minimum information required to provide luxury travel booking services: contact details, booking information, payment data processed by our payment provider (Stripe), and communications with our concierge team.</p>
        <h2>Data we collect</h2>
        <ul>
          <li>Account details: name, email, phone, country, preferences.</li>
          <li>Booking details: dates, guests, services selected, special requests.</li>
          <li>Payment information is processed by Stripe; we do not store card numbers.</li>
          <li>Host verification documents are stored privately and never exposed publicly.</li>
        </ul>
        <h2>Your rights</h2>
        <p>You may request access, export, correction or deletion of your personal data at any time from your account settings or by emailing privacy@nexmansion.com.</p>
        <p className="text-stone text-xs mt-10 tracking-widest uppercase">This policy will be reviewed before commercial launch.</p>
      </article>
    </div>
  );
}
