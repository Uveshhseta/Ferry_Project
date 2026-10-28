import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Waves, 
  Wind, 
  Anchor, 
  ChevronRight, 
  ArrowRight
} from 'lucide-react';

export default function HarbourRadarVisual({ className = '' }) {
  const { navigateTo, language, locTerminal } = useApp();
  const isFr = language === 'FR';

  const [selectedDockId, setSelectedDockId] = useState('centre'); // 'hanlans' | 'centre' | 'wards'

  const docks = [
    {
      id: 'hanlans',
      name: "Hanlan's Point",
      shortName: "Hanlan's",
      vessel: 'MV Thomas Rennie',
      color: '#f59e0b',
      distance: '1.8 km',
      crossingTime: '11 min',
      gate: 'Gate 1',
      nextDeparture: '16:00',
      x: 18,
      y: 78,
      description: isFr ? 'Plages de sable, dunes et phare historique de Gibraltar Point.' : 'Sandy beaches, dunes, and historic 1808 Gibraltar Point Lighthouse.'
    },
    {
      id: 'centre',
      name: 'Centre Island',
      shortName: 'Centre Island',
      vessel: 'MV Sam McBride',
      color: '#0077c8',
      distance: '2.1 km',
      crossingTime: '13 min',
      gate: 'Gate 2',
      nextDeparture: '15:45',
      x: 50,
      y: 84,
      description: isFr ? 'Parc Centreville, jardins pour enfants, quai et location de vélos.' : 'Centreville amusement, children’s gardens, pier, and bicycle rentals.'
    },
    {
      id: 'wards',
      name: "Ward's Island",
      shortName: "Ward's",
      vessel: 'MV William Inglis',
      color: '#10b981',
      distance: '2.5 km',
      crossingTime: '15 min',
      gate: 'Gate 3',
      nextDeparture: '16:15',
      x: 82,
      y: 76,
      description: isFr ? 'Promenade en bois, communauté de chalets patrimoniaux des années 1920.' : 'Scenic waterfront boardwalk, 1920s cottage community, and Riviera Cafe.'
    }
  ];

  const currentDock = docks.find(d => d.id === selectedDockId) || docks[1];

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#01162d] via-[#022345] to-[#011425] text-white border border-cyan-500/20 shadow-2xl ${className}`}>
      
      {/* 1. Radar Header & Marine Telemetry HUD */}
      <div className="px-5 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 bg-white/5 backdrop-blur-md">
        
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span className="absolute w-6 h-6 rounded-full bg-cyan-400/40 sonar-beacon-ring"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-wider uppercase text-cyan-300">
                {isFr ? 'Surveillance radar du port de Toronto' : 'Toronto Harbour Radar & Navigation Channels'}
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                {isFr ? 'Simulation en temps réel' : 'Live Simulation Visual'}
              </span>
            </div>
            <div className="text-[11px] text-blue-200/80">
              {isFr ? 'Positionnement simulé des traversiers selon les horaires municipaux officiels' : 'Continuous animated transit lanes calibrated to official departure timetables'}
            </div>
          </div>
        </div>

        {/* Real-time Environmental Telemetry */}
        <div className="flex items-center space-x-4 text-[11px] text-blue-200/90 font-mono">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            <Wind className="w-3.5 h-3.5 text-cyan-400" />
            <span>9 kts SSW</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            <Waves className="w-3.5 h-3.5 text-blue-400" />
            <span>0.2m {isFr ? 'Calme' : 'Calm'}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
            <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '24s' }} />
            <span>Lake Ontario 18°C</span>
          </div>
        </div>

      </div>

      {/* 2. Visual Interactive Harbour Map Canvas */}
      <div className="relative p-4 sm:p-6 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between nautical-grid-dark">
        
        {/* Mainland Terminal Indicator (North / Top) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-slate-900/90 border border-cyan-400/40 text-cyan-200 px-4 py-2 rounded-2xl shadow-lg backdrop-blur-md flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                {isFr ? 'Gare continentale principale' : 'Mainland Departure Hub'}
              </div>
              <div className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                <span>{locTerminal('Jack Layton Ferry Terminal')}</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  Slips 1–4
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SVG Transit Lines & Moving Vessels */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            
            {/* Soft Harbour Depth Contours (Decorative Bathymetry) */}
            <path
              d="M 0 50 Q 50 40, 100 50"
              fill="none"
              stroke="rgba(0, 119, 200, 0.08)"
              strokeWidth="1.5"
            />
            <path
              d="M 0 65 Q 50 55, 100 65"
              fill="none"
              stroke="rgba(0, 119, 200, 0.08)"
              strokeWidth="1.5"
            />

            {/* Route 1: Jack Layton (50, 15) to Hanlan's (18, 78) */}
            <path
              d="M 50 16 Q 30 45, 18 78"
              fill="none"
              stroke={selectedDockId === 'hanlans' ? '#f59e0b' : 'rgba(245, 158, 11, 0.35)'}
              strokeWidth={selectedDockId === 'hanlans' ? '0.8' : '0.5'}
              className="route-flow-line"
            />

            {/* Route 2: Jack Layton (50, 16) to Centre Island (50, 84) */}
            <path
              d="M 50 16 L 50 84"
              fill="none"
              stroke={selectedDockId === 'centre' ? '#38bdf8' : 'rgba(56, 189, 248, 0.35)'}
              strokeWidth={selectedDockId === 'centre' ? '0.8' : '0.5'}
              className="route-flow-line"
            />

            {/* Route 3: Jack Layton (50, 16) to Ward's Island (82, 76) */}
            <path
              d="M 50 16 Q 70 45, 82 76"
              fill="none"
              stroke={selectedDockId === 'wards' ? '#10b981' : 'rgba(16, 185, 129, 0.35)'}
              strokeWidth={selectedDockId === 'wards' ? '0.8' : '0.5'}
              className="route-flow-line"
            />

            {/* Animated Vessel 1 (Hanlan's Channel) */}
            <g className="animate-vessel-float">
              <circle cx="34" cy="46" r="1.5" fill="#f59e0b" />
              <circle cx="34" cy="46" r="3" fill="#f59e0b" opacity="0.3" className="sonar-beacon-ring" />
            </g>

            {/* Animated Vessel 2 (Centre Island Channel) */}
            <g className="animate-vessel-float" style={{ animationDelay: '1.2s' }}>
              <circle cx="50" cy="52" r="1.8" fill="#38bdf8" />
              <circle cx="50" cy="52" r="3.6" fill="#38bdf8" opacity="0.3" className="sonar-beacon-ring" />
            </g>

            {/* Animated Vessel 3 (Ward's Channel) */}
            <g className="animate-vessel-float" style={{ animationDelay: '2.4s' }}>
              <circle cx="66" cy="45" r="1.5" fill="#10b981" />
              <circle cx="66" cy="45" r="3" fill="#10b981" opacity="0.3" className="sonar-beacon-ring" />
            </g>

          </svg>
        </div>

        {/* Mid-Water Live Vessel Tags (Interactive HUD) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3 my-auto pointer-events-auto py-6">
          {docks.map((dock) => {
            const isSelected = selectedDockId === dock.id;
            return (
              <div
                key={dock.id}
                onClick={() => setSelectedDockId(dock.id)}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all border backdrop-blur-md ${
                  isSelected
                    ? 'bg-slate-900/90 border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.25)] scale-[1.02]'
                    : 'bg-slate-900/50 border-white/10 hover:bg-slate-900/75 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: dock.color }}
                    ></span>
                    <span className="text-xs font-black text-white">{dock.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold bg-white/10 px-1.5 py-0.5 rounded">
                    ~{dock.crossingTime}
                  </span>
                </div>

                <div className="text-[11px] text-blue-200/90 flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1">
                    <Anchor className="w-3 h-3 text-cyan-400" />
                    <span>{dock.vessel}</span>
                  </span>
                  <span className="text-[10px] text-slate-400">{dock.distance}</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    {isFr ? 'Prochain départ' : 'Next Sailing'}: <strong className="text-amber-300">{dock.nextDeparture}</strong>
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateTo('booking', { to: dock.name });
                    }}
                    className="text-cyan-300 hover:text-white font-bold text-[11px] flex items-center gap-0.5 group cursor-pointer"
                  >
                    <span>{isFr ? 'Réserver' : 'Book'}</span>
                    <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Island Terminals (South / Bottom) */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 bg-slate-950/60 rounded-2xl p-3 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-semibold">{isFr ? 'Destination active :' : 'Active Channel:'}</span>
            <span className="font-extrabold text-white text-sm" style={{ color: currentDock.color }}>
              {currentDock.name}
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              ({currentDock.description})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateTo('routes-map')}
              className="text-xs text-blue-200 hover:text-white font-bold px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isFr ? 'Carte interactive complète' : 'Full Route Map'}</span>
            </button>
            <button
              onClick={() => navigateTo('booking', { to: currentDock.name })}
              className="text-xs bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-4 py-1.5 rounded-lg shadow-md transition-all flex items-center gap-1.5 btn-interactive cursor-pointer"
            >
              <span>{isFr ? 'Réserver ce trajet' : 'Book This Route'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
