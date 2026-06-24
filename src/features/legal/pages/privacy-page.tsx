export function PrivacyPage() {
  return (
    <div className="container section-padding max-w-3xl mx-auto">
      <h1 className="text-4xl font-display font-normal mb-2">Privacy Policy</h1>
      <p className="text-fg-2 text-sm mb-8">Last updated: June 2026</p>

      <section className="space-y-6 text-fg-2 leading-relaxed">
        <div>
          <h2 className="text-xl font-normal text-ink mb-2">
            Information We Collect
          </h2>
          <p>
            We collect information you provide directly: name, email address,
            phone number, and payment details when you book a space, sign up for
            membership, or subscribe to our newsletter. We also collect usage
            data such as pages visited and time spent on the site.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-normal text-ink mb-2">
            How We Use Your Information
          </h2>
          <p>
            Your information is used to process bookings, manage memberships,
            send transactional emails (confirmations, reminders), and improve
            our services. With your consent, we may send occasional updates
            about events, openings, and offers.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-normal text-ink mb-2">
            Payment Processing
          </h2>
          <p>
            We use third-party payment gateways (Stripe, eSewa, Khalti) to
            process transactions. We do not store full card numbers or bank
            details on our servers. Payment data is handled directly by the
            respective gateway under their privacy policies.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-normal text-ink mb-2">Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share information with
            trusted third-party service providers who assist in operating our
            platform (hosting, email delivery, analytics), provided they agree
            to keep your data confidential.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-normal text-ink mb-2">Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active
            or as needed to provide services. You may request deletion of your
            data at any time by contacting us.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-normal text-ink mb-2">Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data.
            You may also opt out of marketing communications at any time. To
            exercise these rights, contact us at the details below.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-normal text-ink mb-2">Contact</h2>
          <p>
            If you have questions about this policy, reach out to us at
            privacy@creatrixspace.com or through our contact page.
          </p>
        </div>
      </section>
    </div>
  )
}
