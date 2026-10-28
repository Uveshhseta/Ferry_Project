import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  Mail, 
  LifeBuoy, 
  HelpCircle, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  AlertCircle, 
  ShieldCheck, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

const FAQS_EN = [
  {
    q: 'Are tickets valid for any departure time on the selected date?',
    a: 'Yes. Tickets purchased online are general boarding passes valid for any scheduled departure to and from Toronto Island on your chosen travel date.'
  },
  {
    q: 'Does the ticket price include the return voyage back to the mainland?',
    a: 'Yes. All standard ticket fares include both your outbound sailing to the Toronto Islands and your return crossing back to Jack Layton Ferry Terminal at no extra charge.'
  },
  {
    q: 'Can I bring bicycles, strollers, and pets on the ferry?',
    a: 'Bicycles, cargo wagons, and children strollers travel completely FREE with no additional ticket required. Domestic dogs on leashes are permitted on all passenger ferries in compliance with municipal bylaws.'
  },
  {
    q: 'What happens if a sailing is cancelled due to severe weather?',
    a: 'In the event of high wind advisories or harbor disruptions, tickets can be rescheduled for any future date or refunded in full via the My Account dashboard or by visiting the Jack Layton ticket window.'
  },
  {
    q: 'Is Jack Layton Ferry Terminal wheelchair and AODA accessible?',
    a: 'Yes. Jack Layton Terminal and all four primary fleet vessels are equipped with wide-access boarding ramps, accessible washrooms, and audio-visual headway announcements.'
  }
];

const FAQS_FR = [
  {
    q: 'Les billets sont-ils valides pour n’importe quelle heure de départ à la date sélectionnée ?',
    a: 'Oui. Les billets achetés en ligne sont des passes d’embarquement générales valides pour tout départ prévu vers et depuis les îles de Toronto à la date sélectionnée.'
  },
  {
    q: 'Le prix du billet comprend-il le trajet de retour vers le continent ?',
    a: 'Oui. Tous les tarifs de billets réguliers comprennent à la fois votre traversée aller vers les îles et votre retour vers le terminal Jack Layton sans frais supplémentaires.'
  },
  {
    q: 'Puis-je apporter des bicyclettes, des poussettes et des animaux sur le traversier ?',
    a: 'Les bicyclettes, chariots et poussettes d’enfants voyagent GRATUITEMENT sans billet supplémentaire. Les chiens domestiques en laisse sont admis sur tous les traversiers conformément aux règlements municipaux.'
  },
  {
    q: 'Que se passe-t-il si une traversée est annulée en raison du mauvais temps ?',
    a: 'En cas d’avis de vents violents ou de perturbations, les billets peuvent être reportés à une date ultérieure ou remboursés intégralement dans votre tableau de bord ou à la billetterie Jack Layton.'
  },
  {
    q: 'Le terminal Jack Layton est-il accessible en fauteuil roulant et conforme aux normes AODA ?',
    a: 'Oui. Le terminal Jack Layton et les quatre navires de la flotte sont dotés de rampes d’embarquement larges, de toilettes accessibles et d’annonces audiovisuelles.'
  }
];

