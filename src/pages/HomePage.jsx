import React from 'react';
import { useApp } from '../context/AppContext';
import BookingCard from '../components/BookingCard';
import HarbourRadarVisual from '../components/HarbourRadarVisual';
import { 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Waves, 
  Sparkles, 
  Calendar, 
  Users, 
  Ticket, 
  ChevronRight,
  Compass,
  FileText,
  HelpCircle
} from 'lucide-react';

export default function HomePage() {
  const { 
    navigateTo, 
    schedules, 
    alerts, 
    t, 
    language, 
    locTerminal, 
    locStatus 
  } = useApp();

  const activeAlert = alerts[0];
  const isFr = language === 'FR';

  return (
    <div className="w-full">
      
      {/* 1. Real-Time Service Notice Banner */}
      {activeAlert && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-900 px-4 sm:px-6 lg:px-8 py-2 text-xs font-semibold flex items-center justify-between shadow-inner">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="bg-slate-900 text-amber-300 text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded">
                {t('liveNotice', 'Live Notice')}
              </span>
              <span className="truncate">{activeAlert.title}: {activeAlert.message}</span>
            </div>
            <button
              onClick={() => navigateTo('alerts')}
              className="hidden sm:flex items-center space-x-1 text-slate-900 font-bold hover:underline ml-4 whitespace-nowrap text-[11px] cursor-pointer"
            >
              <span>{t('viewAllAlerts', 'View All Alerts')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        
        {/* Background Image: photorealistic Toronto Ferry & Lake Ontario */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: "url('/images/hero-ferry.jpg')" }}
        >
          {/* Layered Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#002d54]/75 via-[#004f8b]/50 to-slate-900/80"></div>
          <div className="absolute inset-0 bg-radial at-center from-transparent via-black/20 to-black/60"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md border border-white/30 text-white rounded-full px-4 py-1.5 mb-4 shadow-sm animate-fade-in-down">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-semibold tracking-wide">
              {t('heroBadge', 'City of Toronto Official Ferry Operations')}
            </span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md mb-3 leading-tight animate-fade-in-up stagger-1">
            {t('heroTitle', 'Book Your Toronto Ferry')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-blue-100 font-medium max-w-2xl mx-auto mb-8 drop-shadow-sm animate-fade-in-up stagger-2">
            {t('heroSubtitle', 'Compare schedules, check live harbour departures, and book high-speed passes to Toronto Islands in just 3 simple steps.')}
          </p>

          {/* Floating Booking Card */}
          <div className="w-full max-w-5xl mx-auto animate-fade-in-up stagger-3">
            <BookingCard className="shadow-2xl ring-1 ring-white/20" />
          </div>

        </div>
      </section>

      {/* 3. Trusted By Leading Ferry Operators & Transit Partners Strip */}
      <section className="bg-white border-b border-slate-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-widest mb-1">
            {t('trustedOperatorsTitle', 'Trusted by Leading Municipal Ferry Operators & Transit Partners')}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {t('trustedOperatorsSubtitle', 'Safe, comfortable, and accessible Great Lakes ferry travel with certified Canadian transit providers.')}
          </p>

          {/* Partner Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-center opacity-85 hover:opacity-100 transition-opacity">
            
            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="font-extrabold text-sm text-[#004f8b] tracking-wider">TORONTO</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">{isFr ? 'Parcs & Loisirs' : 'Parks & Rec'}</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="font-extrabold text-sm text-red-600 tracking-wider">TTC</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">{isFr ? 'Liaison Réseau' : 'Transit Link'}</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="font-extrabold text-sm text-cyan-700 tracking-wider">PORTS</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">PortsToronto</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="font-extrabold text-sm text-emerald-700 tracking-wider">WATERFRONT</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">{isFr ? 'Revitalisation' : 'Revitalization'}</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="font-extrabold text-sm text-green-800 tracking-wider">PARKS CAN</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">{isFr ? 'Parcs Canada' : 'Heritage Canada'}</div>
            </div>

            <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xs transition-all">
              <div className="font-extrabold text-sm text-purple-700 tracking-wider">PRESTO</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">{isFr ? 'Passe sans contact' : 'Card Tap Ready'}</div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Key Performance Stats Counters */}
      <section className="bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            
            {/* Stat 1 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 text-center card-interactive">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-50 text-[#004f8b] flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">60k+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {t('statMonthlyPasses', 'Monthly Digital Passes')}
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 text-center card-interactive">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
                <span>5.0</span>
                <span className="text-amber-400 text-lg">★★★★★</span>
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {t('statScenicRating', 'Scenic Harbourfront Rating')}
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 text-center card-interactive">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">185+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {t('statSafeNavigation', 'Years Safe Navigation (1833)')}
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 text-center card-interactive">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">1.4M+</div>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {t('statAnnualPassengers', 'Annual Passengers Served')}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Live Harbour Marine & Route Departure Tracker */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#004f8b] mb-1">
              <Waves className="w-4 h-4 text-cyan-600" />
              <span>{t('realtimeFleetTitle', 'Real-Time Fleet & Terminal Status')}</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {t('liveDeparturesJackLayton', 'Live Departures from Jack Layton Terminal')}
            </h2>
          </div>
          <button
            onClick={() => navigateTo('schedules')}
            className="mt-4 md:mt-0 text-xs md:text-sm font-bold text-[#004f8b] hover:text-blue-800 flex items-center gap-1 group cursor-pointer"
          >
            <span>{t('viewFullTimetable', 'View Full Timetable & Live Radar')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Live Harbour Radar Operations Centrepiece */}
        <HarbourRadarVisual className="mb-8 animate-fade-in-up" />

        {/* Dynamic Departure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {schedules.slice(0, 3).map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 card-interactive flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.gate ? item.gate.replace('Gate', isFr ? 'Porte' : 'Gate') : ''}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                    item.status === 'Boarding' 
                      ? 'bg-amber-100 text-amber-800 animate-pulse' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {locStatus(item.status)}
                  </span>
                </div>

                <div className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#004f8b] transition-colors">
                  {locTerminal(item.to)}
                </div>
                <div className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                  <span>{t('from', 'From')}:</span> <strong>{locTerminal('Jack Layton Terminal')}</strong>
                </div>

                {/* Capacity Meter */}
                <div className="bg-slate-100 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">{t('passengerLoad', 'Passenger Load')}</span>
                    <span className="font-bold text-slate-800">{Math.round((item.capacityBooked / item.capacityTotal) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (item.capacityBooked / item.capacityTotal) > 0.8 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${(item.capacityBooked / item.capacityTotal) * 100}%` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1.5 flex items-center justify-between">
                    <span>{item.vessel}</span>
                    <span>{item.capacityTotal - item.capacityBooked} {t('seatsAvailable', 'seats available')}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">{t('scheduledDeparture', 'Scheduled Departure')}</div>
                  <div className="text-base font-black text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>{item.departureTime}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('booking', { to: item.to })}
                  className="px-4 py-2 rounded-lg bg-blue-50 text-[#004f8b] hover:bg-[#004f8b] hover:text-white font-bold text-xs transition-colors flex items-center gap-1 btn-interactive cursor-pointer"
                >
                  <span>{t('bookAction', 'Book')}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Popular Island Destinations & Nature Guide Preview */}
      <section className="bg-slate-50 py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#004f8b] uppercase tracking-wider">
              {t('exploreTorontoIslandPark', 'Explore Toronto Island Park')}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-3">
              {t('discover600Acres', 'Discover 600 Acres of Waterfront Parks, Beaches & Trails')}
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              {t('discover600AcresDesc', 'Only a 12-minute scenic voyage from downtown Toronto. Experience pedestrian-friendly tranquility with car-free roads, sandy beaches, historic landmarks, and world-class amusement.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Centre Island */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 card-interactive group flex flex-col">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src="/images/centre-island.jpg" 
                  alt="Centre Island Park & Attractions" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {isFr ? 'Famille et divertissements' : 'Family & Amusements'}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                  {isFr ? '13 min de traversée' : '13 min crossing'}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004f8b] transition-colors mb-1">
                    {t('centreIslandTitle', 'Centre Island Park & Pier')}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {t('centreIslandDesc', "Home to Centreville Amusement Park, Far Enough Farm, Franklin Children's Garden, swan pedal boats, and wide picnic grounds.")}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('parks-trails')}
                  className="text-xs font-bold text-[#004f8b] hover:text-blue-800 flex items-center gap-1 mt-2 btn-interactive cursor-pointer"
                >
                  <span>{t('exploreCentreIsland', 'Explore Centre Island Attractions')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Hanlan's Point */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 card-interactive group flex flex-col">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src="/images/hanlan-beach.jpg" 
                  alt="Hanlan's Point Beach & Lighthouse" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {isFr ? 'Plages et couchers de soleil' : 'Beaches & Sunsets'}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                  {isFr ? '11 min de traversée' : '11 min crossing'}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004f8b] transition-colors mb-1">
                    {t('hanlanPointTitle', "Hanlan's Point & Lighthouse")}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {t('hanlanPointDesc', 'Pristine sandy beach dunes, historic 1808 Gibraltar Point Lighthouse, softball diamonds, and sunset views over Lake Ontario.')}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('parks-trails')}
                  className="text-xs font-bold text-[#004f8b] hover:text-blue-800 flex items-center gap-1 mt-2 btn-interactive cursor-pointer"
                >
                  <span>{t('exploreHanlanPoint', "Explore Hanlan's Point Guide")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Ward's Island */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 card-interactive group flex flex-col">
              <div className="h-52 overflow-hidden relative">
                <img 
                  src="/images/hero-ferry.jpg" 
                  alt="Ward's Island Heritage Cottages & Boardwalk" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {isFr ? 'Patrimoine et promenade' : 'Heritage & Boardwalk'}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                  {isFr ? '15 min de traversée' : '15 min crossing'}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-[#004f8b] transition-colors mb-1">
                    {t('wardIslandTitle', "Ward's Island & Riviera Cafe")}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {t('wardIslandDesc', 'Picturesque 1920s English cottage community, serene Ward’s beach, tree-shaded gardens, and waterfront patio dining.')}
                  </p>
                </div>
                <button
                  onClick={() => navigateTo('parks-trails')}
                  className="text-xs font-bold text-[#004f8b] hover:text-blue-800 flex items-center gap-1 mt-2 btn-interactive cursor-pointer"
                >
                  <span>{t('exploreWardIsland', "Explore Ward's Community Guide")}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Community Services & Island Facilities Directory */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#004f8b] uppercase tracking-wider">
            {t('divisionName', 'Parks, Forestry & Recreation')}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1 mb-2">
            {t('communityServicesTitle', 'Toronto Island Community & Visitor Services')}
          </h2>
          <p className="text-xs md:text-sm text-slate-600">
            {t('communityServicesDesc', 'Official municipal programs, facility booking permits, regatta calendars, and 24/7 passenger assistance.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Recreation Programs */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-interactive flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#004f8b] flex items-center justify-center font-bold mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{t('navPrograms', 'Recreation Programs')}</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {t('recreationCardDesc', 'Youth sailing academies, SUP paddle sessions, sunrise yoga, and guided ecology trails.')}
              </p>
            </div>
            <button
              onClick={() => navigateTo('programs')}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-[#004f8b] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>{t('explorePrograms', 'Explore Programs')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Permits & Bookings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-interactive flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{t('navPermits', 'Permits & Applications')}</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {t('permitsCardDesc', 'Designated picnic site reservations, beach fire pit permits, wedding ceremonies, and photo permits.')}
              </p>
            </div>
            <button
              onClick={() => navigateTo('permits')}
              className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 btn-interactive cursor-pointer"
            >
              <span>{t('bookAPermit', 'Book a Permit')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Events & News */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-interactive flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold mb-3">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{t('navEventsNews', 'Events & News')}</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {t('eventsCardDesc', 'Annual regattas, Toronto Symphony concerts, heritage blessing of the fleet, and electric ferry news.')}
              </p>
            </div>
            <button
              onClick={() => navigateTo('events-news')}
              className="w-full py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 btn-interactive cursor-pointer"
            >
              <span>{t('viewEvents', 'View Events')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Support & 311 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm card-interactive flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">{t('contactAnd311', 'Contact & 311 Support')}</h3>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                {t('supportCardDesc', 'Terminal dispatch office, lost and found inquiries, marine safety VHF channels, and online contact.')}
              </p>
            </div>
            <button
              onClick={() => navigateTo('contact')}
              className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1 btn-interactive cursor-pointer"
            >
              <span>{t('contactStaff', 'Contact Staff')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. Official Toronto City Fares & Instant Pass Feature */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-tr from-[#002d54] to-[#004f8b] rounded-3xl p-6 md:p-10 text-white shadow-xl relative overflow-hidden card-interactive">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full">
              {t('fareRatesTitle', 'City of Toronto Municipal Fare Rates (2026)')}
            </span>
            <h2 className="text-2xl md:text-4xl font-black mt-3 mb-2 tracking-tight">
              {t('oneTicketIncludesBoth', 'One Ticket Includes Both Outbound & Return Trip')}
            </h2>
            <p className="text-blue-100 text-xs md:text-sm mb-6 leading-relaxed">
              {t('fareRatesDesc', 'Ferry tickets purchased for travel to Toronto Island include your return voyage back to Jack Layton Ferry Terminal at no additional charge. Tickets are valid for any scheduled sailing on your selected day.')}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/15 card-interactive">
                <div className="text-[11px] text-blue-200">{t('adultAgeRange', 'Adult (20–64)')}</div>
                <div className="text-xl font-black text-amber-300">$9.11</div>
                <div className="text-[10px] text-blue-300">{t('roundTripIncluded', 'Round trip included')}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/15 card-interactive">
                <div className="text-[11px] text-blue-200">{t('seniorAgeRange', 'Senior (65+)')}</div>
                <div className="text-xl font-black text-amber-300">$5.86</div>
                <div className="text-[10px] text-blue-300">{t('roundTripIncluded', 'Round trip included')}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/15 card-interactive">
                <div className="text-[11px] text-blue-200">{t('juniorAgeRange', 'Junior (2–14)')}</div>
                <div className="text-xl font-black text-amber-300">$4.29</div>
                <div className="text-[10px] text-blue-300">{t('roundTripIncluded', 'Round trip included')}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm border border-white/15 card-interactive">
                <div className="text-[11px] text-blue-200">{t('bicycleStroller', 'Bicycle / Stroller')}</div>
                <div className="text-xl font-black text-emerald-300">{t('free', 'FREE')}</div>
                <div className="text-[10px] text-blue-300">{t('noExtraFee', 'No extra fee')}</div>
              </div>
            </div>

            <button
              onClick={() => navigateTo('booking')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-6 py-3 rounded-full text-sm shadow-md transition-all flex items-center gap-2 btn-interactive cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>{t('purchasePassesOnlineNow', 'Purchase Passes Online Now')}</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
