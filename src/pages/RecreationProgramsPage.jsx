import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Users, 
  Calendar, 
  MapPin, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Waves, 
  TreePine, 
  LifeBuoy, 
  Filter, 
  Search,
  Sparkles,
  ShieldCheck,
  X
} from 'lucide-react';

const PROGRAMS_DATA = [
  {
    id: 'prog-1',
    title: 'Island Junior Sailing Academy',
    category: 'watersports',
    ageRange: 'Ages 9 – 16',
    ageGroup: 'youth',
    location: 'Toronto Island Sailing Club (Ward’s Lagoon)',
    duration: '2-Week Summer Sessions (Mon – Fri)',
    schedule: '9:00 AM – 3:30 PM',
    fee: '$345.00 CAD',
    spots: 6,
    instructor: 'Sail Canada Certified Lead Instructor',
    description: 'Learn dinghy sailing fundamentals, maritime safety, knot tying, tacking, and Lake Ontario navigation in protected island lagoons.',
    highlights: ['Dinghy Handling & Capsizing Recovery', 'Lifejackets & Safety Skiffs Provided', 'Sail Canada CANSail 1 & 2 Certification', 'Low 1:5 Instructor-to-Student Ratio']
  },
  {
    id: 'prog-2',
    title: 'Island Wilderness Eco-Explorers Camp',
    category: 'nature',
    ageRange: 'Ages 6 – 12',
    ageGroup: 'children',
    location: 'Franklin Children’s Garden & Trout Pond',
    duration: '1-Week Day Camp',
    schedule: '9:30 AM – 4:00 PM',
    fee: '$260.00 CAD',
    spots: 8,
    instructor: 'Toronto PF&R Urban Naturalists',
    description: 'Hands-on biodiversity exploration, pond dipping, wetland bird identification, pollinator botany, and ecological stewardship on the car-free island.',
    highlights: ['Pond Dipping & Aquatic Bug Surveys', 'Birding Binoculars & Field Guides Included', 'Pollinator Planting & Tree Care', 'AODA Accessible Learning Stations']
  },
  {
    id: 'prog-3',
    title: 'Harbour Sunset Kayak & Canoe Club',
    category: 'watersports',
    ageRange: 'Ages 16+ (All Adults)',
    ageGroup: 'adult',
    location: 'Centre Island Boat House Slips',
    duration: 'Weekly Evening Sessions (Wednesdays)',
    schedule: '6:00 PM – 8:00 PM',
    fee: '$45.00 CAD / session',
    spots: 10,
    instructor: 'Paddle Canada Certified Guide',
    description: 'Guided evening paddle through the serene lagoons and inner harbour channels with breathtaking twilight vistas of the Toronto skyline.',
    highlights: ['Sea Kayak / Tandem Canoe & Paddle Included', 'PFD & Whistle Provided', 'Sunset Photography Breaks', 'Beginners Welcome']
  },
  {
    id: 'prog-4',
    title: 'Morning Mindfulness & Yoga on the Dunes',
    category: 'fitness',
    ageRange: 'Ages 14+ (All Fitness Levels)',
    ageGroup: 'adult',
    location: "Hanlan's Point Beach (Quiet Pavilion Area)",
    duration: 'Saturday & Sunday Mornings',
    schedule: '8:30 AM – 9:45 AM',
    fee: '$18.00 CAD (or City Rec Pass)',
    spots: 15,
    instructor: 'Registered Hatha Yoga Instructor',
    description: 'Outdoor restorative flow session listening to the gentle lapping of Lake Ontario waves. Designed to promote stress relief and flexibility.',
    highlights: ['Gentle Breathwork & Meditation', 'Sand Mat Space & Shaded Pavilion Options', 'Accessible by Early Ferry Crossing', 'Complimentary Herbal Tea']
  },
  {
    id: 'prog-5',
    title: 'Toronto Island Heritage Walking Tours',
    category: 'culture',
    ageRange: 'All Ages Welcome',
    ageGroup: 'all',
    location: "Ward's Island Ferry Dock Departure",
    duration: 'Every Weekend (Sat & Sun)',
    schedule: '11:00 AM – 1:00 PM',
    fee: 'FREE (City of Toronto Sponsored)',
    spots: 20,
    instructor: 'Toronto Island Historical Society',
    description: 'Fascinating guided walk through the 1808 Gibraltar Lighthouse lore, historic 1920s cottage community, and indigenous waterfront history.',
    highlights: ['Ghost Legend of J.P. Radelmüller', 'Historic Cottage Garden Architecture', 'Wheelchair & Stroller Accessible Route', 'Free Commemorative Map']
  },
  {
    id: 'prog-6',
    title: 'Youth Stand-Up Paddleboard (SUP) Academy',
    category: 'watersports',
    ageRange: 'Ages 11 – 17',
    ageGroup: 'youth',
    location: 'Olympic Island Lagoon Calm Waters',
    duration: '3-Day Weekend Intensive',
    schedule: '10:00 AM – 1:00 PM',
    fee: '$185.00 CAD',
    spots: 5,
    instructor: 'Paddle Canada Certified SUP Coach',
    description: 'Learn balance, core paddle strokes, water safety rescue protocols, and lagoon navigation on high-stability boards.',
    highlights: ['Board, Paddle, Leash & PFD Included', 'Flat-Water Lagoon Conditions', 'Balance & Pivot Turn Techniques', 'Certificate of Completion']
  }
];

