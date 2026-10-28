import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Menu, 
  X, 
  Compass, 
  Clock, 
  Ticket, 
  MapPin, 
  Trees, 
  User, 
  ShieldAlert, 
  Settings, 
  ChevronDown, 
  PhoneCall, 
  ExternalLink,
  Sparkles,
  Eye,
  LogOut,
  LogIn,
  ShieldCheck,
  FileText,
  Calendar
} from 'lucide-react';

export default function Header() {
  const { 
    activePage, 
    navigateTo, 
    increaseFont, 
    decreaseFont, 
    highContrast, 
    toggleHighContrast, 
    language, 
    setLanguage, 
    t,
    locRole,
    alerts,
    searchQuery,
    setSearchQuery,
    setIsSearchOpen,
    currentUser,
    isAuthenticated,
    isAdmin,
    openAuthModal,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [iWantToOpen, setIWantToOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const activeAlertCount = alerts.filter(a => a.active !== false).length;

  const liveBadgeText = language === 'FR' ? 'En direct' : 'Live';

  // Complete list for mobile drawer and search
  const navItems = [
    { id: 'home', label: t('navHome', 'Home'), icon: Compass },
    { id: 'schedules', label: t('navSchedules', 'Ferry Schedules'), icon: Clock, badge: liveBadgeText },
    { id: 'booking', label: t('navBooking', 'Book Tickets'), icon: Ticket, highlight: true },
    { id: 'routes-map', label: t('navRouteMaps', 'Route Maps'), icon: MapPin },
    { id: 'parks-trails', label: t('navParksTrails', 'Parks & Trails'), icon: Trees },
    { id: 'programs', label: t('navPrograms', 'Programs'), icon: Compass },
    { id: 'permits', label: t('navPermits', 'Permits'), icon: FileText },
    { id: 'events-news', label: t('navEventsNews', 'Events & News'), icon: Calendar },
    { id: 'contact', label: t('navContact', 'Contact'), icon: PhoneCall },
    { id: 'dashboard', label: t('navDashboard', 'My Account'), icon: User, requiresAuth: true },
    { id: 'alerts', label: t('navAlerts', 'Alerts'), icon: ShieldAlert, alertBadge: activeAlertCount },
    { id: 'admin', label: t('navAdmin', 'Admin Panel'), icon: Settings, adminBadge: isAdmin ? 'Admin' : 'Ops' }
  ];

  // Primary desktop navigation items (clean, fits without overflow)
  const primaryNavItems = [
    { id: 'home', label: t('navHome', 'Home'), icon: Compass },
    { id: 'schedules', label: t('navSchedules', 'Ferry Schedules'), icon: Clock, badge: liveBadgeText },
    { id: 'booking', label: t('navBooking', 'Book Tickets'), icon: Ticket, highlight: true },
    { id: 'routes-map', label: t('navRouteMaps', 'Route Maps'), icon: MapPin },
    { id: 'parks-trails', label: t('navParksTrails', 'Parks & Trails'), icon: Trees },
    { id: 'alerts', label: t('navAlerts', 'Alerts'), icon: ShieldAlert, alertBadge: activeAlertCount }
  ];

  // Secondary items cleanly grouped in 'More' dropdown
  const secondaryNavItems = [
    { id: 'programs', label: t('navPrograms', 'Programs & Camps'), icon: Compass },
    { id: 'permits', label: t('navPermits', 'Picnic & Event Permits'), icon: FileText },
    { id: 'events-news', label: t('navEventsNews', 'Events & News'), icon: Calendar },
    { id: 'contact', label: t('navContact', 'Contact & 311 Support'), icon: PhoneCall },
    { id: 'dashboard', label: t('navDashboard', 'My Account & Passes'), icon: User, requiresAuth: true },
    { id: 'admin', label: t('navAdmin', 'Operations & Admin'), icon: Settings, adminBadge: isAdmin ? 'Admin' : 'Ops' }
  ];

  const isSecondaryActive = secondaryNavItems.some(item => item.id === activePage);

  const handleNavClick = (pageId) => {
    setMoreMenuOpen(false);
    if (pageId === 'booking' && !isAuthenticated) {
      openAuthModal('login', 'booking');
      setMobileMenuOpen(false);
      return;
    }
    if (pageId === 'dashboard' && !isAuthenticated) {
      openAuthModal('login', 'dashboard');
      setMobileMenuOpen(false);
      return;
    }
    if (pageId === 'admin') {
      navigateTo('admin');
      setMobileMenuOpen(false);
      return;
    }

    navigateTo(pageId);
    setMobileMenuOpen(false);
  };

  const handleBookNowClick = () => {
    if (!isAuthenticated) {
      openAuthModal('login', 'booking');
    } else {
      navigateTo('booking');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setIsSearchOpen(true);
  };

  return (
    <header className="w-full relative z-40 shadow-md">
      {/* 1. Official Toronto City Top Bar */}
      <div className="bg-[#004f8b] text-white text-sm px-4 sm:px-6 lg:px-8 py-2.5 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Toronto City Skyline Logo */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => handleNavClick('home')}>
            <div className="flex items-center space-x-1.5 font-bold tracking-tight text-xl">
              <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
                <path d="M4 21V9l3-2v14H4zm5 0V5l4-2v18H9zm6 0V11l4-2v12h-4zM2 22h20v2H2z" />
              </svg>
              <span className="font-extrabold tracking-wider text-xl uppercase">TORONTO</span>
            </div>
            <div className="hidden sm:block border-l border-blue-400/50 pl-3 py-0.5 text-xs text-blue-100 font-medium leading-tight">
              {t('parksForestryRecreation', 'Parks, Forestry & Recreation')}<br />
              <span className="text-amber-300 font-semibold">{t('islandFerryServices', 'Toronto Island Ferry Services')}</span>
            </div>
          </div>

          {/* Center Search & Accessibility Bar */}
          <div className="flex items-center flex-1 max-w-xl justify-end lg:justify-center gap-2">
            {/* Search Input Button */}
            <form onSubmit={handleSearchSubmit} className="relative hidden md:flex items-center flex-1 max-w-xs cursor-pointer" onClick={() => setIsSearchOpen(true)}>
              <input
                type="text"
                readOnly
                placeholder={t('searchPlaceholder', 'Search schedules, routes, parks, programs, permits...')}
                value={searchQuery}
                className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs rounded-l py-1.5 pl-3 pr-8 focus:outline-none cursor-pointer"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-0 bottom-0 px-2.5 bg-slate-100 text-slate-600 hover:text-blue-900 border-l border-slate-200 transition-colors cursor-pointer"
                title="Search City Services"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Accessibility: Font Scaler A+ / A- */}
            <div className="flex items-center bg-white/10 rounded border border-white/20 text-xs overflow-hidden">
              <button
                onClick={increaseFont}
                title="Increase Text Size"
                className="px-2 py-1 hover:bg-white/20 font-bold transition-colors cursor-pointer"
              >
                A+
              </button>
              <button
                onClick={decreaseFont}
                title="Decrease Text Size"
                className="px-2 py-1 hover:bg-white/20 font-semibold border-l border-white/20 transition-colors cursor-pointer"
              >
                A-
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast Mode"
              className={`p-1.5 rounded text-xs flex items-center gap-1 border transition-colors cursor-pointer ${
                highContrast ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold' : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden lg:inline text-[11px]">{t('contrast', 'Contrast')}</span>
            </button>

            {/* Language Toggle */}
            <div className="text-xs bg-white/10 rounded border border-white/20 px-2 py-1 font-semibold flex items-center space-x-1">
              <button 
                onClick={() => setLanguage('EN')} 
                className={`hover:text-amber-300 cursor-pointer ${language === 'EN' ? 'text-amber-300 underline font-bold' : 'opacity-80'}`}
              >
                EN
              </button>
              <span className="opacity-40">|</span>
              <button 
                onClick={() => setLanguage('FR')} 
                className={`hover:text-amber-300 cursor-pointer ${language === 'FR' ? 'text-amber-300 underline font-bold' : 'opacity-80'}`}
              >
                FR
              </button>
            </div>
          </div>

          {/* Right Action: Golden "I want to..." & Auth Profile / Login */}
          <div className="flex items-center space-x-3">
            {/* "I want to..." Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIWantToOpen(!iWantToOpen)}
                className="bg-[#ffb81c] hover:bg-[#e6a310] text-[#002d54] font-bold px-3 py-1.5 rounded flex items-center gap-1.5 text-xs shadow-sm transition-all btn-interactive cursor-pointer"
              >
                <span>{t('iWantTo', 'I want to...')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${iWantToOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {iWantToOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-xs animate-scale-in origin-top-right"
                  onClick={() => setIWantToOpen(false)}
                >
                  <button 
                    onClick={handleBookNowClick}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Ticket className="w-4 h-4 text-orange-500" />
                    {t('bookPassOnline', 'Book Toronto Ferry Pass Online')}
                  </button>
                  <button 
                    onClick={() => handleNavClick('schedules')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-emerald-600" />
                    {t('checkNextDepartures', 'Check Next Ferry Departures')}
                  </button>
                  <button 
                    onClick={() => handleNavClick('routes-map')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-red-500" />
                    {t('viewRouteMap', 'View Live Harbour Route Map')}
                  </button>
                  <button 
                    onClick={() => handleNavClick('parks-trails')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Trees className="w-4 h-4 text-green-600" />
                    {t('exploreParks', 'Explore Island Parks & Trails')}
                  </button>
                  <button 
                    onClick={() => handleNavClick('programs')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Compass className="w-4 h-4 text-blue-600" />
                    {t('viewPrograms', 'Register for Island Programs')}
                  </button>
                  <button 
                    onClick={() => handleNavClick('permits')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-600" />
                    {t('applyPermit', 'Apply for Park Picnic / Event Permit')}
                  </button>
                  <button 
                    onClick={() => handleNavClick('dashboard')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 font-medium border-t border-slate-100 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-amber-600" />
                    {t('viewSavedPasses', 'View My Saved Digital Passes')}
                  </button>
                  <button 
                    onClick={() => handleNavClick('admin')}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 text-slate-700 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-purple-600" />
                    {t('adminOperationsMenu', 'Harbour Master Operations Console')}
                  </button>
                </div>
              )}
            </div>

            {/* Auth Indicator / Profile Button */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1.5 rounded-xl transition-all text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline font-bold truncate max-w-[100px]">{currentUser.name}</span>
                  {isAdmin && (
                    <span className="bg-purple-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                      {currentUser.role}
                    </span>
                  )}
                  <ChevronDown className="w-3 h-3 text-white/70" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-1.5 w-52 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 text-xs animate-scale-in origin-top-right"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-extrabold text-slate-900 truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-1 inline-block bg-blue-50 text-[#004f8b] font-bold text-[10px] px-2 py-0.5 rounded-full capitalize">
                        {locRole(currentUser.role)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700 font-medium transition-colors"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <span>{t('myTicketsPasses', 'My Tickets & Passes')}</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full text-left px-3 py-2 hover:bg-purple-50 flex items-center gap-2 text-purple-800 font-semibold transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>{t('adminConsole', 'Admin Operations Console')}</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600 font-bold transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>{t('logOut', 'Log Out')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs btn-interactive cursor-pointer"
                  title="Citizen & Passenger Sign In"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{t('passengerSignIn', 'Passenger Sign In')}</span>
                </button>
                <button
                  onClick={() => navigateTo('admin')}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-2.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1.5 btn-interactive cursor-pointer"
                  title="City Operations & Administrative Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden sm:inline">{t('adminPortal', 'Admin Portal')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Toronto Nav Bar */}
      <div className="bg-[#002d54] text-slate-200 text-xs px-4 sm:px-6 lg:px-8 py-1.5 hidden md:block border-b border-blue-900/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('schedules')}>{t('servicesAndSchedules', 'Services & Schedules')}</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('parks-trails')}>{t('islandParksBeaches', 'Island Parks & Beaches')}</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('routes-map')}>{t('harbourRouteMap', 'Harbour Route Map')}</span>
            <span className="hover:text-white cursor-pointer transition-colors" onClick={() => handleNavClick('admin')}>{t('cityOperations', 'City Operations')}</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-blue-200 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t('harbourStatus', 'Harbour Status')}: <strong>{t('openAndClear', 'Open & Clear (Lake Ontario)')}</strong></span>
            </span>
            <span className="text-slate-400 hidden lg:inline">•</span>
            <span className="hidden lg:inline">{t('terminalOffice', 'Jack Layton Terminal')}: <strong>{t('normalHeadway', 'Normal Headway')}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="bg-white text-slate-800 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 sticky top-0 backdrop-blur-md bg-white/95 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => handleNavClick('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#004f8b] to-[#0077c8] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Compass className="w-6 h-6 animate-[spin_12s_linear_infinite]" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-sm sm:text-base md:text-lg text-slate-900 tracking-tight leading-none group-hover:text-[#004f8b] transition-colors flex items-center gap-1.5 whitespace-nowrap">
                <span>{t('torontoIslandFerryUpper', 'TORONTO ISLAND FERRY')}</span>
                <span className="bg-blue-100 text-[#004f8b] text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0">PF&R</span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium tracking-wide hidden sm:block truncate">
                {t('realTimeOperationsPortal', 'Real-Time Operations & Passenger Portal')}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5 font-semibold text-xs tracking-wide">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 transition-all relative shrink-0 cursor-pointer ${
                    isActive 
                      ? 'text-[#004f8b] bg-blue-50/90 font-bold shadow-xs' 
                      : 'text-slate-600 hover:text-[#004f8b] hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 transition-transform duration-300 ${isActive ? 'text-[#004f8b] scale-110' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                  
                  {item.badge && (
                    <span className="bg-emerald-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 shadow-xs">
                      <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                      {item.badge}
                    </span>
                  )}

                  {item.alertBadge > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                      {item.alertBadge}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-[#004f8b] rounded-full shadow-[0_0_8px_rgba(0,79,139,0.7)] animate-fade-in" />
                  )}
                </button>
              );
            })}

            {/* "More Services" Dropdown for Secondary Pages */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`px-2.5 xl:px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all relative shrink-0 cursor-pointer ${
                  isSecondaryActive || moreMenuOpen
                    ? 'text-[#004f8b] bg-blue-50 font-bold shadow-xs' 
                    : 'text-slate-600 hover:text-[#004f8b] hover:bg-slate-50'
                }`}
              >
                <span>{t('navMore', 'More')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreMenuOpen ? 'rotate-180' : ''}`} />
                {isSecondaryActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004f8b]"></span>
                )}
              </button>

              {/* Dropdown Menu */}
              {moreMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-scale-in origin-top-right text-xs"
                  onClick={() => setMoreMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    {t('cityAndIslandServices', 'City & Island Services')}
                  </div>
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.id)}
                        className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-blue-50 text-[#004f8b] font-bold' 
                            : 'text-slate-700 hover:bg-slate-50 hover:text-[#004f8b]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#004f8b]' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.adminBadge && (
                          <span className="bg-purple-100 text-purple-700 text-[9px] font-extrabold px-1.5 py-0.2 rounded shrink-0">
                            {item.adminBadge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Action: Book Ferry Now Button */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleBookNowClick}
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs md:text-sm px-4 md:px-5 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all flex items-center gap-2 btn-interactive cursor-pointer whitespace-nowrap"
            >
              <Ticket className="w-4 h-4 shrink-0" />
              <span>{t('bookFerryNow', 'Book Ferry Now')}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors shrink-0 btn-interactive cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 shadow-xl animate-fade-in-down">
          {isAuthenticated && (
            <div className="p-3 mb-3 bg-blue-50 rounded-2xl flex items-center justify-between border border-blue-100">
              <div>
                <div className="font-extrabold text-xs text-slate-900">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500">{currentUser.email}</div>
              </div>
              <button
                onClick={logout}
                className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>{t('logOut', 'Log Out')}</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`p-3 rounded-xl flex items-center space-x-2 text-left text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-[#004f8b] border border-blue-200 font-bold' 
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#004f8b]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#004f8b]" />
              <span>{t('helpline247', 'Toronto 311: 24/7 Helpline')}</span>
            </div>
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); openAuthModal('login'); }}
                  className="text-orange-600 font-bold hover:underline"
                >
                  {t('passengerSignIn', 'Passenger Sign In')}
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => { setMobileMenuOpen(false); navigateTo('admin'); }}
                  className="text-[#004f8b] font-bold hover:underline"
                >
                  {t('adminPortal', 'Admin Portal')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}
