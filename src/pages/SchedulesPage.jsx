import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { TERMINALS, FLEET } from '../data/ferryData';
import { 
  Clock, 
  MapPin, 
  Filter, 
  Download, 
  Printer, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Waves, 
  Wind, 
  ShieldCheck, 
  ChevronRight,
  Anchor,
  Users,
  Compass
} from 'lucide-react';

export default function SchedulesPage() {
  const { schedules, fleet, navigateTo, t, locTerminal, locRoute, locStatus, language } = useApp();

  const [selectedRoute, setSelectedRoute] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [countdownSeconds, setCountdownSeconds] = useState(245); // Countdown to next primary sailing
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Live real-time clock and countdown tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setCountdownSeconds(prev => (prev > 1 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // Filtered schedules
  const filteredSchedules = schedules.filter(item => {
    const dest = item.to || item.route?.name || '';
    if (selectedRoute === 'all') return true;
    if (selectedRoute === 'centre') return dest.toLowerCase().includes('centre');
    if (selectedRoute === 'hanlans') return dest.toLowerCase().includes('hanlan');
    if (selectedRoute === 'wards') return dest.toLowerCase().includes('ward');
    return true;
  });

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Header / Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{t('realTimeTransitDashboard')}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t('schedulesTitle')}
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              {t('schedulesSubtitle')}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualRefresh}
              className={`p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-all btn-interactive cursor-pointer ${isRefreshing ? 'rotate-180' : ''}`}
              title={language === 'fr' ? 'Actualiser la télémétrie en direct' : 'Refresh Live Telemetry'}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs flex items-center gap-1.5 btn-interactive cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('printSchedule')}</span>
            </button>
            <button
              onClick={() => navigateTo('booking')}
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 btn-interactive cursor-pointer"
            >
              <span>{t('bookPass')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 1. Real-Time Operations Telemetry Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card 1: Next Primary Departure Countdown */}
          <div className="bg-gradient-to-tr from-[#00203f] via-[#002d54] to-[#004f8b] text-white p-5 rounded-2xl shadow-lg border border-cyan-500/20 relative overflow-hidden flex flex-col justify-between card-interactive">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping"></span>
                {t('boardingActive')}
              </span>
              <span className="text-[11px] text-cyan-200 font-mono bg-white/10 px-2 py-0.5 rounded border border-white/10">
                {currentTime.toLocaleTimeString(language === 'fr' ? 'fr-CA' : 'en-CA')}
              </span>
            </div>

            <div className="my-1">
              <div className="text-[11px] text-blue-200 font-medium tracking-wide uppercase">{t('nextSailing')}:</div>
              <div className="mt-1.5 inline-block bg-slate-950/80 border border-amber-400/40 rounded-xl px-4 py-2 shadow-inner">
                <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-widest flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
                  <span>{formatCountdown(countdownSeconds)}</span>
                </div>
              </div>
              <div className="text-[11px] text-cyan-200 mt-2 flex items-center gap-1.5">
                <Anchor className="w-3.5 h-3.5 text-cyan-400" />
                <span>{locTerminal('Jack Layton Ferry Terminal')} Slip 2 • MV Sam McBride</span>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-blue-200">{language === 'fr' ? "File d'attente au quai :" : 'Terminal Gate Queue:'}</span>
              <span className="font-bold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                {language === 'fr' ? 'attente ~4 min' : '~4 min wait'}
              </span>
            </div>
          </div>

          {/* Card 2: Lake Ontario Marine Conditions */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('harbourAdvisory')}</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">{t('goodCrossing')}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-1">
              <div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Wind className="w-3 h-3 text-cyan-600" />
                  <span>{t('windSpeed')}</span>
                </div>
                <div className="text-lg font-bold text-slate-800">{language === 'fr' ? '9 nœuds SSO' : '9 knots SSW'}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Waves className="w-3 h-3 text-blue-600" />
                  <span>{t('waveSwell')}</span>
                </div>
                <div className="text-lg font-bold text-slate-800">{language === 'fr' ? '0,2 m (Calme)' : '0.2 m (Calm)'}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>{t('waterTemp')}: <strong>18°C</strong></span>
              <span>{t('airTemp')}: <strong>{language === 'fr' ? '22°C Dégagé' : '22°C Clear'}</strong></span>
            </div>
          </div>

          {/* Card 3: Fleet Deployment Status */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('activeVessels')}</span>
              <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full text-[10px] font-bold">{language === 'fr' ? '4 sur 5 en service' : '4 of 5 Running'}</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">MV Sam McBride</span>
                <span className="text-emerald-600 font-bold text-[11px]">{locTerminal('Centre Island')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">MV Thomas Rennie</span>
                <span className="text-emerald-600 font-bold text-[11px]">{locTerminal("Hanlan's Point")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">MV William Inglis</span>
                <span className="text-emerald-600 font-bold text-[11px]">{locTerminal("Ward's Island")}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
              {t('ontimeRate')}: <strong className="text-emerald-600">99.1%</strong>
            </div>
          </div>

          {/* Card 4: Terminal Accessibility & Baggage Notice */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">{t('gateInfo')}</span>
              <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full text-[10px] font-bold">{language === 'fr' ? 'Porte 3 du quai' : 'Port Gate 3'}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {t('gateInfoDesc')}
            </p>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-[#004f8b] font-bold flex items-center justify-between">
              <span>{t('accessibleRamps')}</span>
              <span>{t('allVessels')}</span>
            </div>
          </div>

        </div>

        {/* 2. Route Selector Filter Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{t('routeFilter')}:</span>
            </span>
            <button
              onClick={() => setSelectedRoute('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRoute === 'all' 
                  ? 'bg-[#004f8b] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t('allDestinations')}
            </button>
            <button
              onClick={() => setSelectedRoute('centre')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRoute === 'centre' 
                  ? 'bg-[#004f8b] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {locTerminal('Centre Island')}
            </button>
            <button
              onClick={() => setSelectedRoute('hanlans')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRoute === 'hanlans' 
                  ? 'bg-[#004f8b] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {locTerminal("Hanlan's Point")}
            </button>
            <button
              onClick={() => setSelectedRoute('wards')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedRoute === 'wards' 
                  ? 'bg-[#004f8b] text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {locTerminal("Ward's Island")}
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            {language === 'fr' ? 'Affichage de ' : 'Showing '}<strong>{filteredSchedules.length}</strong>{language === 'fr' ? ' départs actifs' : ' active departures'}
          </div>
        </div>

        {/* 3. Live Timetable Board */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 md:px-6">{t('departureTime')}</th>
                  <th className="py-3.5 px-4">{t('from')}</th>
                  <th className="py-3.5 px-4">{t('destination')}</th>
                  <th className="py-3.5 px-4">{t('assignedVessel')}</th>
                  <th className="py-3.5 px-4">{t('gateSlip')}</th>
                  <th className="py-3.5 px-4">{t('capacityStatus')}</th>
                  <th className="py-3.5 px-4">{t('status')}</th>
                  <th className="py-3.5 px-4 md:px-6 text-right">{t('action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
                {filteredSchedules.map((item) => {
                  const depTime = item.departureTime || item.departure || '15:45';
                  const fromStation = item.from || 'Jack Layton Ferry Terminal';
                  const toStation = item.to || item.route?.name || 'Centre Island';
                  const vesselName = item.vessel || item.ferry?.name || 'MV Sam McBride';
                  const gateSlip = item.gate || 'Gate 2';
                  const capTotal = item.capacityTotal || item.ferry?.capacity || 750;
                  const capBooked = item.capacityBooked !== undefined ? item.capacityBooked : Math.floor(capTotal * 0.45);
                  const percentFilled = Math.min(100, Math.round((capBooked / capTotal) * 100));
                  const statusLabel = item.status || 'On Time';

                  return (
                    <tr key={item._id || item.id} className="hover:bg-blue-50/40 transition-colors">
                      
                      {/* Time */}
                      <td className="py-4 px-4 md:px-6 font-black text-slate-900 flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{depTime}</span>
                      </td>

                      {/* From */}
                      <td className="py-4 px-4 text-slate-700 font-medium">
                        {locTerminal(fromStation)}
                      </td>

                      {/* To */}
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {locTerminal(toStation)}
                      </td>

                      {/* Vessel */}
                      <td className="py-4 px-4 text-slate-600 flex items-center space-x-1.5">
                        <Anchor className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold">{vesselName}</span>
                      </td>

                      {/* Gate */}
                      <td className="py-4 px-4 text-slate-700 font-mono text-xs">
                        <span className="bg-slate-100 px-2 py-1 rounded font-bold">{gateSlip}</span>
                      </td>

                      {/* Capacity */}
                      <td className="py-4 px-4">
                        <div className="w-28">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                            <span>{percentFilled}% {language === 'fr' ? 'plein' : 'full'}</span>
                            <span>{capTotal - capBooked} {language === 'fr' ? 'restants' : 'left'}</span>
                          </div>
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${percentFilled > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                              style={{ width: `${percentFilled}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 w-max ${
                          statusLabel.toLowerCase().includes('board') 
                            ? 'bg-amber-100 text-amber-800 animate-pulse' 
                            : statusLabel.toLowerCase().includes('time') || statusLabel.toLowerCase().includes('sched')
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {locStatus(statusLabel)}
                        </span>
                      </td>

                      {/* Book Action */}
                      <td className="py-4 px-4 md:px-6 text-right">
                        <button
                          onClick={() => navigateTo('booking', { to: toStation, timeSlot: depTime })}
                          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors"
                        >
                          {t('selectTrip')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Detailed Fleet Specifications */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#004f8b] mb-1">
            <Anchor className="w-4 h-4 text-blue-600" />
            <span>{t('activeFleetSection')}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mb-4">
            {t('vesselsInService')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {fleet.map((vessel) => (
              <div 
                key={vessel.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{language === 'fr' ? 'Construit en ' : 'Built '}{vessel.yearBuilt}</span>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {locStatus(vessel.status)}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1">{vessel.name}</h3>
                  <div className="text-xs text-slate-500 mb-3">{vessel.type}</div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl mb-3">
                    <div className="flex justify-between">
                      <span>{t('maxCapacity')}:</span>
                      <strong className="text-slate-800">{vessel.capacity} pass.</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('cruisingSpeed')}:</span>
                      <strong className="text-slate-800">{vessel.speedKnots} kts</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('assignedRoute')}:</span>
                      <strong className="text-[#004f8b]">{locRoute(vessel.assignedRoute)}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span>{t('captain')}: {vessel.captain}</span>
                  <span className="text-emerald-600 font-bold">{t('powerFuel')}: {vessel.batteryFuel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
