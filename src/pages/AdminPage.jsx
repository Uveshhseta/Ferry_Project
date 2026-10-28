import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Settings,
  Anchor,
  Clock,
  Users,
  ShieldAlert,
  Plus,
  Radio,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  QrCode,
  CreditCard,
  ArrowRight,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldCheck,
  Lock,
  Mail,
  Search,
  Filter,
  Trash2,
  Edit,
  Eye,
  RotateCcw,
  Sparkles,
  Compass,
  Trees,
  FileText,
  X,
  Check,
  Activity,
  MapPin,
  Phone
} from 'lucide-react';

export default function AdminPage() {
  const {
    currentUser,
    isAuthenticated,
    isAdmin,
    openAuthModal,
    logout,
    pricingSettings,
    loadSystemData,
    t,
    locTerminal,
    locRoute,
    locStatus,
    locRole,
    formatDate,
    formatCurrency,
    language
  } = useApp();

  // Admin Navigation Tabs
  const [activeTab, setActiveTab] = useState('overview');
  // 'overview' | 'users' | 'bookings' | 'schedules' | 'fleet' | 'alerts' | 'parks' | 'pricing' | 'scanner' | 'audit'

  // Admin Direct Login Form State (if not authenticated)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Dashboard Data States from MongoDB
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  const [bookingsList, setBookingsList] = useState([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  const [schedulesList, setSchedulesList] = useState([]);
  const [scheduleRouteFilter, setScheduleRouteFilter] = useState('all');
  const [fleetList, setFleetList] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  const [parksList, setParksList] = useState([]);
  const [parkCategoryFilter, setParkCategoryFilter] = useState('all');
  const [routesList, setRoutesList] = useState([]);
  const [auditLogsList, setAuditLogsList] = useState([]);

  // Modal / Form States
  // 1. Schedules Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [schDeparture, setSchDeparture] = useState('17:30');
  const [schRouteId, setSchRouteId] = useState('');
  const [schFerryId, setSchFerryId] = useState('');
  const [schGate, setSchGate] = useState('Gate 2');
  const [schStatus, setSchStatus] = useState('on-time');
  const [schDelay, setSchDelay] = useState(0);
  const [schPeak, setSchPeak] = useState(false);

  // 2. Fleet Modal State
  const [showVesselModal, setShowVesselModal] = useState(false);
  const [editingVessel, setEditingVessel] = useState(null);
  const [vesName, setVesName] = useState('');
  const [vesCapacity, setVesCapacity] = useState('750');
  const [vesStatus, setVesStatus] = useState('operational');
  const [vesRoute, setVesRoute] = useState('Centre Island');
  const [vesCaptain, setVesCaptain] = useState('Capt. R. Campbell');
  const [vesType, setVesType] = useState('Double-Ended Passenger');
  const [vesYear, setVesYear] = useState('1939');

  // 3. Alerts Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('advisory');
  const [alertRoute, setAlertRoute] = useState('System-Wide');

  // 4. Parks Modal State
  const [showParkModal, setShowParkModal] = useState(false);
  const [editingPark, setEditingPark] = useState(null);
  const [parkName, setParkName] = useState('');
  const [parkCategory, setParkCategory] = useState('Family Attractions');
  const [parkDestination, setParkDestination] = useState('Centre Island');
  const [parkDesc, setParkDesc] = useState('');
  const [parkFeatures, setParkFeatures] = useState('Restrooms, Picnic Tables, Wheelchair Accessible');
  const [parkHours, setParkHours] = useState('Dawn to Dusk');
  const [parkRating, setParkRating] = useState('4.8');
  const [parkDistance, setParkDistance] = useState('5 min walk from Ferry Dock');
  const [parkAccessible, setParkAccessible] = useState(true);

  // 5. Pricing Settings Form
  const [taxLabel, setTaxLabel] = useState('GST');
  const [taxPercent, setTaxPercent] = useState('5.0');
  const [adultFare, setAdultFare] = useState('9.11');
  const [seniorFare, setSeniorFare] = useState('5.86');
  const [youthFare, setYouthFare] = useState('5.86');
  const [juniorFare, setJuniorFare] = useState('4.29');
  const [pricingSuccess, setPricingSuccess] = useState(false);

  // 6. Scanner State
  const [scanCode, setScanCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanLoading, setScanLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [actionError, setActionError] = useState('');

  // Sync Pricing State from global
  useEffect(() => {
    if (pricingSettings) {
      if (pricingSettings.taxLabel) setTaxLabel(pricingSettings.taxLabel);
      if (pricingSettings.taxPercent !== undefined) setTaxPercent(String(pricingSettings.taxPercent));
      if (pricingSettings.fares?.adult?.price) setAdultFare(String(pricingSettings.fares.adult.price));
      if (pricingSettings.fares?.senior?.price) setSeniorFare(String(pricingSettings.fares.senior.price));
      if (pricingSettings.fares?.youth?.price) setYouthFare(String(pricingSettings.fares.youth.price));
      if (pricingSettings.fares?.junior?.price) setJuniorFare(String(pricingSettings.fares.junior.price));
    }
  }, [pricingSettings]);

  // Load Admin Data when authenticated as admin
  const fetchAdminData = async () => {
    if (!isAdmin) return;
    setRefreshing(true);
    setActionError('');
    try {
      const [
        statsRes,
        usersRes,
        bookingsRes,
        schedulesRes,
        fleetRes,
        alertsRes,
        parksRes,
        routesRes,
        logsRes
      ] = await Promise.allSettled([
        api.admin.getStats(),
        api.admin.getUsers({ search: userSearch, role: userRoleFilter }),
        api.admin.getBookings({ search: bookingSearch, status: bookingStatusFilter }),
        api.schedules.getAll(),
        api.ferries.getAll(),
        api.alerts.getAll(),
        api.parks.getAll(),
        api.routes.getAll(),
        api.admin.getAuditLogs()
      ]);

      if (statsRes.status === 'fulfilled') setStats(statsRes.value.stats);
      if (usersRes.status === 'fulfilled') setUsersList(usersRes.value.users || []);
      if (bookingsRes.status === 'fulfilled') setBookingsList(bookingsRes.value.bookings || []);
      if (schedulesRes.status === 'fulfilled') setSchedulesList(schedulesRes.value.schedules || []);
      if (fleetRes.status === 'fulfilled') setFleetList(fleetRes.value.ferries || []);
      if (alertsRes.status === 'fulfilled') setAlertsList(alertsRes.value.alerts || []);
      if (parksRes.status === 'fulfilled') setParksList(parksRes.value.parks || []);
      if (routesRes.status === 'fulfilled') {
        const routes = routesRes.value.routes || [];
        setRoutesList(routes);
        if (routes.length > 0 && !schRouteId) {
          setSchRouteId(routes[0]._id);
        }
      }
      if (logsRes.status === 'fulfilled') setAuditLogsList(logsRes.value.logs || []);
    } catch (err) {
      console.error('Error fetching admin datasets:', err);
      setActionError(err.message || 'Error communicating with MongoDB backend.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, userRoleFilter, bookingStatusFilter]);

  // Re-fetch users when search changes (debounced)
  useEffect(() => {
    if (!isAdmin) return;
    const tId = setTimeout(() => {
      api.admin.getUsers({ search: userSearch, role: userRoleFilter })
        .then(res => setUsersList(res.users || []))
        .catch(console.error);
    }, 300);
    return () => clearTimeout(tId);
  }, [userSearch]);

  // Re-fetch bookings when search changes (debounced)
  useEffect(() => {
    if (!isAdmin) return;
    const tId = setTimeout(() => {
      api.admin.getBookings({ search: bookingSearch, status: bookingStatusFilter })
        .then(res => setBookingsList(res.bookings || []))
        .catch(console.error);
    }, 300);
    return () => clearTimeout(tId);
  }, [bookingSearch]);

  // Handle Admin Direct Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const res = await api.auth.login(loginEmail, loginPassword);
      if (res.user.role !== 'admin' && res.user.role !== 'staff') {
        throw new Error('This account does not have administrator privileges.');
      }
      window.location.reload();
    } catch (err) {
      setLoginError(err.message || 'Administrator login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Show Toast Helper
  const showSuccess = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(''), 4000);
  };

  // ================= CRUD: SCHEDULES =================
  const openNewScheduleModal = () => {
    setEditingSchedule(null);
    setSchDeparture('17:30');
    setSchRouteId(routesList[0]?._id || '');
    setSchFerryId(fleetList[0]?._id || '');
    setSchGate('Gate 2');
    setSchStatus('on-time');
    setSchDelay(0);
    setSchPeak(false);
    setShowScheduleModal(true);
  };

  const openEditScheduleModal = (sch) => {
    setEditingSchedule(sch);
    setSchDeparture(sch.departure || sch.departureTime || '12:00');
    setSchRouteId(sch.route?._id || sch.route || routesList[0]?._id || '');
    setSchFerryId(sch.ferry?._id || sch.ferry || fleetList[0]?._id || '');
    setSchGate(sch.gate || 'Gate 2');
    setSchStatus(sch.status || 'on-time');
    setSchDelay(sch.delayMinutes || 0);
    setSchPeak(Boolean(sch.peak));
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        route: schRouteId,
        ferry: schFerryId || undefined,
        departure: schDeparture,
        gate: schGate,
        status: schStatus,
        delayMinutes: parseInt(schDelay, 10) || 0,
        peak: schPeak
      };

      if (editingSchedule) {
        await api.schedules.update(editingSchedule._id, payload);
        showSuccess('Ferry schedule updated successfully.');
      } else {
        await api.schedules.create(payload);
        showSuccess('New sailing schedule published to public timetable.');
      }
      setShowScheduleModal(false);
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to save schedule.');
    }
  };

  const handleDeleteSchedule = async (id) => {
    if (!window.confirm('Deactivate this scheduled departure run?')) return;
    try {
      await api.schedules.delete(id);
      showSuccess('Schedule departure deactivated.');
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to deactivate schedule.');
    }
  };

  // ================= CRUD: FLEET =================
  const openNewVesselModal = () => {
    setEditingVessel(null);
    setVesName('');
    setVesCapacity('750');
    setVesStatus('operational');
    setVesRoute('Centre Island');
    setVesCaptain('Capt. R. Campbell');
    setVesType('Double-Ended Passenger');
    setVesYear('1939');
    setShowVesselModal(true);
  };

  const openEditVesselModal = (ves) => {
    setEditingVessel(ves);
    setVesName(ves.name || '');
    setVesCapacity(String(ves.capacity || 750));
    setVesStatus(ves.status || 'operational');
    setVesRoute(ves.assignedRoute || 'Centre Island');
    setVesCaptain(ves.captain || '');
    setVesType(ves.type || 'Double-Ended Passenger');
    setVesYear(String(ves.yearBuilt || 1939));
    setShowVesselModal(true);
  };

  const handleSaveVessel = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: vesName.trim(),
        capacity: parseInt(vesCapacity, 10) || 750,
        status: vesStatus,
        assignedRoute: vesRoute,
        captain: vesCaptain,
        type: vesType,
        yearBuilt: parseInt(vesYear, 10) || 1939
      };

      if (editingVessel) {
        await api.ferries.update(editingVessel._id, payload);
        showSuccess('Fleet vessel telemetry and status updated.');
      } else {
        await api.ferries.create(payload);
        showSuccess('New vessel commissioned into Toronto Island Fleet.');
      }
      setShowVesselModal(false);
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to save fleet vessel.');
    }
  };

  const handleDecommissionVessel = async (id) => {
    if (!window.confirm('Set this vessel to maintenance status?')) return;
    try {
      await api.ferries.delete(id);
      showSuccess('Vessel marked under maintenance.');
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to update vessel status.');
    }
  };

  // ================= CRUD: ALERTS =================
  const handleSaveAlert = async (e) => {
    e.preventDefault();
    if (!alertTitle.trim()) return;
    try {
      await api.alerts.create({
        title: alertTitle.trim(),
        message: alertMsg.trim(),
        body: alertMsg.trim(),
        severity: alertSeverity,
        route: alertRoute
      });
      showSuccess('Marine service advisory broadcasted live.');
      setAlertTitle('');
      setAlertMsg('');
      setShowBroadcastModal(false);
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to broadcast alert.');
    }
  };

  const handleToggleAlertActive = async (alertItem) => {
    try {
      await api.alerts.update(alertItem._id, { active: !alertItem.active });
      showSuccess(`Alert ${alertItem.active ? 'deactivated' : 'activated'}.`);
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to toggle alert status.');
    }
  };

  const handleDeleteAlert = async (id) => {
    if (!window.confirm('Permanently delete this service alert from history?')) return;
    try {
      await api.alerts.delete(id);
      showSuccess('Alert removed from system.');
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to delete alert.');
    }
  };

  // ================= CRUD: PARKS & ATTRACTIONS =================
  const openNewParkModal = () => {
    setEditingPark(null);
    setParkName('');
    setParkCategory('Family Attractions');
    setParkDestination('Centre Island');
    setParkDesc('');
    setParkFeatures('Restrooms, Picnic Tables, Wheelchair Accessible');
    setParkHours('Dawn to Dusk');
    setParkRating('4.8');
    setParkDistance('5 min walk from Ferry Dock');
    setParkAccessible(true);
    setShowParkModal(true);
  };

  const openEditParkModal = (p) => {
    setEditingPark(p);
    setParkName(p.name || p.title || '');
    setParkCategory(p.category || 'Family Attractions');
    setParkDestination(p.destination || p.location || 'Centre Island');
    setParkDesc(p.description || '');
    setParkFeatures(Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''));
    setParkHours(p.hours || 'Dawn to Dusk');
    setParkRating(String(p.rating || 4.8));
    setParkDistance(p.distanceFromDock || '5 min walk from Ferry Dock');
    setParkAccessible(p.accessible !== false);
    setShowParkModal(true);
  };

  const handleSavePark = async (e) => {
    e.preventDefault();
    try {
      const featArray = parkFeatures.split(',').map(s => s.trim()).filter(Boolean);
      const payload = {
        name: parkName.trim(),
        title: parkName.trim(),
        category: parkCategory,
        destination: parkDestination,
        description: parkDesc.trim(),
        features: featArray,
        amenities: featArray,
        hours: parkHours,
        rating: parseFloat(parkRating) || 4.8,
        distanceFromDock: parkDistance,
        accessible: parkAccessible
      };

      if (editingPark) {
        await api.parks.update(editingPark._id, payload);
        showSuccess('Park attraction details updated successfully.');
      } else {
        await api.parks.create(payload);
        showSuccess('New park attraction created in MongoDB.');
      }
      setShowParkModal(false);
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to save park content.');
    }
  };

  const handleDeletePark = async (id) => {
    if (!window.confirm('Delete this park attraction from the public directory?')) return;
    try {
      await api.parks.delete(id);
      showSuccess('Park attraction removed.');
      fetchAdminData();
      loadSystemData();
    } catch (err) {
      alert(err.message || 'Failed to delete park attraction.');
    }
  };

  // ================= USER ROLE & STATUS =================
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.admin.updateUser(userId, { role: newRole });
      showSuccess(`User role changed to ${newRole}.`);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update user role.');
    }
  };

  const handleToggleUserActive = async (user) => {
    try {
      await api.admin.updateUser(user._id, { isActive: !user.isActive });
      showSuccess(`User account ${user.isActive ? 'deactivated' : 'activated'}.`);
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to update user active state.');
    }
  };

  // ================= PRICING & GST =================
  const handleSavePricing = async (e) => {
    e.preventDefault();
    const pTax = parseFloat(taxPercent);
    if (isNaN(pTax) || pTax < 0 || pTax > 50) {
      alert('Tax percentage must be between 0% and 50%.');
      return;
    }
    try {
      await api.pricing.update({
        taxLabel: taxLabel.trim(),
        taxPercent: pTax,
        fares: {
          adult: { title: 'Adult', subtitle: 'Ages 20 – 64', price: parseFloat(adultFare) || 9.11 },
          senior: { title: 'Senior', subtitle: 'Ages 65+', price: parseFloat(seniorFare) || 5.86 },
          youth: { title: 'Youth', subtitle: 'Ages 15 – 19', price: parseFloat(youthFare) || 5.86 },
          junior: { title: 'Junior / Child', subtitle: 'Ages 2 – 14', price: parseFloat(juniorFare) || 4.29 }
        }
      });
      setPricingSuccess(true);
      showSuccess('Pricing and GST configurations persisted to MongoDB.');
      fetchAdminData();
      loadSystemData();
      setTimeout(() => setPricingSuccess(false), 4000);
    } catch (err) {
      alert(err.message || 'Failed to update pricing settings.');
    }
  };

  // ================= TURNSTILE SCANNER =================
  const handleScanTicket = async (e) => {
    e.preventDefault();
    if (!scanCode.trim()) return;
    setScanLoading(true);
    setScanResult(null);
    try {
      const res = await api.tickets.scan(scanCode.trim(), 'Gate 2');
      setScanResult(res.scan);
      fetchAdminData();
    } catch (err) {
      setScanResult({
        passId: scanCode,
        status: 'INVALID',
        details: err.message || 'Ticket not valid in transit registry'
      });
    } finally {
      setScanLoading(false);
    }
  };

  // ================= BOOKINGS CANCEL =================
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this passenger booking and issue immediate refund?')) return;
    try {
      await api.bookings.cancel(bookingId);
      showSuccess('Passenger booking cancelled and refund logged.');
      fetchAdminData();
    } catch (err) {
      alert(err.message || 'Failed to cancel booking.');
    }
  };

  // ================= UNAUTHENTICATED ADMIN GATEWAY =================
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="w-full bg-slate-900 text-slate-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-800/90 rounded-3xl p-8 shadow-2xl border border-slate-700 backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-400/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-400/20">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center mb-6">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
              {t('cityOfToronto', 'City of Toronto')} PF&R
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-2">
              {t('adminTitle', 'Harbour Operations Console')}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t('adminGatewayRestricted', 'Restricted area. Enforced role-based authorization for transit dispatch, fleet management, and pricing controls.')}
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off" id="admin-login-form">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t('adminStaffEmail', 'Staff / Admin Email')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  id="admin-login-email"
                  name="admin_staff_email"
                  autoComplete="off"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="staff@toronto.ca"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">{t('adminPasswordLabel', 'Administrative Password')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  id="admin-login-password"
                  name="admin_staff_password"
                  autoComplete="new-password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loginLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t('adminAuthenticateBtn', 'Authenticate Operations Console')}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered schedules
  const displayedSchedules = schedulesList.filter(s => {
    if (scheduleRouteFilter === 'all') return true;
    const rName = s.route?.name || s.destination || '';
    return rName.toLowerCase().includes(scheduleRouteFilter.toLowerCase());
  });

  // Filtered parks
  const displayedParks = parksList.filter(p => {
    if (parkCategoryFilter === 'all') return true;
    return (p.category || '').toLowerCase() === parkCategoryFilter.toLowerCase();
  });

  // ================= AUTHENTICATED ADMIN DASHBOARD =================
  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Top Operational Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{t('adminHeaderBadge', 'City of Toronto PF&R • Waterfront Internal Operations')}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>{t('adminTitle', 'Harbour Operations & Fleet Management Console')}</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t('adminConnectedDb', 'Connected directly to MongoDB')} (<code className="text-amber-300 font-mono">pfr_ferry</code>). Authorized user: <strong>{currentUser.email}</strong> ({currentUser.role})
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAdminData}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all"
              title="Refresh from MongoDB"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">{t('refreshData', 'Refresh Data')}</span>
            </button>

            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-all"
            >
              {t('signOut', 'Sign Out')}
            </button>
          </div>
        </div>

        {/* Feedback / Toast Messages */}
        {feedback && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
        )}

        {actionError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-900/40 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Admin Navigation Tabs Strip */}
        <div className="flex items-center space-x-1.5 mb-8 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'overview', label: t('tabOverview', 'Overview & Metrics'), icon: TrendingUp },
            { id: 'users', label: t('tabUsers', 'User Registry'), icon: Users, count: usersList.length },
            { id: 'bookings', label: t('tabBookings', 'Passenger Bookings'), icon: CreditCard, count: bookingsList.length },
            { id: 'schedules', label: t('tabSchedules', 'Ferry Schedules'), icon: Clock, count: schedulesList.length },
            { id: 'fleet', label: t('tabFleet', 'Fleet & Vessels'), icon: Anchor, count: fleetList.length },
            { id: 'alerts', label: t('tabAlerts', 'Service Alerts'), icon: ShieldAlert, count: alertsList.length },
            { id: 'parks', label: t('tabParks', 'Parks & Attractions'), icon: Trees, count: parksList.length },
            { id: 'pricing', label: t('tabPricing', 'Pricing & GST Settings'), icon: Sliders },
            { id: 'scanner', label: t('tabScanner', 'Turnstile Scanner'), icon: QrCode },
            { id: 'audit', label: t('tabAudit', 'Audit Trail'), icon: FileText, count: auditLogsList.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${isActive
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: OVERVIEW & METRICS ================= */}
        {activeTab === 'overview' && (
          <div>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('totalRevenue', 'Total Revenue')}</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatCurrency(stats ? stats.totalRevenue : 0, 'CAD')}
                </div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">
                  +{formatCurrency(stats ? stats.totalTaxCollected : 0, 'CAD')} {t('colGst', 'GST')}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{t('totalPassengers', 'Total Passengers')}</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {stats ? stats.totalPassengers : 0}
                </div>
                <div className="text-[10px] text-blue-400 mt-1 font-mono">
                  {t('acrossBookings', 'across')} {stats ? stats.totalBookings : bookingsList.length} {t('bookingsLabel', 'bookings')}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                  <Anchor className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('operationalFleet', 'Operational Fleet')}</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {stats ? stats.operationalFerries : fleetList.filter(f => f.status === 'operational').length} / {fleetList.length || 4}
                </div>
                <div className="text-[10px] text-amber-400 mt-1 font-mono">
                  {t('activeVesselsInService', 'active vessels in service')}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
                <div className="text-xs text-slate-400 font-bold uppercase mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t('scheduledRuns', 'Scheduled Runs')}</span>
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {stats ? stats.scheduledRuns : schedulesList.length}
                </div>
                <div className="text-[10px] text-purple-400 mt-1 font-mono">
                  {alertsList.filter(a => a.active !== false).length} {t('activeAdvisories', 'active advisories')}
                </div>
              </div>
            </div>

            {/* Quick Actions & Live Operations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Relief Departure Dispatcher */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="font-black text-sm text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>{t('quickReliefTitle', 'Quick Relief Departure (Add Schedule)')}</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {t('quickReliefDesc', 'Inject extra relief departures immediately into public schedule and ticketing registry.')}
                </p>

                <form onSubmit={handleSaveSchedule} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('crossingRoute', 'Crossing Route')}</label>
                      <select
                        value={schRouteId}
                        onChange={(e) => setSchRouteId(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        {routesList.map(r => (
                          <option key={r._id} value={r._id}>{locRoute(r.name, language)}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('departureTime', 'Departure Time')}</label>
                      <input
                        type="time"
                        value={schDeparture}
                        onChange={(e) => setSchDeparture(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('departureGate', 'Departure Gate')}</label>
                      <select
                        value={schGate}
                        onChange={(e) => setSchGate(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="Gate 1 (Hanlan)">Gate 1 ({locTerminal("Hanlan's Point", language)})</option>
                        <option value="Gate 2 (Centre)">Gate 2 ({locTerminal("Centre Island", language)})</option>
                        <option value="Gate 3 (Ward)">Gate 3 ({locTerminal("Ward's Island", language)})</option>
                        <option value="Gate 4 (Extra Relief)">Gate 4 ({language === 'FR' ? 'Relève Extra' : 'Extra Relief'})</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('assignedFerry', 'Assigned Ferry')}</label>
                      <select
                        value={schFerryId}
                        onChange={(e) => setSchFerryId(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="">{t('autoAssignFleet', 'Auto-Assign Fleet')}</option>
                        {fleetList.map(f => (
                          <option key={f._id} value={f._id}>{f.name} ({f.capacity} pax)</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('publishReliefDeparture', 'Publish Relief Departure')}</span>
                  </button>
                </form>
              </div>

              {/* Public Advisory Broadcaster */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="font-black text-sm text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-orange-400" />
                  <span>{t('broadcastMarineAlert', 'Broadcast Marine Service Alert')}</span>
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  {t('broadcastMarineAlertDesc', 'Publish high-visibility alerts on home page, ticketing banners, and status boards.')}
                </p>

                <form onSubmit={handleSaveAlert} className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('noticeHeadline', 'Notice Headline')}</label>
                    <input
                      type="text"
                      required
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      placeholder={t('noticeHeadlinePlaceholder', 'e.g. Heavy fog across Harbour entrance')}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('messageDetails', 'Message Details')}</label>
                    <textarea
                      rows={2}
                      value={alertMsg}
                      onChange={(e) => setAlertMsg(e.target.value)}
                      placeholder={t('messageDetailsPlaceholder', 'e.g. Vessel speeds reduced to 6 kts. 5-min delay on Centre Island runs.')}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('severityLabel', 'Severity')}</label>
                      <select
                        value={alertSeverity}
                        onChange={(e) => setAlertSeverity(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="advisory">{language === 'FR' ? 'Avis' : 'Advisory'}</option>
                        <option value="warning">{language === 'FR' ? 'Avertissement / Urgent' : 'Warning / Urgent'}</option>
                        <option value="notice">{language === 'FR' ? 'Avis de service' : 'Notice'}</option>
                        <option value="normal">{language === 'FR' ? 'Statut normal' : 'Normal Status'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-bold mb-1">{t('affectedRoute', 'Affected Route')}</label>
                      <select
                        value={alertRoute}
                        onChange={(e) => setAlertRoute(e.target.value)}
                        className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                      >
                        <option value="System-Wide">{language === 'FR' ? 'Réseau complet' : 'System-Wide'}</option>
                        <option value="Centre Island">{locTerminal("Centre Island", language)}</option>
                        <option value="Hanlan's Point">{locTerminal("Hanlan's Point", language)}</option>
                        <option value="Ward's Island">{locTerminal("Ward's Island", language)}</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Radio className="w-4 h-4" />
                    <span>{t('broadcastAlertImmediately', 'Broadcast Alert Immediately')}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: USER REGISTRY ================= */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">{t('registeredCitizenAccounts', 'Registered Citizen & Staff Accounts')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('registeredCitizenAccountsDesc', 'MongoDB user documents with authorization role governance.')}</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder={t('searchNameOrEmail', 'Search name or email...')}
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="p-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="all">{t('allRoles', 'All Roles')}</option>
                  <option value="citizen">{language === 'FR' ? 'Citoyens' : 'Citizens'}</option>
                  <option value="staff">{language === 'FR' ? 'Personnel' : 'Staff'}</option>
                  <option value="admin">{language === 'FR' ? 'Administrateurs' : 'Administrators'}</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold">{t('colUserName', 'User Name')}</th>
                    <th className="pb-3 font-bold">{t('colEmail', 'Email Address')}</th>
                    <th className="pb-3 font-bold">{t('colRoleAssignment', 'Role Assignment')}</th>
                    <th className="pb-3 font-bold">{t('colAccountStatus', 'Account Status')}</th>
                    <th className="pb-3 font-bold">{t('colCreatedDate', 'Created Date')}</th>
                    <th className="pb-3 font-bold text-right">{t('colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        {t('noUsersMatched', 'No registered accounts matched the query.')}
                      </td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u._id} className="hover:bg-slate-800/30">
                        <td className="py-3 font-bold text-white flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 font-bold flex items-center justify-center text-xs">
                            {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-3 text-slate-300 font-mono text-[11px]">{u.email}</td>
                        <td className="py-3">
                          <select
                            value={u.role || 'citizen'}
                            onChange={(e) => handleUpdateUserRole(u._id, e.target.value)}
                            disabled={u._id === currentUser.id}
                            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 font-bold focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
                          >
                            <option value="citizen">{locRole('citizen', language)}</option>
                            <option value="staff">{locRole('staff', language)}</option>
                            <option value="admin">{locRole('admin', language)}</option>
                          </select>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${u.isActive !== false ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' : 'bg-rose-900/50 text-rose-300 border border-rose-500/30'
                            }`}>
                            {u.isActive !== false ? t('statusActive', 'Active') : t('deactivate', 'Deactivated')}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 text-[11px] font-mono">
                          {u.createdAt ? formatDate(u.createdAt) : '—'}
                        </td>
                        <td className="py-3 text-right">
                          {u._id !== currentUser.id && (
                            <button
                              onClick={() => handleToggleUserActive(u)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${u.isActive !== false
                                ? 'bg-rose-900/40 text-rose-300 hover:bg-rose-900/60'
                                : 'bg-emerald-900/40 text-emerald-300 hover:bg-emerald-900/60'
                                }`}
                            >
                              {u.isActive !== false ? t('deactivate', 'Deactivate') : t('activate', 'Activate')}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: BOOKINGS & PASSENGERS ================= */}
        {activeTab === 'bookings' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">{t('passengerBookingsRegistry', 'Passenger Bookings Registry (MongoDB)')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('passengerBookingsRegistryDesc', 'Real verified ticket codes, true passenger contact names, fares, and GST records.')}</p>
              </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder={t('searchTicketPassenger', 'Search ticket code, passenger...')}
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  className="p-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="all">{t('allStatuses', 'All Statuses')}</option>
                  <option value="confirmed">{locStatus('confirmed', language)}</option>
                  <option value="active">{locStatus('active', language)}</option>
                  <option value="cancelled">{locStatus('cancelled', language)}</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold">{t('colTicketCode', 'Ticket Code')}</th>
                    <th className="pb-3 font-bold">{t('colPassengerDetails', 'Passenger Details')}</th>
                    <th className="pb-3 font-bold">{t('colRouteDeparture', 'Route & Departure')}</th>
                    <th className="pb-3 font-bold">{t('colPax', 'Pax')}</th>
                    <th className="pb-3 font-bold">{t('colBaseFare', 'Base Fare')}</th>
                    <th className="pb-3 font-bold">{t('colGst', 'GST')}</th>
                    <th className="pb-3 font-bold">{t('colTotalPaid', 'Total Paid')}</th>
                    <th className="pb-3 font-bold">{t('colStatus', 'Status')}</th>
                    <th className="pb-3 font-bold text-right">{t('colAction', 'Action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookingsList.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-500">
                        {t('noBookingsMatched', 'No bookings match the filter criteria.')}
                      </td>
                    </tr>
                  ) : (
                    bookingsList.map((b) => {
                      // Correct mapping: actual passenger name must take precedence over admin account holder
                      const passengerDisplayName = b.contactName || (b.passengerDetails && b.passengerDetails[0]?.fullName) || b.user?.name || t('walkUpPassenger', 'Walk-up Passenger');
                      const passengerDisplayEmail = b.contactEmail || b.user?.email || '—';

                      return (
                        <tr key={b._id} className="hover:bg-slate-800/30">
                          <td className="py-3 font-mono font-bold text-amber-300">
                            <div>{b.ticketCode}</div>
                            <div className="text-[10px] text-slate-500">{b.bookingReference || ''}</div>
                          </td>
                          <td className="py-3 text-white">
                            <div className="font-bold">{passengerDisplayName}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{passengerDisplayEmail}</div>
                            {b.user && b.user.name !== passengerDisplayName && (
                              <div className="text-[9px] text-slate-500">{t('bookedViaAccount', 'Booked via account:')} {b.user.name}</div>
                            )}
                          </td>
                          <td className="py-3 text-slate-300">
                            <div>{locTerminal(b.from, language)} ➔ {locTerminal(b.to, language)}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{formatDate(b.date)} • {b.departureTime}</div>
                          </td>
                          <td className="py-3 text-slate-200 font-bold">{b.passengers || 1}</td>
                          <td className="py-3 text-slate-300 font-mono">{formatCurrency(b.pricing?.baseFare || 0, 'CAD')}</td>
                          <td className="py-3 text-orange-400 font-mono">{formatCurrency(b.pricing?.taxAmount || 0, 'CAD')}</td>
                          <td className="py-3 font-bold text-white font-mono">{formatCurrency(b.pricing?.totalAmount || 0, 'CAD')}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${b.status === 'confirmed' || b.status === 'active'
                              ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-900/50 text-rose-300 border border-rose-500/30'
                              }`}>
                              {locStatus(b.status, language)}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {b.status !== 'cancelled' && b.status !== 'refunded' ? (
                              <button
                                onClick={() => handleCancelBooking(b._id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-900/40 text-rose-300 hover:bg-rose-900/60 font-bold text-[10px] transition-all"
                              >
                                {t('refundBtn', 'Refund')}
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-500 italic">{t('refundedBadge', 'Refunded')}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: FERRY SCHEDULES (FIXED & FULLY IMPLEMENTED) ================= */}
        {activeTab === 'schedules' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">{t('ferryDepartureSchedules', 'Ferry Departure Schedules & Timetable')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('ferryDepartureSchedulesDesc', 'Manage daily sailings, relief runs, departure gates, and live delay tracking.')}</p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={scheduleRouteFilter}
                  onChange={(e) => setScheduleRouteFilter(e.target.value)}
                  className="p-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="all">{t('allDestinations', 'All Destinations')}</option>
                  <option value="Centre Island">{locTerminal('Centre Island', language)}</option>
                  <option value="Hanlan">{locTerminal("Hanlan's Point", language)}</option>
                  <option value="Ward">{locTerminal("Ward's Island", language)}</option>
                </select>

                <button
                  onClick={openNewScheduleModal}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('newScheduleRun', 'New Schedule Run')}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold">{t('departureTime', 'Departure Time')}</th>
                    <th className="pb-3 font-bold">{t('colRouteDeparture', 'Route / Destination')}</th>
                    <th className="pb-3 font-bold">{t('colDepartureSlip', 'Departure Slip / Gate')}</th>
                    <th className="pb-3 font-bold">{t('colAssignedVessel', 'Assigned Vessel')}</th>
                    <th className="pb-3 font-bold">{t('colStatus', 'Status')}</th>
                    <th className="pb-3 font-bold">{t('colDelay', 'Delay')}</th>
                    <th className="pb-3 font-bold">{t('colPeakSailing', 'Peak Sailing')}</th>
                    <th className="pb-3 font-bold text-right">{t('colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {displayedSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-500">
                        {t('noSchedulesFound', 'No scheduled sailings found. Click "New Schedule Run" to create one.')}
                      </td>
                    </tr>
                  ) : (
                    displayedSchedules.map((sch) => {
                      const routeName = sch.route?.name || sch.destination || 'Toronto Island Route';
                      const vesselName = sch.ferry?.name || 'MV Sam McBride';
                      const isDelayed = sch.status === 'delayed' || (sch.delayMinutes && sch.delayMinutes > 0);

                      return (
                        <tr key={sch._id} className="hover:bg-slate-800/30">
                          <td className="py-3 font-mono font-bold text-amber-300 text-sm">
                            {sch.departure || sch.departureTime}
                          </td>
                          <td className="py-3 font-bold text-white">
                            {locRoute(routeName, language)}
                          </td>
                          <td className="py-3 text-slate-300">
                            {sch.gate || 'Gate 2'}
                          </td>
                          <td className="py-3 text-slate-200 flex items-center gap-1.5">
                            <Anchor className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{vesselName}</span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${sch.status === 'on-time' || sch.status === 'On Time'
                              ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                              : sch.status === 'boarding' || sch.status === 'Boarding'
                                ? 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
                                : isDelayed
                                  ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                                  : 'bg-rose-900/50 text-rose-300 border border-rose-500/30'
                              }`}>
                              {locStatus(sch.status, language)}
                            </span>
                          </td>
                          <td className="py-3 text-slate-400 font-mono">
                            {sch.delayMinutes ? `+${sch.delayMinutes} min` : t('noneDelay', 'None')}
                          </td>
                          <td className="py-3">
                            {sch.peak ? (
                              <span className="text-[10px] bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                                {t('peakBadge', 'PEAK')}
                              </span>
                            ) : (
                              <span className="text-slate-500 text-[10px]">{t('standardBadge', 'Standard')}</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => openEditScheduleModal(sch)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title={t('edit', 'Edit Schedule')}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteSchedule(sch._id)}
                                className="p-1 rounded-lg bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 transition-colors"
                                title={t('deactivate', 'Deactivate Departure')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 5: FLEET & VESSELS (FIXED & FULLY IMPLEMENTED) ================= */}
        {activeTab === 'fleet' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">{t('fleetTelemetryHeading', 'Toronto Island Fleet & Vessel Telemetry')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('fleetTelemetryDesc', 'Manage passenger capacity, captains, assigned routes, and operational vessel statuses.')}</p>
              </div>

              <button
                onClick={openNewVesselModal}
                className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('commissionVesselBtn', 'Commission Vessel')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fleetList.length === 0 ? (
                <div className="col-span-full py-8 text-center text-slate-500">
                  {t('noFleetRegistered', 'No fleet vessels registered. Click "Commission Vessel" to add one.')}
                </div>
              ) : (
                fleetList.map((ves) => {
                  const isOperational = ves.status === 'operational' || ves.status === 'in-service';
                  const loadPercent = Math.min(100, Math.round(((ves.currentLoad || 0) / (ves.capacity || 750)) * 100));

                  return (
                    <div key={ves._id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${isOperational
                          ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                          }`}>
                          {locStatus(ves.status, language)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => openEditVesselModal(ves)}
                            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title={t('edit', 'Edit Vessel')}
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDecommissionVessel(ves._id)}
                            className="p-1 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-900/30"
                            title={t('deactivate', 'Decommission / Set Maintenance')}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                          <Anchor className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-black text-white text-base">{ves.name}</h4>
                          <div className="text-[11px] text-slate-400">{ves.type || 'Double-Ended Passenger Ferry'} • {t('builtYearLabel', 'Built')} {ves.yearBuilt || 1939}</div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('maxPassengerCapacity', 'Max Passenger Capacity:')}</span>
                          <span className="font-bold font-mono text-white">{ves.capacity || 750} pax</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('assignedRouteLabel', 'Assigned Route:')}</span>
                          <span className="font-bold text-amber-300">{locTerminal(ves.assignedRoute || 'Centre Island', language)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">{t('commandingOfficer', 'Commanding Officer:')}</span>
                          <span className="font-bold text-slate-200">{ves.captain || 'Capt. R. Campbell'}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>{t('currentPassengerLoad', 'Current Passenger Load:')}</span>
                          <span className="font-mono">{ves.currentLoad || 0} / {ves.capacity || 750} ({loadPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${loadPercent > 85 ? 'bg-rose-500' : loadPercent > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            style={{ width: `${loadPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SERVICE ALERTS (FIXED & FULLY IMPLEMENTED) ================= */}
        {activeTab === 'alerts' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">{t('serviceAlertsHeading', 'Marine Service Alerts & Public Bulletins')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('serviceAlertsDesc', 'Control live weather advisories, harbour warnings, and route notices broadcast on the portal.')}</p>
              </div>

              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{t('broadcastNewAdvisory', 'Broadcast New Advisory')}</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold">{t('severityLabel', 'Severity')}</th>
                    <th className="pb-3 font-bold">{t('noticeHeadline', 'Alert Title')}</th>
                    <th className="pb-3 font-bold">{t('affectedRoute', 'Affected Route')}</th>
                    <th className="pb-3 font-bold">{t('messageDetails', 'Message Details')}</th>
                    <th className="pb-3 font-bold">{t('colStatus', 'Status')}</th>
                    <th className="pb-3 font-bold">{t('colBroadcastDate', 'Broadcast Date')}</th>
                    <th className="pb-3 font-bold text-right">{t('colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {alertsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        {t('noAlertsLogged', 'No service alerts logged. Click "Broadcast New Advisory" to create one.')}
                      </td>
                    </tr>
                  ) : (
                    alertsList.map((alt) => {
                      const sev = (alt.severity || 'advisory').toLowerCase();
                      const sevLabel = sev === 'warning' || sev === 'urgent'
                        ? (language === 'FR' ? 'Avertissement' : 'Warning')
                        : sev === 'advisory'
                          ? (language === 'FR' ? 'Avis' : 'Advisory')
                          : (language === 'FR' ? 'Avis de service' : 'Notice');

                      return (
                        <tr key={alt._id} className="hover:bg-slate-800/30">
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${sev === 'warning' || sev === 'urgent'
                              ? 'bg-rose-900/50 text-rose-300 border border-rose-500/30'
                              : sev === 'advisory'
                                ? 'bg-amber-900/50 text-amber-300 border border-amber-500/30'
                                : 'bg-blue-900/50 text-blue-300 border border-blue-500/30'
                              }`}>
                              {sevLabel}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-white max-w-xs truncate">
                            {alt.title}
                          </td>
                          <td className="py-3 text-slate-300">
                            {alt.route === 'System-Wide' ? (language === 'FR' ? 'Réseau complet' : 'System-Wide') : locTerminal(alt.route, language)}
                          </td>
                          <td className="py-3 text-slate-400 max-w-sm truncate text-[11px]">
                            {alt.message || alt.body || '—'}
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => handleToggleAlertActive(alt)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${alt.active !== false
                                ? 'bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/70'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                              {alt.active !== false ? t('statusActive', 'Active') : t('statusInactive', 'Inactive')}
                            </button>
                          </td>
                          <td className="py-3 text-slate-400 text-[11px] font-mono">
                            {alt.createdAt ? formatDate(alt.createdAt) : '—'}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleDeleteAlert(alt._id)}
                              className="p-1 rounded-lg bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 transition-colors"
                              title={t('delete', 'Delete Alert')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 7: PARKS & ATTRACTIONS (FIXED & FULLY IMPLEMENTED) ================= */}
        {activeTab === 'parks' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
              <div>
                <h3 className="font-black text-sm text-white uppercase tracking-wider">{t('parksWaterfrontHeading', 'Parks, Trails & Waterfront Attractions')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{t('parksWaterfrontDesc', 'Manage public park descriptions, accessible facilities, island destinations, and amenities.')}</p>
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={parkCategoryFilter}
                  onChange={(e) => setParkCategoryFilter(e.target.value)}
                  className="p-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                >
                  <option value="all">{t('allCategories', 'All Categories')}</option>
                  <option value="family attractions">{language === 'FR' ? 'Attractions familiales' : 'Family Attractions'}</option>
                  <option value="beaches">{language === 'FR' ? 'Plages' : 'Beaches'}</option>
                  <option value="nature & trails">{language === 'FR' ? 'Nature et sentiers' : 'Nature & Trails'}</option>
                  <option value="historic landmarks">{language === 'FR' ? 'Lieux historiques' : 'Historic Landmarks'}</option>
                  <option value="picnic & recreation">{language === 'FR' ? 'Pique-nique et loisirs' : 'Picnic & Recreation'}</option>
                </select>

                <button
                  onClick={openNewParkModal}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('addAttractionBtn', 'Add Attraction')}</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold">{t('colAttractionName', 'Attraction Name')}</th>
                    <th className="pb-3 font-bold">{t('colCategory', 'Category')}</th>
                    <th className="pb-3 font-bold">{t('colIslandArea', 'Island Area')}</th>
                    <th className="pb-3 font-bold">{t('colRating', 'Rating')}</th>
                    <th className="pb-3 font-bold">{t('colDistanceFromDock', 'Distance from Dock')}</th>
                    <th className="pb-3 font-bold">{t('colAmenitiesTags', 'Amenities / Tags')}</th>
                    <th className="pb-3 font-bold text-right">{t('colActions', 'Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {displayedParks.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        {t('noAttractionsMatched', 'No attractions match the filter criteria.')}
                      </td>
                    </tr>
                  ) : (
                    displayedParks.map((p) => {
                      const feats = Array.isArray(p.features) ? p.features : [];
                      return (
                        <tr key={p._id} className="hover:bg-slate-800/30">
                          <td className="py-3 font-bold text-white flex items-center gap-2">
                            <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{p.name || p.title}</span>
                          </td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300">
                              {p.category || (language === 'FR' ? 'Attraction générale' : 'General Attraction')}
                            </span>
                          </td>
                          <td className="py-3 text-slate-300">
                            {locTerminal(p.destination || p.location || 'Centre Island', language)}
                          </td>
                          <td className="py-3 text-amber-400 font-bold font-mono">
                            ★ {p.rating || '4.8'}
                          </td>
                          <td className="py-3 text-slate-400 text-[11px]">
                            {p.distanceFromDock || (language === 'FR' ? '5 min à pied' : '5 min walk')}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {feats.slice(0, 3).map((f, idx) => (
                                <span key={idx} className="bg-slate-950 text-slate-400 px-1.5 py-0.2 rounded text-[9px] border border-slate-800">
                                  {f}
                                </span>
                              ))}
                              {feats.length > 3 && (
                                <span className="text-[9px] text-slate-500">+{feats.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 text-right">
                            <div className="flex items-center justify-end space-x-1.5">
                              <button
                                onClick={() => openEditParkModal(p)}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                                title={t('edit', 'Edit Attraction')}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePark(p._id)}
                                className="p-1 rounded-lg bg-rose-900/30 hover:bg-rose-900/60 text-rose-300 transition-colors"
                                title={t('delete', 'Delete Attraction')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 8: PRICING & GST SETTINGS ================= */}
        {activeTab === 'pricing' && (
          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h3 className="font-black text-base text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-400" />
              <span>{t('pricingControlsHeading', 'GST & Ticket Pricing Controls')}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('pricingControlsDesc', 'Configure applicable tax jurisdiction label, percentage, and standard passenger fares. Changes are saved to MongoDB with an immutable audit log.')}
            </p>

            {pricingSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t('pricingUpdatedSuccess', 'Pricing & GST settings updated in MongoDB successfully.')}</span>
              </div>
            )}

            <form onSubmit={handleSavePricing} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('taxLabelField', 'Tax Label (Jurisdiction)')}</label>
                  <input
                    type="text"
                    required
                    value={taxLabel}
                    onChange={(e) => setTaxLabel(e.target.value)}
                    placeholder="GST"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('configuredTaxRate', 'Configured Tax Rate (%)')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    required
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    placeholder="5.0"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 mt-2">
                <div className="text-xs font-bold text-slate-400 uppercase mb-3">{t('singleTripBaseFares', 'Single-Trip Base Ticket Fares (CAD)')}</div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1">{t('adultFareLabel', 'Adult Fare (Ages 20 – 64)')}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={adultFare}
                      onChange={(e) => setAdultFare(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">{t('seniorFareLabel', 'Senior Fare (Ages 65+)')}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={seniorFare}
                      onChange={(e) => setSeniorFare(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">{t('youthFareLabel', 'Youth Fare (Ages 15 – 19)')}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={youthFare}
                      onChange={(e) => setYouthFare(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">{t('juniorFareLabel', 'Junior / Child Fare (Ages 2 – 14)')}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={juniorFare}
                      onChange={(e) => setJuniorFare(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs">
                <div className="text-slate-400 font-bold mb-1">{t('sampleCalculationPreview', 'Sample Calculation Preview (1 Adult Single Trip):')}</div>
                <div className="flex justify-between text-slate-300">
                  <span>{t('colBaseFare', 'Base Fare')}:</span>
                  <span className="font-mono">{formatCurrency(parseFloat(adultFare || 0), 'CAD')}</span>
                </div>
                <div className="flex justify-between text-orange-400">
                  <span>{taxLabel} ({taxPercent}%):</span>
                  <span className="font-mono">{formatCurrency((parseFloat(adultFare || 0) * parseFloat(taxPercent || 0)) / 100, 'CAD')}</span>
                </div>
                <div className="flex justify-between text-white font-bold border-t border-slate-800 mt-1 pt-1">
                  <span>{t('totalSingleFare', 'Total Single Fare:')}</span>
                  <span className="font-mono text-amber-300">{formatCurrency(parseFloat(adultFare || 0) * (1 + parseFloat(taxPercent || 0) / 100), 'CAD')}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md"
              >
                {t('savePricingChanges', 'Publish Pricing & Tax Changes')}
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB 9: TURNSTILE SCANNER ================= */}
        {activeTab === 'scanner' && (
          <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <h3 className="font-black text-base text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>{t('turnstileScannerHeading', 'Gate 2 Turnstile Scanner (Server-Verified)')}</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('turnstileScannerDesc', 'Simulates physical optical scanners at Jack Layton Ferry Terminal. Verifies passenger barcodes against MongoDB transit registry.')}
            </p>

            <form onSubmit={handleScanTicket} className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('ticketCodeOrQr', 'Ticket Code / QR Payload')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value)}
                    placeholder="e.g. 1BEE61AD or scan payload"
                    className="flex-1 p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                  <button
                    type="submit"
                    disabled={scanLoading}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all"
                  >
                    {t('scanBtn', 'Scan')}
                  </button>
                </div>
              </div>
            </form>

            {scanResult && (
              <div className={`p-4 rounded-2xl border text-xs ${scanResult.status === 'VALID'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm flex items-center gap-1.5">
                    {scanResult.status === 'VALID' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
                    <span>{t('turnstileLabel', 'TURNSTILE:')} {scanResult.status === 'VALID' ? (language === 'FR' ? 'VALIDE' : 'VALID') : (language === 'FR' ? 'REFUSÉ' : 'REJECTED')}</span>
                  </span>
                  <span className="font-mono text-[11px] opacity-75">{scanResult.time || (language === 'FR' ? 'À l’instant' : 'Just now')}</span>
                </div>
                <p className="text-xs opacity-90">{scanResult.details}</p>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 10: AUDIT TRAIL ================= */}
        {activeTab === 'audit' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="font-black text-sm text-white uppercase tracking-wider mb-4">{t('auditLogsHeading', 'Administrative Action Audit Logs')}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-bold">{t('colTimestamp', 'Timestamp')}</th>
                    <th className="pb-3 font-bold">{t('colAdminUser', 'Admin User')}</th>
                    <th className="pb-3 font-bold">{t('colAction', 'Action')}</th>
                    <th className="pb-3 font-bold">{t('colTargetEntity', 'Target Entity')}</th>
                    <th className="pb-3 font-bold">{t('colDetails', 'Details')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {auditLogsList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500">
                        {t('noAuditRecorded', 'No audit events recorded yet.')}
                      </td>
                    </tr>
                  ) : (
                    auditLogsList.map((log) => (
                      <tr key={log._id} className="hover:bg-slate-800/30">
                        <td className="py-3 text-slate-400 text-[11px] font-mono">
                          {formatDate(log.createdAt, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 font-bold text-white">{log.adminEmail}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">{log.targetEntity}</td>
                        <td className="py-3 text-slate-400 font-mono text-[11px]">
                          {JSON.stringify(log.details)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* ================= MODAL: CREATE / EDIT SCHEDULE ================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-white mb-1">
              {editingSchedule ? t('modifyScheduleRun', 'Modify Ferry Schedule Run') : t('publishNewDeparture', 'Publish New Ferry Departure')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('scheduleModalDesc', 'Updates departure boards, transit booking slots, and passenger gate assignments.')}
            </p>

            <form onSubmit={handleSaveSchedule} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('crossingRoute', 'Crossing Route')}</label>
                  <select
                    value={schRouteId}
                    onChange={(e) => setSchRouteId(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    {routesList.map(r => (
                      <option key={r._id} value={r._id}>{locRoute(r.name, language)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('departureTime', 'Departure Time')}</label>
                  <input
                    type="time"
                    required
                    value={schDeparture}
                    onChange={(e) => setSchDeparture(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('colDepartureSlip', 'Departure Slip / Gate')}</label>
                  <select
                    value={schGate}
                    onChange={(e) => setSchGate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Gate 1 (Hanlan)">Gate 1 ({locTerminal("Hanlan's Point", language)})</option>
                    <option value="Gate 2 (Centre)">Gate 2 ({locTerminal("Centre Island", language)})</option>
                    <option value="Gate 3 (Ward)">Gate 3 ({locTerminal("Ward's Island", language)})</option>
                    <option value="Gate 4 (Extra Relief)">Gate 4 ({language === 'FR' ? 'Relève Extra' : 'Extra Relief'})</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('colAssignedVessel', 'Assigned Ferry Vessel')}</label>
                  <select
                    value={schFerryId}
                    onChange={(e) => setSchFerryId(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="">{t('autoAssignFleet', 'Auto-Assign Fleet')}</option>
                    {fleetList.map(f => (
                      <option key={f._id} value={f._id}>{f.name} ({f.capacity} pax)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('sailingStatus', 'Sailing Status')}</label>
                  <select
                    value={schStatus}
                    onChange={(e) => setSchStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="on-time">{locStatus('on-time', language)}</option>
                    <option value="boarding">{locStatus('boarding', language)}</option>
                    <option value="delayed">{locStatus('delayed', language)}</option>
                    <option value="cancelled">{locStatus('cancelled', language)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('delayMinutesLabel', 'Delay Minutes')}</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={schDelay}
                    onChange={(e) => setSchDelay(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="schPeakCheck"
                  checked={schPeak}
                  onChange={(e) => setSchPeak(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="schPeakCheck" className="text-xs text-slate-300 font-bold">
                  {t('peakSailingCheck', 'Peak Sailing Run (Higher Capacity Frequency)')}
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md"
                >
                  {editingSchedule ? t('save', 'Save Changes') : t('publishReliefDeparture', 'Publish Schedule Run')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT FLEET VESSEL ================= */}
      {showVesselModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowVesselModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-white mb-1">
              {editingVessel ? t('modifyVesselSpecs', 'Modify Vessel Specifications') : t('commissionFleetVessel', 'Commission Fleet Vessel')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('vesselModalDesc', 'Vessel records enforce safe passenger capacity limits and assigned captain dispatch.')}
            </p>

            <form onSubmit={handleSaveVessel} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('vesselNameLabel', 'Vessel Name')}</label>
                  <input
                    type="text"
                    required
                    value={vesName}
                    onChange={(e) => setVesName(e.target.value)}
                    placeholder="e.g. William Inglis"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('passengerCapacityLabel', 'Passenger Capacity')}</label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="1500"
                    value={vesCapacity}
                    onChange={(e) => setVesCapacity(e.target.value)}
                    placeholder="750"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('colAccountStatus', 'Operational Status')}</label>
                  <select
                    value={vesStatus}
                    onChange={(e) => setVesStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="operational">{locStatus('operational', language)}</option>
                    <option value="in-service">{locStatus('in-service', language)}</option>
                    <option value="standby">{locStatus('standby', language)}</option>
                    <option value="maintenance">{locStatus('maintenance', language)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('assignedRouteLabel', 'Assigned Route')}</label>
                  <select
                    value={vesRoute}
                    onChange={(e) => setVesRoute(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Centre Island">{locTerminal("Centre Island", language)}</option>
                    <option value="Hanlan's Point">{locTerminal("Hanlan's Point", language)}</option>
                    <option value="Ward's Island">{locTerminal("Ward's Island", language)}</option>
                    <option value="Relief / All Terminals">{language === 'FR' ? 'Relève / Tous les terminaux' : 'Relief / All Terminals'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('masterCaptainLabel', 'Master / Captain')}</label>
                  <input
                    type="text"
                    value={vesCaptain}
                    onChange={(e) => setVesCaptain(e.target.value)}
                    placeholder="Capt. R. Campbell"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('yearBuiltLabel', 'Year Built')}</label>
                  <input
                    type="number"
                    value={vesYear}
                    onChange={(e) => setVesYear(e.target.value)}
                    placeholder="1939"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('vesselTypeLabel', 'Vessel Type')}</label>
                <input
                  type="text"
                  value={vesType}
                  onChange={(e) => setVesType(e.target.value)}
                  placeholder="Double-Ended Passenger Ferry"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVesselModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md"
                >
                  {editingVessel ? t('save', 'Save Vessel Details') : t('commissionVesselBtn', 'Commission Vessel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: BROADCAST ALERT ================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowBroadcastModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-white mb-1">
              {t('broadcastMarineNoticeHeading', 'Broadcast Marine Advisory / Warning')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('broadcastNoticeDesc', 'Immediately alerts all waterfront visitors across portal banners and schedule boards.')}
            </p>

            <form onSubmit={handleSaveAlert} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('noticeHeadline', 'Notice Headline')}</label>
                <input
                  type="text"
                  required
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  placeholder={t('noticeHeadlinePlaceholder', 'e.g. Strong gale warning on Lake Ontario')}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('messageDetails', 'Message Details')}</label>
                <textarea
                  rows={3}
                  value={alertMsg}
                  onChange={(e) => setAlertMsg(e.target.value)}
                  placeholder={t('messageDetailsPlaceholder', 'e.g. Wave swell over 1.2m. Hanlan\'s Point sailings suspended until 19:00.')}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('severityLabel', 'Severity')}</label>
                  <select
                    value={alertSeverity}
                    onChange={(e) => setAlertSeverity(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="advisory">{language === 'FR' ? 'Avis' : 'Advisory'}</option>
                    <option value="warning">{language === 'FR' ? 'Avertissement / Urgent' : 'Warning / Urgent'}</option>
                    <option value="notice">{language === 'FR' ? 'Avis de service' : 'Notice'}</option>
                    <option value="normal">{language === 'FR' ? 'Statut normal' : 'Normal Status'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('affectedRoute', 'Affected Route')}</label>
                  <select
                    value={alertRoute}
                    onChange={(e) => setAlertRoute(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="System-Wide">{language === 'FR' ? 'Réseau complet' : 'System-Wide'}</option>
                    <option value="Centre Island">{locTerminal("Centre Island", language)}</option>
                    <option value="Hanlan's Point">{locTerminal("Hanlan's Point", language)}</option>
                    <option value="Ward's Island">{locTerminal("Ward's Island", language)}</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md"
                >
                  {t('broadcastBulletinBtn', 'Broadcast Bulletin')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT PARK ATTRACTION ================= */}
      {showParkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowParkModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-black text-lg text-white mb-1">
              {editingPark ? t('modifyParkAttraction', 'Modify Park Attraction') : t('registerNewParkAttraction', 'Register New Park Attraction')}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t('parkModalDesc', 'Published directly to Toronto Island Parks, Trails & Attractions visitor guide.')}
            </p>

            <form onSubmit={handleSavePark} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('colAttractionName', 'Attraction Name')}</label>
                  <input
                    type="text"
                    required
                    value={parkName}
                    onChange={(e) => setParkName(e.target.value)}
                    placeholder="e.g. Gibraltar Point Lighthouse"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('colCategory', 'Category')}</label>
                  <select
                    value={parkCategory}
                    onChange={(e) => setParkCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Family Attractions">{language === 'FR' ? 'Attractions familiales' : 'Family Attractions'}</option>
                    <option value="Beaches">{language === 'FR' ? 'Plages' : 'Beaches'}</option>
                    <option value="Nature & Trails">{language === 'FR' ? 'Nature et sentiers' : 'Nature & Trails'}</option>
                    <option value="Historic Landmarks">{language === 'FR' ? 'Lieux historiques' : 'Historic Landmarks'}</option>
                    <option value="Picnic & Recreation">{language === 'FR' ? 'Pique-nique et loisirs' : 'Picnic & Recreation'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('colIslandArea', 'Island Destination Area')}</label>
                  <select
                    value={parkDestination}
                    onChange={(e) => setParkDestination(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  >
                    <option value="Centre Island">{locTerminal("Centre Island", language)}</option>
                    <option value="Hanlan's Point">{locTerminal("Hanlan's Point", language)}</option>
                    <option value="Ward's Island">{locTerminal("Ward's Island", language)}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('distanceFromDockLabel', 'Distance from Dock')}</label>
                  <input
                    type="text"
                    value={parkDistance}
                    onChange={(e) => setParkDistance(e.target.value)}
                    placeholder="5 min walk from Ferry Dock"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('messageDetails', 'Description')}</label>
                <textarea
                  rows={2}
                  value={parkDesc}
                  onChange={(e) => setParkDesc(e.target.value)}
                  placeholder="Historic landmark, picnic spaces, scenic views..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">{t('featuresAmenitiesLabel', 'Features & Amenities (Comma Separated)')}</label>
                <input
                  type="text"
                  value={parkFeatures}
                  onChange={(e) => setParkFeatures(e.target.value)}
                  placeholder="Restrooms, Picnic Tables, Wheelchair Accessible, Beach"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('hoursOfOperationLabel', 'Hours of Operation')}</label>
                  <input
                    type="text"
                    value={parkHours}
                    onChange={(e) => setParkHours(e.target.value)}
                    placeholder="Dawn to Dusk"
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">{t('visitorRatingLabel', 'Visitor Rating (1.0 – 5.0)')}</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={parkRating}
                    onChange={(e) => setParkRating(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="parkAccessCheck"
                  checked={parkAccessible}
                  onChange={(e) => setParkAccessible(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                />
                <label htmlFor="parkAccessCheck" className="text-xs text-slate-300 font-bold">
                  {t('aodaAccessibleCheck', 'AODA Wheelchair & Stroller Accessible')}
                </label>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowParkModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  {t('cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md"
                >
                  {editingPark ? t('save', 'Save Attraction') : t('submit', 'Register Attraction')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
