import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TERMINALS } from '../data/ferryData';
import { 
  ArrowLeftRight, 
  Calendar, 
  MapPin, 
  Search, 
  Plus, 
  Minus, 
  Clock, 
  Check, 
  Info,
  ChevronDown
} from 'lucide-react';

export default function BookingCard({ className = '' }) {
  const { navigateTo, prefilledBooking, t, language, locTerminal } = useApp();

  const [tripType, setTripType] = useState('single'); // 'single' | 'multiple' (round)
  const [fromTerminal, setFromTerminal] = useState('Jack Layton Ferry Terminal');
  const [toTerminal, setToTerminal] = useState('Centre Island');
  const [departureDate, setDepartureDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(1);
  const [seniors, setSeniors] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = () => {
    setIsSwapping(true);
    const temp = fromTerminal;
    setFromTerminal(toTerminal);
    setToTerminal(temp);
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigateTo('booking', {
      tripType,
      from: fromTerminal,
      to: toTerminal,
      date: departureDate,
      adults,
      children,
      seniors
    });
  };

  const handleAddReturnTrip = () => {
    setTripType('multiple');
    navigateTo('booking', {
      tripType: 'round',
      from: fromTerminal,
      to: toTerminal,
      date: departureDate,
      adults,
      children,
      seniors
    });
  };

  return (
    <div className={`bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 border border-white/60 card-interactive ${className}`}>
      
      {/* 1. Trip Mode Radio Buttons */}
      <div className="flex items-center space-x-6 mb-4 md:mb-5">
        <label className="flex items-center space-x-2 cursor-pointer group pill-interactive">
          <input
            type="radio"
            name="tripMode"
            value="single"
            checked={tripType === 'single'}
            onChange={() => setTripType('single')}
            className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-offset-0 cursor-pointer accent-orange-500"
          />
          <span className={`text-xs md:text-sm font-semibold transition-colors ${tripType === 'single' ? 'text-orange-600 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
            {t('singleTrip', 'Single Trip')}
          </span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer group pill-interactive">
          <input
            type="radio"
            name="tripMode"
            value="multiple"
            checked={tripType === 'multiple'}
            onChange={() => setTripType('multiple')}
            className="w-4 h-4 text-orange-500 focus:ring-orange-400 focus:ring-offset-0 cursor-pointer accent-orange-500"
          />
          <span className={`text-xs md:text-sm font-semibold transition-colors ${tripType === 'multiple' ? 'text-orange-600 font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
            {t('roundTrip', 'Round Trip / Multiple Trips')}
          </span>
        </label>
      </div>

      {/* 2. Main Booking Input Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 border border-slate-200 rounded-xl md:rounded-2xl divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white shadow-xs overflow-hidden">
        
        {/* FROM Terminal */}
        <div className="md:col-span-3 p-3 md:p-4 hover:bg-slate-50/70 transition-colors min-w-0">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t('from', 'From')}</span>
          </div>
          <select
            value={fromTerminal}
            onChange={(e) => setFromTerminal(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-800 text-xs md:text-sm focus:outline-none cursor-pointer truncate"
          >
            <option value="Jack Layton Ferry Terminal">{locTerminal('Jack Layton Terminal (Mainland)')}</option>
            <option value="Centre Island">{locTerminal('Centre Island')}</option>
            <option value="Hanlan's Point">{locTerminal("Hanlan's Point")}</option>
            <option value="Ward's Island">{locTerminal("Ward's Island")}</option>
          </select>
        </div>

        {/* SWAP Icon Button */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center p-2 bg-slate-50/50 shrink-0">
          <button
            type="button"
            onClick={handleSwap}
            className={`w-9 h-9 rounded-full border border-slate-200 bg-white hover:bg-orange-50 hover:border-orange-300 text-slate-600 hover:text-orange-500 flex items-center justify-center shadow-xs transition-transform duration-300 btn-interactive cursor-pointer ${isSwapping ? 'rotate-180 scale-110' : ''}`}
            title="Swap Origin & Destination"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* TO Terminal */}
        <div className="md:col-span-3 p-3 md:p-4 hover:bg-slate-50/70 transition-colors min-w-0">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
            <span>{t('to', 'Destination')}</span>
          </div>
          <select
            value={toTerminal}
            onChange={(e) => setToTerminal(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-800 text-xs md:text-sm focus:outline-none cursor-pointer truncate"
          >
            <option value="Centre Island">{locTerminal('Centre Island')}</option>
            <option value="Hanlan's Point">{locTerminal("Hanlan's Point")}</option>
            <option value="Ward's Island">{locTerminal("Ward's Island")}</option>
            <option value="Jack Layton Ferry Terminal">{locTerminal('Jack Layton Terminal (Mainland)')}</option>
          </select>
        </div>

        {/* DEPARTURE DATE */}
        <div className="md:col-span-2 p-3 md:p-4 hover:bg-slate-50/70 transition-colors relative min-w-0">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{t('departureDate', 'Departure Date')}</span>
          </div>
          <input
            type="date"
            value={departureDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDepartureDate(e.target.value)}
            className="w-full bg-transparent font-bold text-slate-800 text-xs md:text-sm focus:outline-none cursor-pointer"
          />
        </div>

        {/* PASSENGERS (Adult & Child) */}
        <div className="md:col-span-3 p-3 md:p-4 flex items-center justify-around gap-2 hover:bg-slate-50/70">
          {/* ADULT COUNTER */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[11px] font-bold text-slate-700 leading-tight">
              {t('adults', 'Adult')} <span className="text-[10px] text-slate-400 font-normal">(20–64)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-all btn-interactive cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-4 text-center font-bold text-slate-800 text-xs md:text-sm">{adults}</span>
              <button
                type="button"
                onClick={() => setAdults(Math.min(15, adults + 1))}
                className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center text-xs font-bold transition-all btn-interactive cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

          {/* CHILD COUNTER */}
          <div className="flex flex-col items-center gap-1">
            <div className="text-[11px] font-bold text-slate-700 leading-tight">
              {t('children', 'Children')} <span className="text-[10px] text-slate-400 font-normal">(2–14)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold transition-all btn-interactive cursor-pointer"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-4 text-center font-bold text-slate-800 text-xs md:text-sm">{children}</span>
              <button
                type="button"
                onClick={() => setChildren(Math.min(10, children + 1))}
                className="w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center text-xs font-bold transition-all btn-interactive cursor-pointer"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="mt-4 md:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Search Ferry Button */}
        <button
          type="button"
          onClick={handleSearch}
          className="w-full sm:w-auto px-8 md:px-10 py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm md:text-base shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 btn-interactive cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>{t('searchFerries', 'Search Ferries & Book Pass')}</span>
        </button>

        {/* Outline Add Trip Button */}
        <button
          type="button"
          onClick={handleAddReturnTrip}
          className="w-full sm:w-auto px-6 md:px-8 py-3 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm md:text-base shadow-xs transition-all flex items-center justify-center gap-2 btn-interactive cursor-pointer"
        >
          <Plus className="w-4 h-4 text-slate-500" />
          <span>{t('addReturnTrip', '+ Add Return Trip (+Round Trip)')}</span>
        </button>
      </div>

      {/* Quick notice: Instant digital QR tickets included */}
      <div className="mt-3 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>
          {language === 'FR' 
            ? 'Passe mobile instantanée générée avec code QR scannable • Tous les tarifs sont en CAD$'
            : 'Instant mobile boarding pass generated with scannable QR Code • All fares in CAD$'
          }
        </span>
      </div>
    </div>
  );
}