export default function RecreationProgramsPage() {
  const { navigateTo, t, language } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [search, setSearch] = useState('');
  const [registeredModal, setRegisteredModal] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', participants: 1, notes: '' });
  const [formSuccess, setFormSuccess] = useState(false);

  const filteredPrograms = PROGRAMS_DATA.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesAge = selectedAge === 'all' || p.ageGroup === selectedAge || p.ageGroup === 'all';
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase()) ||
                          p.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesAge && matchesSearch;
  });

  const handleOpenRegister = (prog) => {
    setRegisteredModal(prog);
    setFormSuccess(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSuccess(true);
    setTimeout(() => {
      setRegisteredModal(null);
      setFormSuccess(false);
      setFormData({ name: '', email: '', phone: '', participants: 1, notes: '' });
    }, 2800);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-emerald-600" />
              <span>{language === 'fr' ? 'Ville de Toronto PF&R • Loisirs riverains' : 'City of Toronto PF&R • Waterfront Recreation'}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t('programsTitle')}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {t('programsSubtitle')}
            </p>
          </div>

          <button
            onClick={() => navigateTo('booking')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-2 self-start md:self-auto"
          >
            <span>{language === 'fr' ? 'Acheter une traversée pour les programmes' : 'Book Ferry to Island Programs'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher voile, camps, yoga, nature, kayak...' : 'Search sailing, camps, yoga, nature, kayaking...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
              />
            </div>

            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs md:text-sm font-bold text-slate-700 bg-white"
              >
                <option value="all">{t('allPrograms')}</option>
                <option value="watersports">{language === 'fr' ? 'Voile, kayak et planche à pagaie' : 'Sailing, Kayak & SUP'}</option>
                <option value="nature">{language === 'fr' ? 'Camps d’écologie et de nature' : 'Nature & Ecology Camps'}</option>
                <option value="fitness">{language === 'fr' ? 'Pleine conscience et yoga' : 'Mindfulness & Yoga'}</option>
                <option value="culture">{language === 'fr' ? 'Visites patrimoniales et pédestres' : 'Heritage & Walking Tours'}</option>
              </select>
            </div>

            <div>
              <select
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value)}
                className="w-full p-2.5 rounded-2xl border border-slate-200 text-xs md:text-sm font-bold text-slate-700 bg-white"
              >
                <option value="all">{t('allAges')}</option>
                <option value="children">{language === 'fr' ? 'Enfants (6–12 ans)' : 'Children (Ages 6–12)'}</option>
                <option value="youth">{language === 'fr' ? 'Jeunes et ados (9–17 ans)' : 'Youth & Teens (Ages 9–17)'}</option>
                <option value="adult">{language === 'fr' ? 'Adultes et aînés (16+)' : 'Adults & Seniors (16+)'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Programs Grid */}
        {filteredPrograms.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-base text-slate-800">{language === 'fr' ? 'Aucun programme trouvé' : 'No Programs Found'}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {language === 'fr' 
                ? 'Aucune activité de loisir ne correspond à vos critères de recherche. Essayez d’effacer les filtres ou de chercher « voile » ou « nature ».' 
                : 'No recreation activities match your current search criteria. Try clearing filters or searching for "sailing" or "nature".'}
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedAge('all'); }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
            >
              {language === 'fr' ? 'Réinitialiser les filtres' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredPrograms.map((prog) => (
              <div 
                key={prog.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#004f8b] px-2.5 py-1 rounded-full border border-blue-200/50">
                      {prog.ageRange}
                    </span>
                    <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      {prog.fee}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#004f8b] transition-colors mb-2">
                    {prog.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {prog.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span className="font-medium truncate">{prog.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{prog.schedule}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{prog.instructor}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-2">
                    {prog.highlights.slice(0, 3).map((h, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {prog.spots} {language === 'fr' ? 'places restantes' : 'spots remaining'}
                  </span>
                  <button
                    onClick={() => handleOpenRegister(prog)}
                    className="px-4 py-2 rounded-xl bg-[#004f8b] hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>{t('registerNow')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Registration Modal */}
        {registeredModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
              <button
                onClick={() => setRegisteredModal(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>{language === 'fr' ? 'Inscription aux loisirs de la Ville de Toronto' : 'City of Toronto Recreation Registration'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-1">
                {registeredModal.title}
              </h2>
              <div className="text-xs text-slate-500 mb-4">
                {registeredModal.location} • {registeredModal.schedule} • <strong>{registeredModal.fee}</strong>
              </div>

              {formSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <h3 className="font-black text-base text-emerald-900">{language === 'fr' ? 'Demande d’inscription reçue !' : 'Registration Inquiry Received!'}</h3>
                  <p className="text-xs text-emerald-700 mt-1">
                    {language === 'fr' 
                      ? `Votre demande pour ${registeredModal.title} a été enregistrée. Un courriel de confirmation officiel contenant les détails de la traversée en traversier a été envoyé à ${formData.email}.`
                      : `Your request for ${registeredModal.title} has been logged. An official confirmation email with ferry transit details has been sent to ${formData.email}.`}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'fr' ? 'Nom du participant ou tuteur *' : 'Participant / Guardian Name *'}</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jordan Smith"
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('emailLabel')} *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="jordan@toronto.ca"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneLabel')} *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="416-555-0199"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'fr' ? 'Nombre de participants' : 'Number of Participants'}</label>
                    <select
                      value={formData.participants}
                      onChange={(e) => setFormData({ ...formData, participants: parseInt(e.target.value, 10) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                    >
                      <option value="1">{language === 'fr' ? '1 participant' : '1 Participant'}</option>
                      <option value="2">{language === 'fr' ? '2 participants' : '2 Participants'}</option>
                      <option value="3">{language === 'fr' ? '3 participants' : '3 Participants'}</option>
                      <option value="4">{language === 'fr' ? '4 participants (Groupe)' : '4 Participants (Group)'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{language === 'fr' ? 'Exigences particulières ou notes médicales (optionnel)' : 'Special Requirements or Medical Notes (Optional)'}</label>
                    <textarea
                      rows={2}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={language === 'fr' ? 'Régime alimentaire, niveau en natation, besoins d’accessibilité AODA...' : 'Dietary, swimming comfort level, AODA accessibility needs...'}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
                    />
                  </div>

                  <p className="text-[11px] text-slate-500">
                    {language === 'fr' 
                      ? '* Les passes de traversier sont vendues séparément. Les participants inscrits bénéficient d’un embarquement prioritaire municipal pendant les heures du camp.' 
                      : '* Ferry passes are sold separately. Registered participants qualify for municipal concession boarding during camp hours.'}
                  </p>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setRegisteredModal(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                    >
                      {t('cancel')}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#004f8b] hover:bg-blue-800 text-white font-black text-xs shadow-md transition-all"
                    >
                      {language === 'fr' ? 'Envoyer la demande d’inscription' : 'Submit Registration Request'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