export default function ContactSupportPage() {
  const { navigateTo, t, language } = useApp();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Transit Inquiry',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const activeFaqs = language === 'fr' ? FAQS_FR : FAQS_EN;

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', category: 'General Transit Inquiry', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Header */}
        <div className="pb-6 mb-8 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            <span>{language === 'fr' ? 'Ville de Toronto • Parcs, Forêts et Loisirs' : 'City of Toronto Parks, Forestry & Recreation'}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t('contactTitle')}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {t('contactSubtitle')}
          </p>
        </div>

        {/* Contact Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          
          {/* Card 1: 311 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-3 shadow-xs">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-base text-slate-900 mb-1">{t('contact311Title')}</h2>
              <p className="text-xs text-slate-600 mb-3">
                {t('contact311Desc')}
              </p>
            </div>
            <a href="tel:311" className="text-xs font-bold text-[#004f8b] hover:underline flex items-center gap-1">
              <span>{t('dial311Number')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Card 2: Terminal Office */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-base text-slate-900 mb-1">{t('terminalOffice')}</h2>
              <p className="text-xs text-slate-600 mb-3">
                {language === 'fr' ? '9 Queens Quay Ouest, Toronto, ON M5J 2H3 (au pied de la rue Bay). Ouvert tous les jours de 6 h 30 à 23 h 30.' : '9 Queens Quay West, Toronto, ON M5J 2H3 (Foot of Bay Street). Open daily from 6:30 AM to 11:30 PM.'}
              </p>
            </div>
            <button onClick={() => navigateTo('routes-map')} className="text-xs font-bold text-[#004f8b] hover:underline text-left">
              {t('viewRouteMaps')}
            </button>
          </div>

          {/* Card 3: Lost & Found */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-base text-slate-900 mb-1">{t('lostFoundTitle')}</h2>
              <p className="text-xs text-slate-600 mb-3">
                {t('lostFoundDesc')}
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-emerald-700">
              {language === 'fr' ? 'Ligne directe : 416-392-8193' : 'Direct: 416-392-8193'}
            </div>
          </div>

          {/* Card 4: Marine Safety */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold mb-3 shadow-xs">
                <LifeBuoy className="w-5 h-5" />
              </div>
              <h2 className="font-extrabold text-base text-slate-900 mb-1">{t('marineSafetyTitle')}</h2>
              <p className="text-xs text-slate-600 mb-3">
                {t('marineSafetyDesc')}
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-rose-700">
              {t('vhfChannel')}
            </div>
          </div>

        </div>

        {/* Form and FAQ 2-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Passenger Feedback / Inquiry Form */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4 text-[#004f8b]" />
              <span>{language === 'fr' ? 'Demandes directes des passagers' : 'Direct Passenger Inquiries'}</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {t('sendInquiryTitle')}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {language === 'fr' 
                ? 'Notre équipe d’exploitation et de billetterie répond aux demandes des clients dans un délai d’un jour ouvrable.' 
                : 'Our waterfront dispatch and ticketing team responds to customer inquiries within 1 business day.'}
            </p>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t('inquirySubmitted')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('inquiryName')} *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('inquiryEmail')} *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="alex@example.ca"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('inquirySubject')}</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="General Transit Inquiry">{language === 'fr' ? 'Renseignements généraux' : 'General Transit Inquiry'}</option>
                    <option value="Ticketing & Fares">{language === 'fr' ? 'Billetterie et tarifs' : 'Ticketing & Fares'}</option>
                    <option value="Lost and Found Item">{language === 'fr' ? 'Objets perdus et trouvés' : 'Lost and Found Item'}</option>
                    <option value="Accessibility Assistance">{language === 'fr' ? 'Assistance à l’accessibilité' : 'Accessibility Assistance'}</option>
                    <option value="Group / Charter Service">{language === 'fr' ? 'Service de groupe / nolisement' : 'Group / Charter Service'}</option>
                    <option value="Passenger Commendation / Feedback">{language === 'fr' ? 'Commentaires des passagers' : 'Passenger Feedback'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneOptional')}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="416-555-0100"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'fr' ? 'Objet *' : 'Subject *'}</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder={language === 'fr' ? 'Résumé de votre demande...' : 'Summary of your inquiry...'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t('inquiryMessage')} *</label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder={language === 'fr' ? 'Précisez votre date de traversée, votre code de billet ou votre question...' : 'Please provide details about your crossing date, ticket code, or question...'}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl bg-[#004f8b] hover:bg-blue-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{t('submitInquiry')}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4 text-[#004f8b]" />
                <span>{language === 'fr' ? 'Questions fréquentes' : 'Common Questions'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">
                {language === 'fr' ? 'Foire aux questions sur le transport' : 'Frequently Asked Transit Questions'}
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                {language === 'fr' 
                  ? 'Réponses aux questions les plus fréquentes sur les horaires, les billets, l’accessibilité et les opérations.' 
                  : 'Answers to top passenger questions about schedules, ticketing, accessibility, and seasonal operations.'}
              </p>

              <div className="space-y-3">
                {activeFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-[#004f8b]' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <div className="p-4 pt-0 text-xs text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-800">{language === 'fr' ? 'Prêt à voyager ?' : 'Ready to travel?'}</div>
                <div className="text-[11px] text-slate-500">{language === 'fr' ? 'Achetez des passes numériques à l’avance pour gagner du temps.' : 'Book digital passes in advance to save time.'}</div>
              </div>
              <button
                onClick={() => navigateTo('booking')}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors"
              >
                {t('bookPass')}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
