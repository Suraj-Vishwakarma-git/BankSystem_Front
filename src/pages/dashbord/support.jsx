import React, { useState } from "react";
import "./support.css";
import Header from "../../components/common/Header.jsx";
const faqs = [
  {
    icon: "🔐",
    question: "How do I reset my password?",
    answer: 'Click "Forgot Password" on the login page and follow the OTP verification steps sent to your registered email.',
  },
  {
    icon: "💳",
    question: "Why did my payment fail?",
    answer: "Verify your card balance and billing details. Payments may also fail due to bank restrictions — try again after a few minutes.",
  },
  {
    icon: "📧",
    question: "Not receiving OTP?",
    answer: "Check your spam or junk folder. If the issue persists, wait 30 seconds before requesting a new code.",
  },
  {
    icon: "🛠",
    question: "How do I fix account issues?",
    answer: "Try logging out and back in. If the problem continues, raise a ticket and our team will resolve it within 24 hours.",
  },
];

const contacts = [
  { icon: "✉️", label: "Email Us", value: "support@apextrust.com", sub: "Response within 2 hours" },
  { icon: "📞", label: "Call Us", value: "+91 98765 43210", sub: "Mon–Sat, 9 AM–9 PM" },
  { icon: "💬", label: "Live Chat", value: "Start a conversation", sub: "Available 24/7" },
];

const Support = () => {
  const [form, setForm] = useState({ name: "", email: "", issue: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: "", email: "", issue: "", message: "" });
    }, 3000);
  };

  return (
    <div className="sp-root">
        <Header/>

      {/* HERO */}
      <header className="sp-hero">
        <div className="sp-hero-badge">Support Center</div>
        <h1 className="sp-hero-title">
          How can we <span className="sp-accent">help you?</span>
        </h1>
        <p className="sp-hero-sub">Real help from real people — around the clock, around the world.</p>
      </header>

      {/* MAIN GRID */}
      <main className="sp-grid">

        {/* FORM CARD */}
        <section className="sp-card sp-form-card">
          <div className="sp-card-tag">Raise a Ticket</div>
          <h2 className="sp-card-title">Tell us what's wrong</h2>
          <p className="sp-card-desc">Fill in the details below and we'll get back to you shortly.</p>

          {submitted ? (
            <div className="sp-success">
              <div className="sp-success-icon">✓</div>
              <p className="sp-success-text">Request submitted! We'll reach out soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sp-form">
              <div className="sp-field-row">
                <div className="sp-field">
                  <label className="sp-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={handleChange}
                    className="sp-input"
                    required
                  />
                </div>
                <div className="sp-field">
                  <label className="sp-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jane@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="sp-input"
                    required
                  />
                </div>
              </div>

              <div className="sp-field">
                <label className="sp-label">Issue Category</label>
                <select
                  name="issue"
                  value={form.issue}
                  onChange={handleChange}
                  className="sp-input sp-select"
                  required
                >
                  <option value="">Select a category…</option>
                  <option value="login">Login Issue</option>
                  <option value="payment">Payment Problem</option>
                  <option value="account">Account Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="sp-field">
                <label className="sp-label">Message</label>
                <textarea
                  name="message"
                  placeholder="Describe your issue in detail…"
                  value={form.message}
                  onChange={handleChange}
                  className="sp-input sp-textarea"
                  rows="5"
                  required
                />
              </div>

              <button type="submit" className="sp-btn">
                <span>Submit Request</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          )}
        </section>

        {/* FAQ CARD */}
        <section className="sp-card sp-faq-card">
          <div className="sp-card-tag">FAQ</div>
          <h2 className="sp-card-title">Common questions</h2>
          <p className="sp-card-desc">Quick answers to things we hear most often.</p>

          <div className="sp-faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`sp-faq-item ${openFaq === i ? "sp-faq-open" : ""}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="sp-faq-header">
                  <span className="sp-faq-icon">{faq.icon}</span>
                  <span className="sp-faq-question">{faq.question}</span>
                  <span className="sp-faq-chevron">{openFaq === i ? "−" : "+"}</span>
                </div>
                {openFaq === i && (
                  <div className="sp-faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* CONTACT STRIP */}
      <section className="sp-contact">
        <p className="sp-contact-label">Other ways to reach us</p>
        <div className="sp-contact-grid">
          {contacts.map((c, i) => (
            <div key={i} className="sp-contact-card">
              <span className="sp-contact-icon">{c.icon}</span>
              <div>
                <p className="sp-contact-name">{c.label}</p>
                <p className="sp-contact-value">{c.value}</p>
                <p className="sp-contact-sub">{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Support;