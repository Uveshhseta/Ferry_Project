import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PARKS_AND_TRAILS, AMENITIES_LIST } from '../data/ferryData';
import { 
  Trees, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  Bike, 
  Sun, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Info,
  Footprints,
  Compass
} from 'lucide-react';

export default function ParksTrailsPage() {
  const { navigateTo, parks, t, locTerminal, locStatus, language } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIsland, setSelectedIsland] = useState('all');

  const categories = [
    'all',
    'Family Attractions',
    'Beaches & Waterfront',
    'Historic Landmarks',
    'Scenic Trails',
    'Dining & Heritage'
  ];

  const getCategoryLabel = (cat) => {
    if (cat === 'all') return t('allExperiences');
    if (language !== 'fr') return cat;
    const map = {
      'Family Attractions': 'Attractions familiales',
      'Beaches & Waterfront': 'Plages et rivages',
      'Historic Landmarks': 'Lieux historiques',
      'Scenic Trails': 'Sentiers panoramiques',
      'Dining & Heritage': 'Restauration et patrimoine'
    };
    return map[cat] || cat;
  };

  const dataSource = (parks && parks.length > 0) ? parks : PARKS_AND_TRAILS;

  const filteredAttractions = dataSource.filter(item => {
    const itemDestination = item.destination || item.area || '';
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesIsland = selectedIsland === 'all' || itemDestination.toLowerCase().includes(selectedIsland.toLowerCase());
    return matchesSearch && matchesCategory && matchesIsland;
  });

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
              <Trees className="w-4 h-4 text-emerald-600" />
              <span>{t('parksDirectoryBadge')}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t('parksTitle')}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {t('parksSubtitle')}
            </p>
          </div>

          <button
            onClick={() => navigateTo('booking')}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <span>{t('bookFerryToParks')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-slate-200 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder={t('searchParks')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#004f8b]"
              />
            </div>

            {/* Island Destination Filter */}
            <select
              value={selectedIsland}
              onChange={(e) => setSelectedIsland(e.target.value)}
              className="w-full md:w-56 p-2.5 rounded-2xl border border-slate-200 text-xs md:text-sm font-bold text-slate-700 bg-white"
            >
              <option value="all">{t('allIslandLocations')}</option>
              <option value="centre">{locTerminal('Centre Island')}</option>
              <option value="hanlan">{locTerminal("Hanlan's Point")}</option>
              <option value="ward">{locTerminal("Ward's Island")}</option>
            </select>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-[#004f8b] text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAttractions.map((item) => (
            <div 
              key={item._id || item.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image */}
                <div className="h-56 relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-xs">
                    {getCategoryLabel(item.category)}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" />
                    <span>{locTerminal(item.destination)}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded-md shadow-xs">
                    ★ {item.rating}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-[#004f8b] transition-colors mb-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  {/* Highlights list */}
                  <div className="space-y-1.5 mb-4 text-xs">
                    {item.features?.map((feat, i) => (
                      <div key={i} className="flex items-center space-x-1.5 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('hours')}: {item.hours}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 font-medium">
                  {item.distanceFromDock}
                </span>
                <button
                  onClick={() => navigateTo('booking', { to: item.destination.split(' ')[0] + ' Island' })}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-[#004f8b] hover:bg-[#004f8b] hover:text-white font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <span>{t('bookPass')}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Trail Guides & Distance Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 mb-12">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
            <Footprints className="w-4 h-4 text-orange-500" />
            <span>{language === 'fr' ? 'Itinéraires officiels de randonnée et de vélo des îles de Toronto' : 'Official Toronto Island Hiking & Cycling Routes'}</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            {t('curatedTrails')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Trail 1 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {language === 'fr' ? 'Facile • Pavé et promenade' : 'Easy • Paved & Boardwalk'}
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-2 mb-1">{language === 'fr' ? 'La grande promenade de l’île' : 'The Great Island Boardwalk'}</h3>
              <p className="text-xs text-slate-600 mb-3">
                {language === 'fr' 
                  ? 'Promenade continue en bois au bord du lac s’étendant de la plage de Ward à la jetée de l’île Centre, surplombant le lac Ontario.' 
                  : "Continuous lakeside wooden boardwalk spanning from Ward's beach to Centre Island pier, overlooking open Lake Ontario."}
              </p>
              <div className="text-xs space-y-1 text-slate-700 font-medium">
                <div>Distance: <strong>5.5 km (3.4 mi)</strong></div>
                <div>{language === 'fr' ? 'Durée :' : 'Time:'} <strong>{language === 'fr' ? '~1 h 15 min marche / 20 min vélo' : '~1h 15m walk / 20m cycle'}</strong></div>
                <div>{language === 'fr' ? 'Accessibilité :' : 'Accessibility:'} <strong>{language === 'fr' ? 'Rampe accessible AODA' : 'Full Wheelchair Ramp'}</strong></div>
              </div>
            </div>

            {/* Trail 2 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-[#004f8b] px-2 py-0.5 rounded-full">
                {language === 'fr' ? 'Parcours patrimonial' : 'Heritage Walk'}
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-2 mb-1">{language === 'fr' ? 'Sentier du phare de Gibraltar' : 'Gibraltar Lighthouse Trail'}</h3>
              <p className="text-xs text-slate-600 mb-3">
                {language === 'fr' 
                  ? 'Sentier ombragé sous les saules pleureurs longeant les lagunes de truites menant au phare historique de 1808 de Gibraltar Point.' 
                  : 'Shaded forest path under weeping willows leading past trout lagoons to the historic 1808 Gibraltar Point Lighthouse.'}
              </p>
              <div className="text-xs space-y-1 text-slate-700 font-medium">
                <div>Distance: <strong>3.2 km</strong></div>
                <div>{language === 'fr' ? 'Durée :' : 'Time:'} <strong>{language === 'fr' ? '~45 min de marche' : '~45 min walk'}</strong></div>
                <div>{language === 'fr' ? 'Points forts :' : 'Highlights:'} <strong>{language === 'fr' ? 'Légende historique et havre naturel' : 'Ghost Legend & Nature Haven'}</strong></div>
              </div>
            </div>

            {/* Trail 3 */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                {language === 'fr' ? 'Famille et flore' : 'Family & Flora'}
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-2 mb-1">{language === 'fr' ? 'Boucle de la lagune de Centre Island' : 'Centre Island Lagoon Loop'}</h3>
              <p className="text-xs text-slate-600 mb-3">
                {language === 'fr' 
                  ? 'Sentier sinueux traversant des passerelles japonaises reliant l’île Olympic, le jardin Franklin et Centreville.' 
                  : 'Meandering trail across ornate Japanese footbridges connecting Olympic Island, Franklin Garden, and Centreville.'}
              </p>
              <div className="text-xs space-y-1 text-slate-700 font-medium">
                <div>Distance: <strong>2.4 km</strong></div>
                <div>{language === 'fr' ? 'Durée :' : 'Time:'} <strong>{language === 'fr' ? '~35 min de marche' : '~35 min walk'}</strong></div>
                <div>{language === 'fr' ? 'Points forts :' : 'Highlights:'} <strong>{language === 'fr' ? 'Cygnes, pédalos et fleurs' : 'Swans, Pedal Boats & Flowers'}</strong></div>
              </div>
            </div>

          </div>
        </div>

        {/* Real-Time Island Amenities Status */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {t('liveFacilitiesStatus')}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {language === 'fr' ? 'Surveillé toutes les heures par les équipes d’entretien de Parcs, Forêts et Loisirs de Toronto.' : 'Monitored hourly by Toronto Parks, Forestry & Recreation maintenance crews.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AMENITIES_LIST.map((facility, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 truncate pr-1">{facility.name}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                    {locStatus(facility.status)}
                  </span>
                </div>
                <div className="text-slate-500 text-[11px]">{locTerminal(facility.location)}</div>
                <div className="text-[10px] text-[#004f8b] font-semibold mt-1">
                  {facility.accessible ? (language === 'fr' ? '✓ Accessible en fauteuil roulant (AODA)' : '✓ AODA Wheelchair Accessible') : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
