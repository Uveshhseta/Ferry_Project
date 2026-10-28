import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Calendar, 
  Users, 
  MapPin, 
  Flame, 
  Camera, 
  UtensilsCrossed, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  Info,
  Sparkles,
  PhoneCall
} from 'lucide-react';

const PERMIT_CATEGORIES = [
  {
    id: 'picnic',
    title: 'Picnic & BBQ Area Permits',
    icon: UtensilsCrossed,
    fee: '$94.20 CAD + HST',
    capacity: 'Up to 200 People',
    locations: 'Centre Island Picnic Areas 1–12, Olympic Island, Ward’s Green',
    description: 'Reserved shelter sites with picnic tables, potable water access, and designated charcoal disposal bins.',
    rules: [
      'Required for gatherings of 25 or more persons',
      'Propane barbecues permitted (maximum 20 lb tank)',
      'No alcohol allowed unless special SOP permit obtained',
      'Site clean-up required before departure (Leave No Trace)'
    ]
  },
  {
    id: 'firepit',
    title: 'Designated Fire Pit Permits',
    icon: Flame,
    fee: '$34.50 CAD / 3-Hour Slot',
    capacity: 'Up to 35 People',
    locations: 'Centre Island Beach Pit, Hanlan’s West Dune Pit, Ward’s East Pit',
    description: 'Official City of Toronto beach and park fire pits for evening campfires and marshaling under starry harbour skies.',
    rules: [
      'Fires permitted between 5:00 PM and 10:30 PM only',
      'Clean untreated firewood only; no dimensional building lumber',
      'Bucket of water or sand must be kept at hand during burning',
      'Fires must be fully extinguished with water before vacating'
    ]
  },
  {
    id: 'photography',
    title: 'Wedding & Commercial Photography',
    icon: Camera,
    fee: '$182.00 CAD / 2-Hour Window',
    capacity: 'Crew & Wedding Party',
    locations: 'Franklin Children’s Garden, Gibraltar Lighthouse Grounds, Boardwalk',
    description: 'Exclusive municipal authorization to stage formal wedding, engagement, fashion, or commercial photo shoots.',
    rules: [
      'Permit must be carried on-site by photographer or lead client',
      'Drones prohibited across Toronto Harbour air corridor',
      'Does not permit blocking public pedestrian or cyclist thoroughfares',
      'Ferry transit fares for crew and wedding party are separate'
    ]
  },
  {
    id: 'special-event',
    title: 'Special Event & Regatta Gatherings',
    icon: Sparkles,
    fee: 'Variable by Group Scale',
    capacity: '200 to 2,000+ Guests',
    locations: 'Olympic Island Great Lawn, Hanlan’s Festival Grounds',
    description: 'Large-scale public or private community events, cultural festivals, school regattas, and corporate retreats.',
    rules: [
      'Applications must be submitted at least 45 business days in advance',
      'Requires City of Toronto Parks liaison and crowd control plan',
      'Sound amplification requires separate Toronto Noise Exemption',
      'Ferry charter coordination available via Harbour Operations'
    ]
  }
];

