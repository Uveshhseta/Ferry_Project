import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  PhoneCall, 
  MapPin, 
  LifeBuoy, 
  ShieldCheck, 
  Clock, 
  ExternalLink, 
  Compass, 
  Mail,
  Anchor,
  HelpCircle
} from 'lucide-react';

export default function Footer() {
  const { navigateTo, t } = useApp();

  return (
    <footer className="bg-[#002d54] text-slate-300 pt-12 pb-24 md:pb-12 border-t-4 border-[#004f8b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Highlight: 311 & Emergency Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8 mb-8 border-b border-blue-900/60">
          
          {/* Card 1: 311 City Support */}
          <div className="bg-[#00386b] p-4 rounded-xl flex items-start space-x-3 border border-blue-800/40 card-interactive cursor-default">
            <div className="p-2.5 bg-amber-400 text-slate-900 rounded-lg font-bold">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t('contact311Title', '311 Toronto Municipal Helpline')}</div>
              <div className="text-xs text-blue-200">{t('contact311Desc', '24/7 service in over 180 languages for ferry inquiries, lost items, and park facilities.')}</div>
              <a href="tel:311" className="text-xs font-bold text-amber-300 hover:underline mt-1 inline-block">
                {t('dial311Number', 'Dial 311 (Within Toronto) or 416-392-CITY')}
              </a>
            </div>
          </div>

          {/* Card 2: Terminal Location */}
          <div className="bg-[#00386b] p-4 rounded-xl flex items-start space-x-3 border border-blue-800/40 card-interactive cursor-default">
            <div className="p-2.5 bg-blue-500 text-white rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t('terminalOffice', 'Jack Layton Ferry Terminal Office')}</div>
              <div className="text-xs text-blue-200">{t('terminalAddress', '9 Queens Quay West, Toronto, ON M5J 2H3 (Foot of Bay Street)')}</div>
              <button 
                onClick={() => navigateTo('routes-map')}
                className="text-xs font-bold text-amber-300 hover:underline mt-1 inline-block cursor-pointer"
              >
                {t('viewRouteMaps', 'View Terminal Map & Transit Directions')}
              </button>
            </div>
          </div>

          {/* Card 3: Marine Safety */}
          <div className="bg-[#00386b] p-4 rounded-xl flex items-start space-x-3 border border-blue-800/40 card-interactive cursor-default">
            <div className="p-2.5 bg-emerald-500 text-white rounded-lg">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t('marineSafetyTitle', 'Harbour Safety & Patrol')}</div>
              <div className="text-xs text-blue-200">{t('marineSafetyDesc', 'Toronto Police Marine Unit & Canadian Coast Guard. VHF Channel 16 or 911 for water emergencies.')}</div>
              <div className="text-xs font-bold text-emerald-300 mt-1">{t('vhfChannel', 'VHF Marine Channel 16 / 12')}</div>
            </div>
          </div>
        </div>

        {/* Middle Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10 text-xs">
          
          {/* Brand & City Notice */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 text-white font-extrabold text-base tracking-tight mb-2">
              <svg className="w-7 h-7 fill-current text-white" viewBox="0 0 24 24">
                <path d="M4 21V9l3-2v14H4zm5 0V5l4-2v18H9zm6 0V11l4-2v12h-4zM2 22h20v2H2z" />
              </svg>
              <span>{t('cityOfToronto', 'CITY OF TORONTO')}</span>
            </div>
            <div className="text-blue-100 font-semibold mb-2">
              {t('divisionName', 'Parks, Forestry & Recreation Division')}
            </div>
            <p className="text-slate-300 leading-relaxed pr-4 text-xs mb-3">
              {t('torontoOperatingDesc', 'Operating year-round ferry transit between downtown Toronto and the Toronto Islands. Providing safe, scenic, and accessible municipal transportation for millions of residents and global travelers every year.')}
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('aodaCompliance', 'AODA & WCAG 2.1 AA Compliant Transit Portal')}</span>
            </div>
          </div>

          {/* Col 1: Ferry Transit */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 text-amber-300">
              {t('navFerry', 'Ferry & Schedules')}
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('schedules')} className="hover:text-white transition-colors cursor-pointer">{t('navSchedules', 'Ferry Schedules')}</button></li>
              <li><button onClick={() => navigateTo('booking')} className="hover:text-white transition-colors cursor-pointer">{t('navBooking', 'Ticket Booking')}</button></li>
              <li><button onClick={() => navigateTo('routes-map')} className="hover:text-white transition-colors cursor-pointer">{t('navRouteMaps', 'Route Maps')}</button></li>
              <li><button onClick={() => navigateTo('alerts')} className="hover:text-white transition-colors cursor-pointer">{t('navAlerts', 'Service Alerts')}</button></li>
            </ul>
          </div>

          {/* Col 2: Island Parks & Activities */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 text-amber-300">
              {t('navParks', 'Parks & Community')}
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('parks-trails')} className="hover:text-white transition-colors cursor-pointer">{t('navParksTrails', 'Parks & Trails')}</button></li>
              <li><button onClick={() => navigateTo('programs')} className="hover:text-white transition-colors cursor-pointer">{t('navPrograms', 'Recreation Programs')}</button></li>
              <li><button onClick={() => navigateTo('permits')} className="hover:text-white transition-colors cursor-pointer">{t('navPermits', 'Permits & Bookings')}</button></li>
              <li><button onClick={() => navigateTo('events-news')} className="hover:text-white transition-colors cursor-pointer">{t('navEventsNews', 'Events & News')}</button></li>
            </ul>
          </div>

          {/* Col 3: Passenger Support & Operations */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 text-amber-300">
              {t('navSupport', 'Support & Admin')}
            </h4>
            <ul className="space-y-2">
              <li><button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors cursor-pointer">{t('navContact', 'Contact & 311 Support')}</button></li>
              <li><button onClick={() => navigateTo('dashboard')} className="hover:text-white transition-colors cursor-pointer">{t('navDashboard', 'My Passes')}</button></li>
              <li><button onClick={() => navigateTo('admin')} className="hover:text-white text-purple-300 font-semibold transition-colors cursor-pointer">{t('navAdmin', 'Harbour Admin Panel')}</button></li>
              <li><a href="https://www.toronto.ca" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">Toronto.ca Main <ExternalLink className="w-3 h-3" /></a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Notice */}
        <div className="pt-6 border-t border-blue-900/80 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-400 gap-3">
          <div>
            © {new Date().getFullYear()} {t('copyrightText', 'City of Toronto. All rights reserved. Parks, Forestry & Recreation.')}
          </div>
          <div className="flex items-center space-x-4">
            <span className="hover:text-white cursor-pointer">{t('accessibilityStatement', 'Accessibility Statement')}</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">{t('privacyPolicy', 'Privacy & Freedom of Information')}</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">{t('termsOfTransportation', 'Terms of Transportation')}</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">{t('cityBylaws', 'City Bylaws')}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
