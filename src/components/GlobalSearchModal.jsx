import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  X, 
  MapPin, 
  Clock, 
  Compass, 
  Trees, 
  FileText, 
  Calendar, 
  PhoneCall, 
  ArrowRight,
  ShieldAlert,
  Ticket
} from 'lucide-react';

export default function GlobalSearchModal({ isOpen, onClose }) {
  const { navigateTo, t, language, routes, schedules, parks, alerts, locTerminal } = useApp();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const inputRef = useRef(null);

  const isFr = language === 'FR';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Search dataset synthesis across public operational resources
  const searchCorpus = [
    // 1. Routes & Terminals
    {
      id: 'src-route-1',
      title: isFr ? 'Terminal de traversier Jack Layton (Continent)' : 'Jack Layton Ferry Terminal (Mainland)',
      category: 'routes',
      categoryLabel: t('routesAndTerminals', 'Ferry Routes & Terminals'),
      icon: MapPin,
      page: 'routes-map',
      subtitle: isFr ? '9 Queens Quay Ouest • 4 cales d’embarquement • Correspondances métro et tramway TTC' : '9 Queens Quay West • 4 Boarding Slips • TTC Subway & Streetcar Connection',
      keywords: 'jack layton bay street mainland downtown terminal ttc union station continent traversier'
    },
    {
      id: 'src-route-2',
      title: isFr ? 'Terminal et traversée de l’Île Centre' : 'Centre Island Terminal & Crossing',
      category: 'routes',
      categoryLabel: t('routesAndTerminals', 'Ferry Routes & Terminals'),
      icon: MapPin,
      page: 'schedules',
      subtitle: isFr ? 'Quai principal des visiteurs • Traversée de 13 min • Parc d’attractions Centreville' : 'Primary visitor dock • 13 min crossing • Centreville Amusement Park',
      keywords: 'centre island park pier carousel farm amusement ile centre quai manege'
    },
    {
      id: 'src-route-3',
      title: isFr ? 'Terminal et dunes de la Pointe Hanlan' : "Hanlan's Point Terminal & Dunes",
      category: 'routes',
      categoryLabel: t('routesAndTerminals', 'Ferry Routes & Terminals'),
      icon: MapPin,
      page: 'routes-map',
      subtitle: isFr ? 'Quai ouest de l’île • Traversée de 11 min • Phare historique Gibraltar (1808) et plage' : 'Western island dock • 11 min crossing • 1808 Gibraltar Lighthouse & Beach',
      keywords: 'hanlan point beach lighthouse dunes sunset baseball pointe phare plage'
    },
    {
      id: 'src-route-4',
      title: isFr ? 'Terminal et promenade de l’Île Ward' : "Ward's Island Terminal & Boardwalk",
      category: 'routes',
      categoryLabel: t('routesAndTerminals', 'Ferry Routes & Terminals'),
      icon: MapPin,
      page: 'routes-map',
      subtitle: isFr ? 'Quai est de l’île • Traversée de 15 min • Chalets historiques et Café Riviera' : 'Eastern island dock • 15 min crossing • Historic Cottages & Island Cafe',
      keywords: 'wards island cottage community cafe boardwalk beach ile ward chalets promenade'
    },

    // 2. Schedules & Live Status
    {
      id: 'src-sched-1',
      title: isFr ? 'Horaires des traversiers et tableau des départs en direct' : 'Real-Time Ferry Schedules & Departure Board',
      category: 'schedules',
      categoryLabel: t('schedulesCategory', 'Schedules & Departures'),
      icon: Clock,
      page: 'schedules',
      subtitle: isFr ? 'Horaires officiels, assignation des navires, files d’attente aux portes, radar' : 'Official headway timetable, active vessel assignments, gate queues, radar',
      keywords: 'schedules departures times timetable frequency delay radar headway horaires departs retards'
    },
    {
      id: 'src-sched-2',
      title: isFr ? 'Achat de billets en ligne et passes numériques' : 'Online Ticket Booking & Digital Passes',
      category: 'booking',
      categoryLabel: t('navBooking', 'Book Tickets'),
      icon: Ticket,
      page: 'booking',
      subtitle: isFr ? 'Passes aller simple et aller-retour avec validation par code-barres optique' : 'Single and round-trip ferry passes with automated optical barcode entry',
      keywords: 'book ticket passes fares pricing gst tax presto price cost buy acheter billets tarif tps'
    },

    // 3. Parks & Attractions
    ...((parks || []).map((p) => ({
      id: `src-park-${p._id || p.id}`,
      title: p.name || p.title,
      category: 'parks',
      categoryLabel: t('parksCategory', 'Parks & Attractions'),
      icon: Trees,
      page: 'parks-trails',
      subtitle: `${locTerminal(p.destination || 'Toronto Island')} • ${p.category || 'Park Attraction'} • Rating: ${p.rating || 4.8}`,
      keywords: `${p.name} ${p.category} ${p.destination} ${p.description || ''} beach trail picnic playground plage sentier parc`
    }))),

    // 4. Recreation Programs
    {
      id: 'src-prog-1',
      title: isFr ? 'Académie junior de voile des îles et club de régates' : 'Island Junior Sailing Academy & Regatta Club',
      category: 'programs',
      categoryLabel: t('programsCategory', 'Recreation Programs'),
      icon: Compass,
      page: 'programs',
      subtitle: isFr ? 'Sessions de voile jeunesse d’été, certifications CANSail au lagon de Ward' : 'Youth summer sailing sessions, CANSail certifications at Ward’s Lagoon',
      keywords: 'sailing camp youth lesson kayak paddle sup boat watersports voile canotage'
    },
    {
      id: 'src-prog-2',
      title: isFr ? 'Camp d’éco-explorateurs de la nature insulaire' : 'Island Wilderness Eco-Explorers Camp',
      category: 'programs',
      categoryLabel: t('programsCategory', 'Recreation Programs'),
      icon: Compass,
      page: 'programs',
      subtitle: isFr ? 'Étude des étangs au jardin Franklin, éducation à la nature et faune urbaine' : 'Franklin Garden pond dipping, nature education, urban wildlife stewardship',
      keywords: 'eco camp children kids nature flora fauna biology garden ecologie enfants'
    },

    // 5. Permits & Bookings
    {
      id: 'src-prm-1',
      title: isFr ? 'Permis d’aires de pique-nique et barbecue (25+ personnes)' : 'Picnic & BBQ Area Permits (25+ People)',
      category: 'permits',
      categoryLabel: t('permitsCategory', 'Permits & Applications'),
      icon: FileText,
      page: 'permits',
      subtitle: isFr ? 'Réservations d’abris municipaux, permis de barbecue, élimination désignée du charbon' : 'Municipal shelter reservations, BBQ permits, designated charcoal disposal',
      keywords: 'permit picnic bbq barbecue shelter event gathering celebration group permis fete'
    },
    {
      id: 'src-prm-2',
      title: isFr ? 'Permis de foyers extérieurs désignés sur la plage' : 'Designated Beach Fire Pit Permits',
      category: 'permits',
      categoryLabel: t('permitsCategory', 'Permits & Applications'),
      icon: FileText,
      page: 'permits',
      subtitle: isFr ? 'Réservations de feux de plage aux foyers de Centre, Hanlan et Ward' : 'Beach campfire reservations at Centre, Hanlan, and Ward fire pits',
      keywords: 'fire pit campfire night evening beach bonfires feu plage soiree'
    },

    // 6. Events & News
    {
      id: 'src-evt-1',
      title: isFr ? 'Festival des bateaux-dragons et concerts symphoniques des îles' : 'Toronto Island Dragon Boat Festival & Symphony',
      category: 'events',
      categoryLabel: t('eventsCategory', 'Events & News'),
      icon: Calendar,
      page: 'events-news',
      subtitle: isFr ? 'Régates annuelles, concerts en plein air Arts in the Parks, communiqués officiels' : 'Annual regattas, Arts in the Parks live concerts, City press releases',
      keywords: 'events festival dragon boat arts concert news media releases regatta musique'
    },

    // 7. Support & Helpline
    {
      id: 'src-sup-1',
      title: isFr ? 'Ligne d’aide 311 Toronto et service des objets trouvés' : '311 Toronto Helpline & Lost and Found',
      category: 'support',
      categoryLabel: t('supportCategory', 'Support & Facilities'),
      icon: PhoneCall,
      page: 'contact',
      subtitle: isFr ? 'Information municipale 24/7, bureau du superviseur du terminal Jack Layton' : '24/7 City information, Jack Layton terminal supervisor desk, emergency contacts',
      keywords: 'contact phone 311 help support lost found customer service hours terminal assistance objets trouves'
    },
    {
      id: 'src-sup-2',
      title: isFr ? 'Avis maritimes en direct et bulletins météorologiques' : 'Live Marine Advisories & Weather Bulletins',
      category: 'alerts',
      categoryLabel: t('serviceAlertsTitle', 'Service Alerts'),
      icon: ShieldAlert,
      page: 'alerts',
      subtitle: isFr ? 'Télémétrie vent et vagues du lac Ontario, avis de brume, abonnements SMS' : 'Lake Ontario wind and wave telemetry, fog notices, SMS alert subscriptions',
      keywords: 'alerts weather wind advisory delay storm cancellation service warning meteo vent vagues'
    }
  ];

  const q = query.trim().toLowerCase();

  const results = searchCorpus.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCat) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.keywords.toLowerCase().includes(q)
    );
  });

  const handleSelectResult = (page) => {
    navigateTo(page);
    onClose();
  };

  const categoryPills = isFr ? [
    { id: 'all', label: 'Tous les résultats' },
    { id: 'routes', label: 'Terminaux' },
    { id: 'schedules', label: 'Horaires' },
    { id: 'parks', label: 'Parcs' },
    { id: 'programs', label: 'Programmes' },
    { id: 'permits', label: 'Permis' },
    { id: 'events', label: 'Événements' },
    { id: 'support', label: 'Soutien' }
  ] : [
    { id: 'all', label: 'All Results' },
    { id: 'routes', label: 'Terminals' },
    { id: 'schedules', label: 'Schedules' },
    { id: 'parks', label: 'Parks' },
    { id: 'programs', label: 'Programs' },
    { id: 'permits', label: 'Permits' },
    { id: 'events', label: 'Events' },
    { id: 'support', label: 'Support' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-12 md:pt-20 px-4 animate-fade-in">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[82vh] animate-modal-pop">
        
        {/* Search Input Bar */}
        <div className="p-4 md:p-6 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('globalSearchPlaceholder', 'Type a query (e.g. Centre Island, Hanlan, GST, pricing, permits, 311, schedules)...')}
            className="w-full bg-transparent text-sm md:text-base font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 btn-interactive cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold btn-interactive cursor-pointer"
          >
            {isFr ? 'ÉCHAP' : 'ESC'}
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs bg-white">
          {categoryPills.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition-colors pill-interactive cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#004f8b] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 animate-fade-in">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <div className="font-bold text-sm text-slate-700">
                {isFr ? 'Aucun résultat correspondant' : 'No matching search results'}
              </div>
              <div className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {isFr
                  ? `Aucun enregistrement ne correspond à « ${query} ». Essayez par destination comme « Île Centre » ou « Hanlan ».`
                  : `No verified records match "${query}". Try checking your spelling or search by destination like "Centre Island" or "Hanlan".`
                }
              </div>
            </div>
          ) : (
            results.map((res) => {
              const Icon = res.icon;
              return (
                <div
                  key={res.id}
                  onClick={() => handleSelectResult(res.page)}
                  className="p-3.5 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 hover:translate-x-1 transition-all duration-200 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#004f8b] flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#004f8b] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-xs md:text-sm text-slate-900 group-hover:text-[#004f8b] transition-colors">
                          {res.title}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.2 rounded-full">
                          {res.categoryLabel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">
                        {res.subtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#004f8b] group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                </div>
              );
            })
          )}
        </div>

        {/* Footer Notice */}
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-400 px-6">
          <span>
            {isFr 
              ? 'Recherche dans les registres officiels de transport et des îles' 
              : 'Search verified transit records & island facilities'}
          </span>
          <span className="hidden sm:inline font-mono">
            {isFr ? 'Cliquez ou appuyez pour sélectionner' : 'Use ↑↓ or click to select'}
          </span>
        </div>

      </div>
    </div>
  );
}
