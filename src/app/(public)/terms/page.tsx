export const metadata = { title: "Terms of Service" };
export default function TermsPage() {
  return (
    <div id="main-content" className="pt-28 pb-20">
      <article className="mx-auto max-w-3xl px-5 md:px-10 editorial">
        <p className="label-gold mb-4">Legal</p>
        <h1 className="text-4xl md:text-5xl mb-6">Terms of Service</h1>
        <p className="text-sm text-stone">Last updated: {new Date().toLocaleDateString("en-GB")}</p>
        <h2>Booking</h2>
        <p>By confirming a booking you agree to the house rules of the property, the cancellation policy shown at checkout, and the conduct expectations of NexMansion.</p>
        <h2>Payments</h2>
        <p>Payments are processed securely via Stripe. In demo or concierge-assisted bookings, payment may also be coordinated manually by the NexMansion team.</p>
        <h2>Cancellations & refunds</h2>
        <p>Cancellation terms are displayed on each property listing. Refunds are processed to the original payment method within 5-10 business days where applicable.</p>
        <h2>Host verification</h2>
        <p>Property verification reflects NexMansion's internal review process and does not represent a legal or regulatory guarantee. Travellers should always exercise normal care and contact the concierge with any concerns.</p>
        <p className="text-stone text-xs mt-10 tracking-widest uppercase">These terms are placeholders pending legal review before commercial launch.</p>
      </article>
    </div>
  );
}
