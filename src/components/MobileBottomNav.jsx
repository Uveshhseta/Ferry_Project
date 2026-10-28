import React from 'react';
import { useApp } from '../context/AppContext';
import { Compass, Clock, Ticket, MapPin, User, Settings } from 'lucide-react';

export default function MobileBottomNav() {
  const { activePage, navigateTo, language, t } = useApp();

  const isFr = language === 'FR';

  const items = [
    { id: 'home', label: t('navHome', 'Home'), icon: Compass },
    { id: 'schedules', label: isFr ? 'Horaires' : 'Schedules', icon: Clock },
    { id: 'booking', label: isFr ? 'Passes' : 'Book', icon: Ticket, isPrimary: true },
    { id: 'routes-map', label: isFr ? 'Carte' : 'Map', icon: MapPin },
    { id: 'dashboard', label: isFr ? 'Compte' : 'Passes', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;

        if (item.isPrimary) {
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className="relative -top-3 flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-lg group-active:scale-95 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-orange-600 mt-0.5">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => navigateTo(item.id)}
            className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              isActive ? 'text-[#004f8b] font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-[#004f8b]' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
