import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, setStoredToken } from '../services/api';
import { TERMINALS, INITIAL_SCHEDULES, FLEET, INITIAL_ALERTS, FARES } from '../data/ferryData';
import { 
  getTranslation, 
  localizeTerminal, 
  localizeRoute, 
  localizeStatus, 
  localizeTripType, 
  localizePassengerCategory, 
  localizeRole, 
  formatDateLocale, 
  formatCurrencyLocale 
} from '../utils/translations';

const AppContext = createContext();

const VALID_PAGES = [
  'home', 
  'schedules', 
  'booking', 
  'routes-map', 
  'parks-trails', 
  'programs', 
  'permits', 
  'events-news', 
  'contact', 
  'dashboard', 
  'alerts', 
  'admin'
];

export function AppProvider({ children }) {
  // Navigation
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return VALID_PAGES.includes(hash) ? hash : 'home';
  });

  // Global search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Accessibility & Internationalization
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('ferry_language') || 'EN';
    } catch {
      return 'EN';
    }
  });

  const setLanguage = useCallback((lang) => {
    const nextLang = (lang || 'EN').toUpperCase();
    setLanguageState(nextLang);
    try {
      localStorage.setItem('ferry_language', nextLang);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }, []);

  const t = useCallback((key, fallback = '') => {
    return getTranslation(language, key, fallback);
  }, [language]);

  const locTerminal = useCallback((name) => {
    return localizeTerminal(name, language);
  }, [language]);

  const locRoute = useCallback((route) => {
    return localizeRoute(route, language);
  }, [language]);

  const locStatus = useCallback((status) => {
    return localizeStatus(status, language);
  }, [language]);

  const locTripType = useCallback((type) => {
    return localizeTripType(type, language);
  }, [language]);

  const locPassengerType = useCallback((type) => {
    return localizePassengerCategory(type, language);
  }, [language]);

  const locRole = useCallback((role) => {
    return localizeRole(role, language);
  }, [language]);

  const formatDate = useCallback((dateStr, options) => {
    return formatDateLocale(dateStr, language, options);
  }, [language]);

  const formatCurrency = useCallback((amount, curr = 'CAD') => {
    return formatCurrencyLocale(amount, language, curr);
  }, [language]);

  useEffect(() => {
    try {
      document.documentElement.lang = language === 'FR' ? 'fr-CA' : 'en-CA';
    } catch (e) {
      console.warn('Could not set document lang:', e);
    }
  }, [language]);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('ferry_auth_token') || null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, tab: 'login', redirectTo: null });

  // MongoDB Operational State
  const [routes, setRoutes] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [parks, setParks] = useState([]);
  const [pricingSettings, setPricingSettings] = useState(null);
  const [userBookings, setUserBookings] = useState([]);
  const [gateScans, setGateScans] = useState([
    { id: 'SCN-1', passId: 'TO-FRY-98214', time: '15:20', gate: 'Gate 2', status: 'VALID', details: 'Jack Layton ➔ Centre Island' }
  ]);
  const [loadingData, setLoadingData] = useState(true);

  // Booking transfer from Hero search widget
  const [prefilledBooking, setPrefilledBooking] = useState({
    tripType: 'round',
    from: 'Jack Layton Ferry Terminal',
    to: 'Centre Island',
    date: new Date().toISOString().split('T')[0],
    adults: 2,
    children: 1,
    seniors: 0,
    bicycles: 0
  });

  // URL Hash synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (VALID_PAGES.includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page, prefillData = null) => {
    if (prefillData) {
      setPrefilledBooking(prev => ({ ...prev, ...prefillData }));
    }
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Modal Controls
  const openAuthModal = (tab = 'login', redirectTo = null) => {
    setAuthModalConfig({ isOpen: true, tab, redirectTo });
  };

  const closeAuthModal = () => {
    setAuthModalConfig({ isOpen: false, tab: 'login', redirectTo: null });
  };

  const handleLoginSuccess = (user, token) => {
    setCurrentUser(user);
    setAuthToken(token);
    setStoredToken(token);
    loadUserBookings();
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setCurrentUser(null);
    setAuthToken(null);
    setStoredToken(null);
    setUserBookings([]);
    if (activePage === 'dashboard' || activePage === 'admin') {
      navigateTo('home');
    }
  };

  // Fetch Current User on Boot
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('ferry_auth_token');
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.user) {
            setCurrentUser(res.user);
          }
        } catch (e) {
          console.warn('Session expired or invalid, logging out.');
          setStoredToken(null);
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    };
    verifyAuth();
  }, []);

  // Fetch Public Transit Data from MongoDB
  const loadSystemData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [pricingRes, routesRes, schedulesRes, ferriesRes, alertsRes, parksRes] = await Promise.allSettled([
        api.pricing.get(),
        api.routes.getAll(),
        api.schedules.getAll(),
        api.ferries.getAll(),
        api.alerts.getActive(),
        api.parks.getAll()
      ]);

      if (pricingRes.status === 'fulfilled' && pricingRes.value.settings) {
        setPricingSettings(pricingRes.value.settings);
      }
      if (routesRes.status === 'fulfilled' && routesRes.value.routes) {
        setRoutes(routesRes.value.routes);
      }
      if (schedulesRes.status === 'fulfilled' && schedulesRes.value.schedules) {
        setSchedules(schedulesRes.value.schedules);
      }
      if (ferriesRes.status === 'fulfilled' && ferriesRes.value.ferries) {
        setFleet(ferriesRes.value.ferries);
      }
      if (alertsRes.status === 'fulfilled' && alertsRes.value.alerts) {
        setAlerts(alertsRes.value.alerts);
      }
      if (parksRes.status === 'fulfilled' && parksRes.value.parks) {
        setParks(parksRes.value.parks);
      }
    } catch (err) {
      console.error('Error loading MongoDB system data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Fetch User Bookings from MongoDB
  const loadUserBookings = useCallback(async () => {
    const token = localStorage.getItem('ferry_auth_token');
    if (!token) return;
    try {
      const res = await api.bookings.getMy();
      if (res.bookings) {
        setUserBookings(res.bookings);
      }
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    }
  }, []);

  useEffect(() => {
    loadSystemData();
  }, [loadSystemData]);

  useEffect(() => {
    if (currentUser) {
      loadUserBookings();
    }
  }, [currentUser, loadUserBookings]);

  // Accessibility: Font Scale
  const increaseFont = () => {
    setFontScale(prev => {
      const next = Math.min(prev + 0.1, 1.3);
      document.documentElement.style.setProperty('--app-font-scale', `${next}rem`);
      return next;
    });
  };

  const decreaseFont = () => {
    setFontScale(prev => {
      const next = Math.max(prev - 0.1, 0.85);
      document.documentElement.style.setProperty('--app-font-scale', `${next}rem`);
      return next;
    });
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => {
      const next = !prev;
      if (next) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      return next;
    });
  };

  // Turnstile QR Scanner
  const scanTicket = async (ticketCode, gate = 'Gate 2') => {
    try {
      const res = await api.tickets.scan(ticketCode, gate);
      if (res.scan) {
        setGateScans(prev => [res.scan, ...prev]);
      }
      return res.scan;
    } catch (err) {
      const failRecord = {
        id: `SCN-${Date.now().toString().slice(-4)}`,
        passId: ticketCode,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        gate,
        status: 'INVALID',
        details: err.message || 'Ticket not found in Transit Registry'
      };
      setGateScans(prev => [failRecord, ...prev]);
      return failRecord;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        navigateTo,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        fontScale,
        increaseFont,
        decreaseFont,
        highContrast,
        toggleHighContrast,
        language,
        setLanguage,
        t,
        locTerminal,
        locRoute,
        locStatus,
        locTripType,
        locPassengerType,
        locRole,
        formatDate,
        formatCurrency,

        // Auth
        currentUser,
        setCurrentUser,
        isAuthenticated: Boolean(currentUser),
        isAdmin: currentUser?.role === 'admin' || currentUser?.role === 'staff',
        authLoading,
        authModalConfig,
        openAuthModal,
        closeAuthModal,
        handleLoginSuccess,
        logout,

        // Data from MongoDB
        routes,
        schedules,
        fleet,
        alerts,
        parks,
        pricingSettings,
        userBookings,
        gateScans,
        loadingData,
        loadSystemData,
        loadUserBookings,
        scanTicket,

        prefilledBooking,
        setPrefilledBooking
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
