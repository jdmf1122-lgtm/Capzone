import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

export const ContactUsPage: React.FC = () => {
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Product / Sizing Inquiry');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  // FAQ Accordion active indices
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    showToast('Your message has been sent to our customer concierge team.', 'success');
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSent(false);
    }, 4000);
  };

  const faqs = [
    {
      q: 'Do you deliver exclusively around Roxas, Oriental Mindoro?',
      a: 'Yes! CapZone operates and delivers exclusively around the Municipality of Roxas, Oriental Mindoro (Postal Code 5212). Our local dispatch riders cater to all 20 Roxas barangays: Bagumbayan, Cantil, Dangay, Happy Valley, Libertad, Libtong, Little Tanauan, Mabuhay, Maraska, Odiong, Paclasan, San Aquilino, San Isidro, San Jose, San Mariano, San Miguel, San Rafael, San Vicente, Uyao, and Victoria—with same-day or next-day delivery.'
    },
    {
      q: 'Can I pick up my order in person at your Roxas studio?',
      a: 'Absolutely. Choose "Pick-Up at Paclasan Studio" during checkout to pick up your ordered caps free of charge at our studio along Rizal Street, Barangay Paclasan, Roxas, Oriental Mindoro.'
    },
    {
      q: 'Do you offer Cash on Delivery (COD) around Roxas?',
      a: 'Yes! We support 100% Cash on Delivery across all barangays of Roxas, Oriental Mindoro. You can inspect your CapZone cap box and pay the rider directly in cash.'
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept Cash on Delivery (COD), GCash, and Visa/Mastercard credit/debit cards in Philippine Peso (₱ PHP). Digital payments are encrypted and validated in real time.'
    },
    {
      q: 'What is your return or exchange policy?',
      a: 'We provide a 7-day hassle-free exchange window. If a cap size does not fit your crown contour, visit our Paclasan studio or message us to arrange a quick swap.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
          Concierge & Support
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Syne'] text-white">
          Contact CapZone
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Have questions about headwear sizing, limited drops, or regional orders? Our Roxas, Oriental Mindoro concierge team is ready.
        </p>
      </div>

      {/* Main Grid: Form + Showroom Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Form (lg:col-span-7) */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-[#111827] border border-white/10 rounded-2xl shadow-xl space-y-6">
          <h2 className="text-base font-bold font-['Syne'] text-white">
            Send an Inquiry
          </h2>

          {sent ? (
            <div className="p-8 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-emerald-200">Message Received!</h3>
              <p className="text-xs text-emerald-300/80 max-w-sm mx-auto">
                Thank you for contacting CapZone. Our team responds within 2-4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marco Valenzuela"
                    className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-gray-400 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marco@example.com"
                    className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Topic / Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="Product / Sizing Inquiry">Product / Sizing Inquiry</option>
                  <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                  <option value="Returns & Exchanges">Returns & Exchanges</option>
                  <option value="Brand Collaborations">Brand Collaborations & Wholesale</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-gray-400 block mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help top off your style?"
                  className="w-full px-3 py-2.5 bg-[#182232] border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

        {/* Studio Info (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 bg-[#111827] border border-white/10 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-base font-bold font-['Syne'] text-white">
              CapZone Flagship Studio
            </h2>

            <div className="space-y-4 text-xs text-gray-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Roxas Flagship Studio & Hub</p>
                  <p className="text-gray-400 mt-0.5">
                    Rizal Street, Barangay Paclasan, Roxas, Oriental Mindoro 5212, Philippines (Near Port of Roxas / Nautical Highway)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Hotline & Customer Support</p>
                  <p className="text-gray-400 font-mono mt-0.5">+63 (43) 289-CAPS (2277)</p>
                  <p className="text-gray-400 font-mono">+63 917 555 4321 (SMS / WhatsApp)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Electronic Inquiries</p>
                  <p className="text-gray-400 font-mono mt-0.5">concierge@capzone.ph</p>
                  <p className="text-gray-400 font-mono">mindoro@capzone.ph</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Studio Hours</p>
                  <p className="text-gray-400 mt-0.5">Monday - Saturday: 9:00 AM – 8:00 PM PHT</p>
                  <p className="text-gray-400">Sunday: 10:00 AM – 7:00 PM PHT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <section className="space-y-6 pt-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-400">
            Got Questions?
          </span>
          <h2 className="text-2xl font-bold font-['Syne'] text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111827] border border-white/10 rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-xs sm:text-sm text-white">{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    activeFaq === idx ? 'rotate-180 text-blue-400' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-150">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
