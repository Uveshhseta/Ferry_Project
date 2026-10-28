import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Tag, 
  Radio, 
  Newspaper, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Share2,
  ExternalLink
} from 'lucide-react';

const EVENTS_AND_NEWS = [
  {
    id: 'evt-1',
    type: 'event',
    title: 'Toronto Island Dragon Boat Race Festival',
    date: 'Saturday, June 13 & Sunday, June 14, 2026',
    time: '8:00 AM – 5:00 PM',
    location: 'Centre Island & Olympic Island Lagoon',
    category: 'Water Sports Regatta',
    image: '/images/hero-ferry.jpg',
    description: 'Over 120 teams from across North America compete in high-energy dragon boat heats along the scenic island regatta course. Spectators enjoy cultural performances, artisan foods, and shoreline cheer stations.',
    admission: 'Free for Spectators (Ferry Fare Required)',
    status: 'Upcoming'
  },
  {
    id: 'evt-2',
    type: 'event',
    title: 'Arts in the Parks: Sunset Symphony on the Shore',
    date: 'Saturday, July 11, 2026',
    time: '7:00 PM – 9:30 PM',
    location: 'Olympic Island Amphitheatre Lawn',
    category: 'Live Music & Performing Arts',
    image: '/images/centre-island.jpg',
    description: 'An open-air orchestral twilight performance overlooking the Lake Ontario horizon. Bring a picnic blanket and enjoy classical masterpieces accompanied by waterfront acoustic serenity.',
    admission: 'Free Admission (Donations Welcome)',
    status: 'Upcoming'
  },
  {
    id: 'evt-3',
    type: 'event',
    title: 'Annual Blessing of the Waterfront Fleet',
    date: 'Victoria Day Weekend — Sunday, May 17, 2026',
    time: '11:00 AM – 1:30 PM',
    location: 'Jack Layton Ferry Terminal & Inner Harbour',
    category: 'Maritime Heritage',
    image: '/images/hero-ferry.jpg',
    description: 'Historic maritime tradition marking the opening of the peak summer crossing season. All 4 Toronto Island ferries and local vessels participate in ceremonial parade with water cannon salutes.',
    admission: 'Public Viewing from Queens Quay Boardwalk',
    status: 'Featured'
  },
  {
    id: 'news-1',
    type: 'news',
    title: 'City of Toronto Fleet Electrification Progress Report',
    date: 'October 15, 2026',
    time: 'Press Release • PF&R Maritime Division',
    location: 'Toronto City Hall / Marine Operations',
    category: 'Fleet Modernization',
    image: '/images/hero-ferry.jpg',
    description: 'Toronto City Council confirms delivery schedule for the first zero-emission fully electric passenger ferry, scheduled to begin harbor sea trials in early 2027. High-speed shore charging infrastructure at Jack Layton Terminal is 80% complete.',
    admission: 'Official City Release',
    status: 'Latest News'
  },
  {
    id: 'news-2',
    type: 'news',
    title: 'Fall/Winter Seasonal Sailing Timetable Adjustments',
    date: 'October 8, 2026',
    time: 'Operations Bulletin',
    location: 'All Toronto Island Ferry Docks',
    category: 'Service Notice',
    image: '/images/hanlan-beach.jpg',
    description: 'Toronto Ferry Services transitions to scheduled shoulder-season service. Ferries to Centre Island, Hanlan’s Point, and Ward’s Island will run with updated 30-minute to 45-minute headways. Passenger waiting pavilions will have supplemental radiant heating.',
    admission: 'Transit Update',
    status: 'Public Advisory'
  },
  {
    id: 'news-3',
    type: 'news',
    title: 'Shoreline Stabilization & Dune Restoration at Hanlan’s Point',
    date: 'September 22, 2026',
    time: 'Environmental Initiative',
    location: "Hanlan's Point Coastal Dune Sanctuary",
    category: 'Conservation',
    image: '/images/hanlan-beach.jpg',
    description: 'City of Toronto Urban Forestry team completes planting of 3,500 native marram grasses and willow saplings to prevent lake swell erosion along the western sand dunes and protect coastal nesting areas.',
    admission: 'Urban Forestry Bulletin',
    status: 'Conservation'
  }
];

export default function EventsNewsPage() {
  const { navigateTo, t, locTerminal, language } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'event' | 'news'
  const [search, setSearch] = useState('');
  const [selectedItemModal, setSelectedItemModal] = useState(null);

  const filteredItems = EVENTS_AND_NEWS.filter((item) => {
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.description.toLowerCase().includes(search.toLowerCase()) ||
                          item.location.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{language === 'fr' ? 'Ville de Toronto PF&R • Événements riverains' : 'City of Toronto PF&R • Waterfront Happenings'}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t('eventsNewsTitle')}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {t('eventsNewsSubtitle')}
            </p>
          </div>

          <button
            onClick={() => navigateTo('booking')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-2 self-start md:self-auto"
          >
            <span>{language === 'fr' ? 'Acheter des passes pour les événements' : 'Book Passes to Events'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'fr' ? 'Rechercher bateaux-dragons, symphonie, actualités...' : 'Search dragon boats, symphony, fleet news, environmental updates...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'all' ? 'bg-[#004f8b] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t('allEvents')}
              </button>
              <button
                onClick={() => setActiveTab('event')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'event' ? 'bg-[#004f8b] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('upcomingEvents')}</span>
              </button>
              <button
                onClick={() => setActiveTab('news')}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'news' ? 'bg-[#004f8b] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Newspaper className="w-3.5 h-3.5 text-blue-400" />
                <span>{t('cityNews')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-xs">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                    {item.status}
                  </div>
                </div>

                <div className="p-6">
                  <div className="text-[11px] font-bold text-[#004f8b] mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#004f8b]" />
                    <span>{item.date}</span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 group-hover:text-[#004f8b] transition-colors mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                      <span>{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">
                  {item.admission}
                </span>

                <button
                  onClick={() => setSelectedItemModal(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#004f8b] hover:bg-[#004f8b] hover:text-white font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <span>{t('readMore')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedItemModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="max-w-xl w-full bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in">
              <button
                onClick={() => setSelectedItemModal(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                ✕
              </button>

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#004f8b] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {selectedItemModal.category}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2 mb-2">
                {selectedItemModal.title}
              </h2>
              <div className="text-xs text-slate-500 space-y-1 mb-4 pb-3 border-b border-slate-100">
                <div>{t('eventDate')}: <strong>{selectedItemModal.date} • {selectedItemModal.time}</strong></div>
                <div>{t('eventLocation')}: <strong>{selectedItemModal.location}</strong></div>
                <div>{language === 'fr' ? 'Entrée :' : 'Admission:'} <strong>{selectedItemModal.admission}</strong></div>
              </div>

              <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-6">
                {selectedItemModal.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedItemModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                >
                  {t('close')}
                </button>

                <button
                  onClick={() => { setSelectedItemModal(null); navigateTo('booking'); }}
                  className="px-6 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>{t('bookPass')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