export default function PermitsPage() {
  const { navigateTo, t, locTerminal, language } = useApp();

  const [selectedCategory, setSelectedCategory] = useState(PERMIT_CATEGORIES[0]);
  const [formData, setFormData] = useState({
    permitType: 'Picnic & BBQ Area Permit',
    groupSize: '50',
    requestedDate: '2026-06-20',
    preferredIsland: 'Centre Island',
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    organization: '',
    specialRequests: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState(null);

  const getPermitTitle = (cat) => {
    if (language !== 'fr') return cat.title;
    const map = {
      'picnic': t('picnicPermits'),
      'firepit': t('firePitPermits'),
      'photography': t('photoPermits'),
      'special-event': t('specialEventPermits')
    };
    return map[cat.id] || cat.title;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      const generatedCode = `TO-PRM-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(generatedCode);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-amber-500" />
              <span>{language === 'fr' ? 'Ville de Toronto • Parcs, Forêts et Loisirs' : 'City of Toronto Parks, Forestry & Recreation'}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t('permitsTitle')}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {t('permitsSubtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start md:self-auto">
            <button
              onClick={() => navigateTo('booking')}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <span>{language === 'fr' ? 'Acheter des passes de groupe' : 'Book Group Ferry Passes'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Categories Selector */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {PERMIT_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory.id === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat);
                  setFormData(prev => ({ ...prev, permitType: cat.title }));
                }}
                className={`p-5 rounded-3xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#004f8b] text-white border-[#004f8b] shadow-lg scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-3 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-[#004f8b]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-sm mb-1">{getPermitTitle(cat)}</h3>
                  <div className={`text-xs font-black ${isSelected ? 'text-amber-300' : 'text-amber-600'}`}>
                    {cat.fee}
                  </div>
                </div>
                <div className={`text-[11px] mt-3 font-medium ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  {cat.capacity}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Permit Detail & Application Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Left: Permit Guidelines & Regulations */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>{language === 'fr' ? 'Exigences des règlements municipaux' : 'Municipal Bylaw Requirements'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-2">
                {getPermitTitle(selectedCategory)}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {selectedCategory.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                  <div className="text-slate-400 font-bold mb-0.5">{language === 'fr' ? 'Lieux approuvés sur l’île :' : 'Approved Island Sites:'}</div>
                  <div className="font-semibold text-slate-800">{selectedCategory.locations}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl text-xs border border-slate-100">
                  <div className="text-slate-400 font-bold mb-0.5">{language === 'fr' ? 'Capacité maximale :' : 'Maximum Capacity:'}</div>
                  <div className="font-semibold text-slate-800">{selectedCategory.capacity}</div>
                </div>
              </div>

              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                {language === 'fr' ? 'Règles essentielles du permis :' : 'Essential Permit Rules:'}
              </div>
              <div className="space-y-2 mb-6 text-xs text-slate-600">
                {selectedCategory.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-[#004f8b]">
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-[#004f8b]" />
                <span>{language === 'fr' ? 'Besoin d’aide du personnel ?' : 'Need Staff Assistance?'}</span>
              </div>
              <span>{language === 'fr' ? 'Contactez le bureau des permis au 416-392-8188 ou par courriel à ' : 'Contact Toronto Parks Permit Desk at 416-392-8188 or email '}<strong className="underline">pfrpermits@toronto.ca</strong></span>
            </div>
          </div>

          {/* Right: Interactive Permit Application Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-black text-slate-900 mb-1">
              {language === 'fr' ? 'Demander un ' : 'Apply for '}{getPermitTitle(selectedCategory)}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {language === 'fr' 
                ? 'Remplissez cette réservation de permis municipal. Les demandes sont traitées dans un délai de 2 jours ouvrables.' 
                : 'Complete this municipal permit reservation. Applications are reviewed and issued within 2 business days.'}
            </p>

            {submittedRef ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-3xl text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  {language === 'fr' ? 'Demande de permis enregistrée' : 'Permit Application Lodged'}
                </span>
                <h3 className="text-2xl font-black text-emerald-950 mt-3 mb-1">
                  {language === 'fr' ? 'Code de référence :' : 'Reference Code:'} {submittedRef}
                </h3>
                <p className="text-xs text-emerald-700 max-w-md mx-auto mb-6">
                  {language === 'fr' 
                    ? `Merci, ${formData.applicantName}. Votre demande de permis pour ${getPermitTitle(selectedCategory)} le ${formData.requestedDate} a été enregistrée auprès des opérations du secteur riverain de Toronto.`
                    : `Thank you, ${formData.applicantName}. Your permit request for ${formData.permitType} on ${formData.requestedDate} has been logged with City of Toronto Waterfront Operations.`}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setSubmittedRef(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50"
                  >
                    {language === 'fr' ? 'Soumettre une autre demande' : 'Submit Another Application'}
                  </button>
                  <button
                    onClick={() => navigateTo('booking')}
                    className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md"
                  >
                    {language === 'fr' ? 'Acheter des passes de groupe maintenant' : 'Book Group Ferry Passes Now'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('permitType')}</label>
                    <input
                      type="text"
                      readOnly
                      value={getPermitTitle(selectedCategory)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('requestedDate')} *</label>
                    <input
                      type="date"
                      required
                      value={formData.requestedDate}
                      onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('preferredIsland')}</label>
                    <select
                      value={formData.preferredIsland}
                      onChange={(e) => setFormData({ ...formData, preferredIsland: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="Centre Island">{locTerminal('Centre Island')} ({language === 'fr' ? 'Île Olympic et jetée' : 'Olympic Island & Pier'})</option>
                      <option value="Hanlan's Point">{locTerminal("Hanlan's Point")} ({language === 'fr' ? 'Dunes ouest et terrains' : 'West Dunes & Ball Diamonds'})</option>
                      <option value="Ward's Island">{locTerminal("Ward's Island")} ({language === 'fr' ? 'Espace vert et promenade' : 'East Green & Boardwalk'})</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('groupSize')} *</label>
                    <input
                      type="number"
                      min="5"
                      max="2000"
                      required
                      value={formData.groupSize}
                      onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <div className="text-xs font-bold text-slate-700 uppercase mb-3">
                    {language === 'fr' ? 'Identification du demandeur et coordonnées' : 'Applicant & Contact Identification'}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('applicantName')} *</label>
                      <input
                        type="text"
                        required
                        value={formData.applicantName}
                        onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                        placeholder="e.g. Maya Chen"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'fr' ? 'Nom de l’organisation ou famille' : 'Organization / Family Name'}</label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        placeholder={language === 'fr' ? 'ex. Réunion de famille Chen / Groupe communautaire' : 'e.g. Chen Family Reunion / Community Group'}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('applicantEmail')} *</label>
                      <input
                        type="email"
                        required
                        value={formData.applicantEmail}
                        onChange={(e) => setFormData({ ...formData, applicantEmail: e.target.value })}
                        placeholder="maya@toronto.ca"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('applicantPhone')} *</label>
                      <input
                        type="tel"
                        required
                        value={formData.applicantPhone}
                        onChange={(e) => setFormData({ ...formData, applicantPhone: e.target.value })}
                        placeholder="416-555-0188"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'fr' ? 'Description de l’événement et équipement' : 'Event Description & Special Equipment Details'}</label>
                  <textarea
                    rows={2}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    placeholder={language === 'fr' ? 'Décrivez vos activités, tentes, sonorisation ou besoins AODA...' : 'Describe activities, sound equipment, catering tents, or accessibility requirements...'}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                  />
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                  {language === 'fr' 
                    ? 'En soumettant cette demande, vous acceptez de vous conformer au chapitre 608 du code municipal de Toronto (Parcs) et aux règles de sécurité du traversier des îles de Toronto.' 
                    : 'By submitting this request, you agree to comply with City of Toronto Municipal Code Chapter 608 (Parks) and Toronto Island Ferry safety regulations.'}
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-[#004f8b] hover:bg-blue-800 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>{t('applyPermitButton')}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
