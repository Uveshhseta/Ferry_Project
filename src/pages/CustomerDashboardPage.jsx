import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, 
  Ticket, 
  QrCode, 
  Clock, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Download, 
  CreditCard, 
  Bell, 
  Sparkles, 
  Printer, 
  Smartphone, 
  ChevronRight, 
  ShieldCheck, 
  Award,
  AlertCircle,
  X,
  LogIn,
  RotateCcw
} from 'lucide-react';
import { downloadTicketPdf } from '../utils/ticketPdf';

export default function CustomerDashboardPage() {
  const { 
    currentUser, 
    isAuthenticated, 
    openAuthModal, 
    userBookings, 
    loadUserBookings, 
    navigateTo,
    language,
    t,
    locTerminal,
    locRoute,
    locStatus,
    locTripType,
    locRole,
    formatDate,
    formatCurrency
  } = useApp();

  const [activeTab, setActiveTab] = useState('passes'); // 'passes' | 'history'
  const [selectedPassModal, setSelectedPassModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadUserBookings();
    }
  }, [isAuthenticated, loadUserBookings]);

  const activePasses = userBookings.filter(p => p.status === 'confirmed' || p.status === 'active');
  const pastPasses = userBookings.filter(p => p.status === 'completed' || p.status === 'cancelled' || p.status === 'refunded');

  const handleCancelTicket = async (bookingId) => {
    if (!window.confirm(t('cancelTicketConfirm', 'Are you sure you want to cancel this ticket and process a refund?'))) return;
    setActionLoading(true);
    try {
      await api.bookings.cancel(bookingId);
      setFeedbackMsg(t('cancelTicketSuccess', 'Ticket cancelled and refunded successfully.'));
      setSelectedPassModal(null);
      await loadUserBookings();
      setTimeout(() => setFeedbackMsg(''), 4000);
    } catch (err) {
      alert(err.message || t('cancelTicketError', 'Failed to cancel ticket.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full bg-slate-50 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#004f8b]/10 text-[#004f8b] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            {t('signInToViewAccount', 'Sign In to View Your Account')}
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {t('signInViewAccountDesc', 'Please log in with your email and password to access your persistent digital ferry passes, trip receipts, and travel history saved in MongoDB.')}
          </p>

          <button
            onClick={() => openAuthModal('login', 'dashboard')}
            className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('signInToMyAccount', 'Sign In to My Account')}</span>
          </button>
        </div>
      </div>
    );
  }

  const roleBadgeLabel = currentUser.role === 'admin'
    ? t('adminAccount', 'Admin Account')
    : currentUser.role === 'staff'
    ? t('staffAccount', 'Staff Account')
    : t('citizenAccount', 'Citizen Account');

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="bg-gradient-to-tr from-[#002d54] to-[#004f8b] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center space-x-4 z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-900 font-black text-2xl flex items-center justify-center shadow-lg border-2 border-white/20">
              {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl md:text-2xl font-black">{currentUser.name}</h1>
                <span className="bg-amber-400 text-slate-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 capitalize">
                  <Award className="w-3 h-3" />
                  {roleBadgeLabel}
                </span>
              </div>
              <div className="text-xs text-blue-200 mt-0.5">
                {currentUser.email} • {t('verifiedWaterfrontPassenger', 'Verified Waterfront Passenger')}
              </div>
            </div>
          </div>

          {/* Quick Stats in Profile */}
          <div className="flex items-center space-x-4 md:space-x-6 z-10 text-xs">
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-blue-200 text-[10px]">{t('activePasses', 'Active Passes')}</div>
              <div className="text-xl font-black text-amber-300">{activePasses.length}</div>
            </div>
            <div className="bg-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-blue-200 text-[10px]">{t('totalBookings', 'Total Bookings')}</div>
              <div className="text-xl font-black text-emerald-300">{userBookings.length}</div>
            </div>
            <button
              onClick={() => navigateTo('booking')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold px-4 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>{t('bookPass', 'Book Pass')}</span>
            </button>
          </div>
        </div>

        {feedbackMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="flex items-center space-x-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('passes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'passes' 
                ? 'bg-[#004f8b] text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>{t('activeDigitalPasses', 'Active Digital Passes')} ({activePasses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-[#004f8b] text-white shadow-xs' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t('bookingHistory', 'Booking History')} ({pastPasses.length})</span>
          </button>
        </div>

        {/* TAB 1: ACTIVE PASSES */}
        {activeTab === 'passes' && (
          <div>
            {activePasses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-extrabold text-base text-slate-800">{t('noActivePasses', 'No Active Ferry Passes')}</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                  {t('noActivePassesDesc', "You don't have any upcoming trips scheduled. Book online in advance to bypass queues at Jack Layton Ferry Terminal.")}
                </p>
                <button
                  onClick={() => navigateTo('booking')}
                  className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{t('bookYourPassNow', 'Book Your Ferry Pass Now')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activePasses.map((pass) => (
                  <div 
                    key={pass._id || pass.ticketCode}
                    className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 flex flex-col justify-between hover:shadow-lg transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{t('validDigitalPass', 'Valid Digital Pass')}</span>
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {pass.ticketCode}
                        </span>
                      </div>

                      <h3 className="font-black text-lg text-slate-900 mb-1">
                        {locTerminal(pass.from)} ➔ {locTerminal(pass.to)}
                      </h3>
                      <div className="text-xs text-slate-500 flex items-center gap-3 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-orange-500" />
                          {formatDate(pass.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {pass.departureTime ? pass.departureTime : t('scheduledRun', 'Scheduled Run')}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 mb-4">
                        <div className="flex justify-between text-slate-600">
                          <span>{t('tripType', 'Trip Type')}:</span>
                          <span className="font-bold text-slate-800">{locTripType(pass.tripType)}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>{t('totalPassengers', 'Total Passengers')}:</span>
                          <span className="font-bold text-slate-800">{pass.passengers} {t('passengerCountSuffix', 'Passenger(s)')}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span>{t('totalFarePaid', 'Total Fare Paid')}:</span>
                          <span className="font-bold text-orange-600">{formatCurrency(pass.pricing?.totalAmount || 0)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedPassModal(pass)}
                        className="flex-1 py-2.5 rounded-xl bg-[#004f8b] hover:bg-[#003d6d] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <QrCode className="w-4 h-4" />
                        <span>{t('viewBarcode', 'View Barcode')}</span>
                      </button>

                      <button
                        onClick={() => downloadTicketPdf({ 
                          booking: pass, 
                          passengerName: pass.contactName || currentUser.name, 
                          passengerEmail: pass.contactEmail || currentUser.email,
                          lang: language
                        })}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        title={t('downloadPdf', 'Download Standalone PDF')}
                      >
                        <Download className="w-4 h-4 text-slate-600" />
                        <span className="hidden sm:inline">PDF</span>
                      </button>

                      <button
                        onClick={() => handleCancelTicket(pass._id)}
                        disabled={actionLoading}
                        className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                        title={t('cancelAndRefund', 'Cancel & Refund')}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
            <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider mb-4">
              {t('pastAndCancelledBookings', 'Past & Cancelled Bookings')}
            </h3>
            {pastPasses.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                {t('noPastBookings', 'No past or cancelled bookings in your travel history.')}
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {pastPasses.map((pass) => (
                  <div key={pass._id || pass.ticketCode} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        {locTerminal(pass.from)} ➔ {locTerminal(pass.to)}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {t('dateLabel', 'Date:')} {formatDate(pass.date)} • {t('referenceLabel', 'Reference:')} <span className="font-mono">{pass.bookingReference || pass.ticketCode}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        pass.status === 'cancelled' || pass.status === 'refunded'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {locStatus(pass.status)}
                      </span>
                      <span className="font-bold text-slate-800">
                        {formatCurrency(pass.pricing?.totalAmount || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL: FULL TICKET BARCODE PASS */}
        {selectedPassModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
            <div className="printable-ticket relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              
              <div className="bg-gradient-to-r from-[#003366] to-[#005a9c] p-6 text-white relative">
                <button
                  onClick={() => setSelectedPassModal(null)}
                  className="no-print absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                  {t('cityTransitWaterfront', 'City of Toronto PF&R • Waterfront Transit')}
                </div>
                <h3 className="text-xl font-black mt-1">
                  {t('officialBoardingPass', 'Official Ferry Boarding Pass')}
                </h3>
                <div className="text-xs text-blue-200 mt-0.5">
                  {locTerminal(selectedPassModal.from)} ➔ {locTerminal(selectedPassModal.to)} • {formatDate(selectedPassModal.date)}
                </div>
              </div>

              <div className="p-6 text-center">
                <div id="ticket-qr-code" className="p-4 bg-white border-2 border-slate-900 rounded-3xl shadow-sm inline-block mx-auto mb-4">
                  <QRCodeSVG
                    value={selectedPassModal.qrPayload || `TORONTO-ISLAND-FERRY:${selectedPassModal.ticketCode}:VALID`}
                    size={170}
                    level="H"
                  />
                  <div className="font-mono text-xs font-bold text-slate-700 mt-2">
                    {selectedPassModal.ticketCode}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('leadPassenger', 'Lead Passenger:')}</span>
                    <span className="font-bold text-slate-900">
                      {selectedPassModal.contactName || selectedPassModal.passengerDetails?.[0]?.fullName || currentUser.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('crossingRoute', 'Crossing Route:')}</span>
                    <span className="font-bold text-slate-900">
                      {locTerminal(selectedPassModal.from)} ➔ {locTerminal(selectedPassModal.to)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('tripType', 'Trip Type')}:</span>
                    <span className="font-bold text-slate-900 capitalize">
                      {locTripType(selectedPassModal.tripType)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{t('bookingReference', 'Booking Reference:')}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {selectedPassModal.bookingReference || selectedPassModal.ticketCode}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1.5 mt-1.5">
                    <span className="text-slate-500">{t('fareAndGstTotal', 'Fare & GST Total:')}</span>
                    <span className="font-black text-orange-600 text-sm">
                      {formatCurrency(selectedPassModal.pricing?.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                <div className="no-print flex items-center justify-between gap-2.5">
                  <button
                    onClick={handlePrint}
                    className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{t('printTicket', 'Print Ticket')}</span>
                  </button>

                  <button
                    onClick={() => downloadTicketPdf({
                      booking: selectedPassModal,
                      passengerName: selectedPassModal.contactName || currentUser.name,
                      passengerEmail: selectedPassModal.contactEmail || currentUser.email,
                      lang: language
                    })}
                    className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('downloadPdf', 'Download PDF')}</span>
                  </button>

                  <button
                    onClick={() => setSelectedPassModal(null)}
                    className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                  >
                    {t('close', 'Close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
