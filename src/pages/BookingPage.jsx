import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FARES } from '../data/ferryData';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import { QRCodeSVG } from 'qrcode.react';
import {
  Ticket,
  MapPin,
  Compass,
  Users,
  CreditCard,
  CheckCircle2,
  Download,
  Printer,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Plus,
  Minus,
  QrCode,
  Info,
  Smartphone,
  AlertCircle,
  LogIn,
  ArrowLeftRight
} from 'lucide-react';
import { downloadTicketPdf } from '../utils/ticketPdf';

const TERMINAL_OPTIONS = [
  'Jack Layton Ferry Terminal',
  'Centre Island',
  "Hanlan's Point",
  "Ward's Island"
];

export default function BookingPage() {
  const {
    prefilledBooking,
    navigateTo,
    currentUser,
    isAuthenticated,
    openAuthModal,
    pricingSettings,
    loadUserBookings,
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

  const isFr = language === 'FR';

  const [step, setStep] = useState(1); // 1: Trip Selection, 2: Passengers, 3: Details, 4: Payment, 5: Confirmed Pass

  // Booking Form State
  const [tripType, setTripType] = useState(prefilledBooking?.tripType || 'round');
  const [fromTerminal, setFromTerminal] = useState(prefilledBooking?.from || 'Jack Layton Ferry Terminal');
  const [toTerminal, setToTerminal] = useState(prefilledBooking?.to || 'Centre Island');
  const [departureDate, setDepartureDate] = useState(prefilledBooking?.date || new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(isFr ? '15:45 (Traversée prévue)' : '15:45 (Scheduled Run)');

  // Passenger counts
  const [adults, setAdults] = useState(prefilledBooking?.adults !== undefined ? prefilledBooking.adults : 1);
  const [seniors, setSeniors] = useState(prefilledBooking?.seniors || 0);
  const [youth, setYouth] = useState(0);
  const [juniors, setJuniors] = useState(prefilledBooking?.children || 0);
  const [infants, setInfants] = useState(0);
  const [bicycles, setBicycles] = useState(prefilledBooking?.bicycles || 0);

  // Lead passenger details
  const [passengerName, setPassengerName] = useState(currentUser?.name || '');
  const [passengerEmail, setPassengerEmail] = useState(currentUser?.email || '');
  const [passengerPhone, setPassengerPhone] = useState(currentUser?.phone || '');
  
  // Accompanying passenger names for multi-passenger bookings
  const [additionalPassengers, setAdditionalPassengers] = useState([]);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState('card-simulator'); // 'card-simulator' | 'presto'
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Generated pass state from MongoDB
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync authenticated user details
  useEffect(() => {
    if (currentUser) {
      if (!passengerName) setPassengerName(currentUser.name || '');
      if (!passengerEmail) setPassengerEmail(currentUser.email || '');
      if (currentUser.phone && !passengerPhone) setPassengerPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Pricing values from DB settings or fallback
  const activeFares = pricingSettings?.fares || FARES;
  const taxRate = pricingSettings?.taxPercent !== undefined ? pricingSettings.taxPercent : 5.0;
  const taxLabel = pricingSettings?.taxLabel || 'GST';
  const currency = pricingSettings?.currency || 'CAD';
  const harbourFeeRate = pricingSettings?.harbourFee !== undefined ? pricingSettings.harbourFee : 0.75;

  const totalPassengers = adults + seniors + youth + juniors + infants;

  // Keep additional passengers array in sync with extra passenger count
  useEffect(() => {
    const extraCount = Math.max(0, totalPassengers - 1);
    setAdditionalPassengers((prev) => {
      const next = [...prev];
      while (next.length < extraCount) {
        next.push({ name: '', type: isFr ? 'Passager accompagnateur' : 'Accompanying Passenger' });
      }
      return next.slice(0, extraCount);
    });
  }, [totalPassengers, isFr]);

  const tripMultiplier = tripType === 'round' ? 2 : 1;
  const subtotalSingle = (
    (adults * (activeFares.adult?.price || 9.11)) +
    (seniors * (activeFares.senior?.price || 5.86)) +
    (youth * (activeFares.youth?.price || 5.86)) +
    (juniors * (activeFares.junior?.price || 4.29)) +
    (infants * (activeFares.infant?.price || 0))
  );

  const baseFare = parseFloat((subtotalSingle * tripMultiplier).toFixed(2));
  const calculatedTax = parseFloat((baseFare * (taxRate / 100)).toFixed(2));
  const harbourFee = baseFare > 0 ? harbourFeeRate : 0;
  const totalAmount = parseFloat((baseFare + calculatedTax + harbourFee).toFixed(2));

  // Swap terminals handler
  const handleSwapTerminals = () => {
    const temp = fromTerminal;
    setFromTerminal(toTerminal);
    setToTerminal(temp);
  };

  // Final Submit: Persist Booking to MongoDB with Verified Authenticated Ownership
  const handleCompletePayment = async (e) => {
    e.preventDefault();
    setBookingError('');

    if (!isAuthenticated) {
      openAuthModal('login', 'booking');
      return;
    }

    if (fromTerminal === toTerminal) {
      setBookingError(isFr 
        ? 'Les terminaux de départ et d’arrivée ne peuvent pas être identiques. Veuillez choisir des terminaux distincts.' 
        : 'Origin and destination terminals cannot be identical. Please choose distinct terminals.');
      return;
    }

    if (totalPassengers === 0) {
      setBookingError(isFr 
        ? 'Veuillez sélectionner au moins un billet de passager avant de procéder au paiement.' 
        : 'Please select at least one passenger ticket before checking out.');
      return;
    }

    if (!passengerName.trim() || !passengerEmail.trim()) {
      setBookingError(isFr 
        ? 'Veuillez fournir le nom et l’adresse courriel du passager principal.' 
        : 'Please provide lead passenger name and email address.');
      return;
    }

    setIsProcessing(true);

    try {
      const fullPassengerDetails = [
        { fullName: passengerName.trim(), type: isFr ? 'Passager principal' : 'Lead Passenger', isLead: true },
        ...additionalPassengers.map((p, idx) => ({
          fullName: p.name.trim() || `${isFr ? 'Passager' : 'Passenger'} ${idx + 2}`,
          type: isFr ? 'Passager accompagnateur' : 'Accompanying Passenger',
          isLead: false
        }))
      ];

      const payload = {
        from: fromTerminal,
        to: toTerminal,
        date: departureDate,
        departureTime: timeSlot,
        tripType,
        adults,
        seniors,
        youth,
        juniors,
        infants,
        bicycles,
        contactName: passengerName.trim(),
        contactEmail: passengerEmail.trim(),
        contactPhone: passengerPhone.trim(),
        passengerDetails: fullPassengerDetails,
        paymentMethod
      };

      const res = await api.bookings.create(payload);

      if (res.booking) {
        setConfirmedBooking(res.booking);
        loadUserBookings(); // refresh user dashboard
        setStep(5);

        // Confetti burst
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // ignore confetti if blocked
        }
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setBookingError(err.message || (isFr ? 'Échec de la réservation. Veuillez réessayer.' : 'Failed to complete booking. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    if (confirmedBooking) {
      downloadTicketPdf({
        booking: confirmedBooking,
        passengerName: passengerName.trim(),
        passengerEmail: passengerEmail.trim(),
        lang: language
      });
    }
  };

  // If user is not logged in, show authentication prompt card without exposed credentials
  if (!isAuthenticated && step < 5) {
    return (
      <div className="w-full bg-slate-50 min-h-screen py-12 px-4 md:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Ticket className="w-8 h-8" />
          </div>
          <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            {t('heroBadge', 'City of Toronto Official Ferry Ticketing')}
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
            {t('signInRequiredToBook', 'Sign In Required to Book Tickets')}
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {t('signInPromptBook', 'Please log in or register a free citizen account before completing a ferry ticket booking. Your tickets and QR passes will be safely saved to your personal transit registry.')}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => openAuthModal('login', 'booking')}
              className="w-full py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('passengerSignIn', 'Sign In to Continue Booking')}</span>
            </button>

            <button
              onClick={() => openAuthModal('register', 'booking')}
              className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('createCitizenAccount', 'Create New Citizen Account')}</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            {isFr ? 'Opérations du port ou administration municipale ? ' : 'Harbour Operations or Municipal Administrator? '}
            <button
              onClick={() => navigateTo('admin')}
              className="font-bold text-orange-600 hover:underline cursor-pointer"
            >
              {t('adminPortal', 'Access Admin Portal')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSameTerminal = fromTerminal === toTerminal;

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header Ribbon */}
        <div className="text-center max-w-2xl mx-auto mb-8 no-print">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{isFr ? 'Portail Officiel de Billetterie Municipale' : 'Official City Transit Fare Gateway'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t('heroTitle', 'Book Toronto Island Ferry Tickets')}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-2">
            {t('heroSubtitle', 'Instant digital barcodes valid at Jack Layton Ferry Terminal turnstiles. Return ferry crossings included with round-trip passes.')}
          </p>
        </div>

        {/* Step Progress Bar */}
        {step < 5 && (
          <div className="max-w-3xl mx-auto mb-10 no-print">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-orange-500 transition-all duration-300 z-0"
                style={{ width: `${((step - 1) / 3) * 100}%` }}
              ></div>

              {[
                { s: 1, label: isFr ? 'Trajet' : 'Trip Route' },
                { s: 2, label: isFr ? 'Passagers' : 'Passengers' },
                { s: 3, label: isFr ? 'Coordonnées' : 'Contact Info' },
                { s: 4, label: isFr ? 'Vérification et Paiement' : 'Review & Pay' }
              ].map((item) => (
                <div key={item.s} className="relative z-10 flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step >= item.s
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}>
                    {step > item.s ? '✓' : item.s}
                  </div>
                  <span className={`text-[11px] font-bold mt-1.5 hidden sm:inline ${
                    step >= item.s ? 'text-slate-900' : 'text-slate-400'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {bookingError && (
          <div className="max-w-2xl mx-auto mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 no-print">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* ================= STEP 1: TRIP ROUTE ================= */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-fade-in-up">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#004f8b]" />
              <span>{t('step1Title', 'Step 1: Select Crossing & Schedule')}</span>
            </h2>

            {/* Trip Type Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t('tripType', 'Trip Type')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTripType('round')}
                  className={`p-3.5 rounded-2xl text-xs font-bold transition-all border text-left pill-interactive cursor-pointer ${
                    tripType === 'round'
                      ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-extrabold text-sm">{t('roundTripReturnIncluded', 'Round Trip (Return Included)')}</div>
                  <div className="text-[11px] opacity-75 font-normal mt-0.5">
                    {isFr ? 'Traversier retour inclus depuis n’importe quel quai insulaire' : 'Return ferry included from any island dock'}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setTripType('single')}
                  className={`p-3.5 rounded-2xl text-xs font-bold transition-all border text-left pill-interactive cursor-pointer ${
                    tripType === 'single'
                      ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-extrabold text-sm">{t('singleTrip', 'Single Trip')}</div>
                  <div className="text-[11px] opacity-75 font-normal mt-0.5">
                    {isFr ? 'Billet pour une traversée simple standard' : 'Standard single departure ticket'}
                  </div>
                </button>
              </div>
            </div>

            {/* From & To Terminals with Swap Button */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-3 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t('departureTerminalOrigin', 'Departure Terminal (Origin)')}
                  </label>
                  <div className="relative">
                    <select
                      value={fromTerminal}
                      onChange={(e) => {
                        setFromTerminal(e.target.value);
                        setBookingError('');
                      }}
                      className="w-full p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-8 cursor-pointer input-interactive"
                    >
                      {TERMINAL_OPTIONS.map((term) => (
                        <option key={`from-${term}`} value={term}>{locTerminal(term)}</option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-blue-600 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex justify-center pb-1">
                  <button
                    type="button"
                    onClick={handleSwapTerminals}
                    title="Swap Origin & Destination"
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 border border-slate-200 transition-colors btn-interactive cursor-pointer"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t('destinationCrossing', 'Destination Crossing')}
                  </label>
                  <div className="relative">
                    <select
                      value={toTerminal}
                      onChange={(e) => {
                        setToTerminal(e.target.value);
                        setBookingError('');
                      }}
                      className="w-full p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none pr-8 cursor-pointer input-interactive"
                    >
                      {TERMINAL_OPTIONS.map((term) => (
                        <option key={`to-${term}`} value={term}>{locTerminal(term)}</option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-orange-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {isSameTerminal && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] flex items-center gap-2 animate-fade-in-down">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {isFr 
                      ? 'Les terminaux de départ et d’arrivée ne peuvent pas être identiques. Veuillez choisir des points de départ et d’arrivée distincts.' 
                      : 'Origin and destination terminals cannot be the same. Please choose different departure and arrival points.'}
                  </span>
                </div>
              )}
            </div>

            {/* Date & Departure Slot */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t('travelDate', 'Travel Date')}
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer input-interactive"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t('scheduledTimeSlot', 'Scheduled Sailing Time Slot')}
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer input-interactive"
                >
                  <option value="15:45 (Scheduled Run)">{isFr ? 'Départ 15 h 45 • MV Sam McBride' : '15:45 Departure • MV Sam McBride'}</option>
                  <option value="16:00 (Scheduled Run)">{isFr ? 'Départ 16 h 00 • MV Thomas Rennie' : '16:00 Departure • MV Thomas Rennie'}</option>
                  <option value="16:15 (Scheduled Run)">{isFr ? 'Départ 16 h 15 • MV William Inglis' : '16:15 Departure • MV William Inglis'}</option>
                  <option value="16:30 (Scheduled Run)">{isFr ? 'Départ 16 h 30 • MV Sam McBride' : '16:30 Departure • MV Sam McBride'}</option>
                  <option value="17:00 (Evening Peak)">{isFr ? 'Départ 17 h 00 • Service de pointe' : '17:00 Departure • Peak Service'}</option>
                  <option value="Any Time (Open Ticket)">{isFr ? 'Toute traversée régulière (Billet ouvert même jour)' : 'Any Regular Sailing (Open Same-Day Boarding)'}</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                disabled={isSameTerminal}
                onClick={() => setStep(2)}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 btn-interactive cursor-pointer"
              >
                <span>{t('continueToStep2', 'Continue to Passenger Tickets')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: PASSENGERS ================= */}
        {step === 2 && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-fade-in-up">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#004f8b]" />
              <span>{t('step2Title', 'Select Passenger Tickets')}</span>
            </h2>

            <div className="space-y-4 mb-8">
              {/* Adult */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 card-interactive">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{t('adults', 'Adult')}</div>
                  <div className="text-[11px] text-slate-500">{t('adultsAge', 'Ages 20 – 64')}</div>
                  <div className="text-xs font-bold text-orange-600 mt-0.5">
                    {formatCurrency(activeFares.adult?.price || 9.11)} {tripType === 'round' ? (isFr ? '× 2 trajets' : '× 2 ways') : ''}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setAdults(Math.max(0, adults - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 btn-interactive cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-slate-900">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(adults + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 btn-interactive cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Senior */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{t('seniors', 'Senior')}</div>
                  <div className="text-[11px] text-slate-500">{t('seniorsAge', 'Ages 65+')}</div>
                  <div className="text-xs font-bold text-orange-600 mt-0.5">
                    {formatCurrency(activeFares.senior?.price || 5.86)} {tripType === 'round' ? (isFr ? '× 2 trajets' : '× 2 ways') : ''}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setSeniors(Math.max(0, seniors - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-slate-900">{seniors}</span>
                  <button
                    type="button"
                    onClick={() => setSeniors(seniors + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Youth (15-19) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{t('youth', 'Youth')}</div>
                  <div className="text-[11px] text-slate-500">{t('youthAge', 'Ages 15 – 19')}</div>
                  <div className="text-xs font-bold text-orange-600 mt-0.5">
                    {formatCurrency(activeFares.youth?.price || 5.86)} {tripType === 'round' ? (isFr ? '× 2 trajets' : '× 2 ways') : ''}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setYouth(Math.max(0, youth - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-slate-900">{youth}</span>
                  <button
                    type="button"
                    onClick={() => setYouth(youth + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Junior / Child (2-14) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{t('children', 'Children')}</div>
                  <div className="text-[11px] text-slate-500">{t('childrenAge', 'Ages 2 – 14')}</div>
                  <div className="text-xs font-bold text-orange-600 mt-0.5">
                    {formatCurrency(activeFares.junior?.price || 4.29)} {tripType === 'round' ? (isFr ? '× 2 trajets' : '× 2 ways') : ''}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setJuniors(Math.max(0, juniors - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-slate-900">{juniors}</span>
                  <button
                    type="button"
                    onClick={() => setJuniors(juniors + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Infant (< 2) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{t('infants', 'Infant')}</div>
                  <div className="text-[11px] text-slate-500">{t('infantsAge', 'Under 2 Years (Free Pass Required)')}</div>
                  <div className="text-xs font-bold text-emerald-600 mt-0.5">{t('free', 'FREE')} ({formatCurrency(0)})</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setInfants(Math.max(0, infants - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-slate-900">{infants}</span>
                  <button
                    type="button"
                    onClick={() => setInfants(infants + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Bicycle */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div>
                  <div className="font-extrabold text-xs text-slate-900">{t('bicyclesStrollers', 'Bicycles & Strollers')}</div>
                  <div className="text-[11px] text-slate-500">{t('bicyclesDesc', 'Free transport with accompanied passenger ticket')}</div>
                  <div className="text-xs font-bold text-emerald-600 mt-0.5">{t('free', 'FREE')} ({formatCurrency(0)})</div>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setBicycles(Math.max(0, bicycles - 1))}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 flex items-center justify-center font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center font-black text-sm text-slate-900">{bicycles}</span>
                  <button
                    type="button"
                    onClick={() => setBicycles(bicycles + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold hover:bg-orange-600 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subtotal bar */}
            <div className="p-4 bg-orange-50 rounded-2xl border border-orange-200 mb-6 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-orange-800 font-bold">
                  {isFr ? `Tarif de base estimé (${totalPassengers} passagers) :` : `Estimated Base Fare (${totalPassengers} Passengers):`}
                </div>
                <div className="text-xl font-black text-orange-950">{formatCurrency(baseFare)}</div>
              </div>
              <div className="text-[11px] text-orange-700 text-right">
                {isFr ? `Comprend le tarif ${tripType === 'round' ? 'aller-retour' : 'aller simple'}` : `Includes ${tripType === 'round' ? 'Round Trip' : 'Single'} Fare`}<br />
                <span className="text-[10px] text-orange-600 font-medium">
                  + {taxLabel} ({taxRate}%) {isFr ? 'calculé au paiement' : 'calculated at checkout'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {t('back', 'Back')}
              </button>
              <button
                type="button"
                disabled={totalPassengers === 0}
                onClick={() => setStep(3)}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>{t('continueToStep3', 'Continue to Passenger Details')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: DETAILS ================= */}
        {step === 3 && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-fade-in-up">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#004f8b]" />
              <span>{t('step3Title', 'Lead Passenger & Contact Information')}</span>
            </h2>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('fullName', 'Lead Passenger Full Name')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder={isFr ? 'ex. Maya Patel' : 'e.g. Maya Patel'}
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 input-interactive"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('emailAddress', 'Email Address (For Digital Pass Delivery)')} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    placeholder="maya.patel@example.ca"
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 input-interactive"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneLabel', 'Mobile Phone Number')}</label>
                  <input
                    type="tel"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="416-555-0194"
                    className="w-full p-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 input-interactive"
                  />
                </div>
              </div>

              {/* Accompanying Passengers Multi-Passenger Form */}
              {additionalPassengers.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    {isFr 
                      ? `Noms des passagers accompagnateurs (${additionalPassengers.length} voyageur${additionalPassengers.length > 1 ? 's' : ''} supplémentaire${additionalPassengers.length > 1 ? 's' : ''})`
                      : `Accompanying Passenger Names (${additionalPassengers.length} Additional Traveler${additionalPassengers.length > 1 ? 's' : ''})`
                    }
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3">
                    {t('accompanyingPassengerNotice', 'Enter the names of all passengers traveling on this booking for individual manifest records.')}
                  </p>
                  <div className="space-y-2.5">
                    {additionalPassengers.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 w-24 shrink-0">
                          {isFr ? `Passager n° ${idx + 2} :` : `Passenger #${idx + 2}:`}
                        </span>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const copy = [...additionalPassengers];
                            copy[idx] = { ...copy[idx], name: e.target.value };
                            setAdditionalPassengers(copy);
                          }}
                          placeholder={isFr ? `Nom complet du passager ${idx + 2}` : `Passenger ${idx + 2} Full Name`}
                          className="flex-1 p-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 input-interactive"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-[11px] text-blue-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  {isFr
                    ? `Les codes-barres des billets et les reçus PDF seront associés à votre compte citoyen vérifié (${currentUser?.email}).`
                    : `Ticket barcodes and PDF receipts will be linked to your authenticated citizen account (${currentUser?.email}).`
                  }
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs btn-interactive cursor-pointer"
              >
                {t('back', 'Back')}
              </button>
              <button
                type="button"
                disabled={!passengerName.trim() || !passengerEmail.trim()}
                onClick={() => setStep(4)}
                className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50 btn-interactive cursor-pointer"
              >
                <span>{t('continueToStep4', 'Proceed to Review & Payment')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: REVIEW & PAYMENT ================= */}
        {step === 4 && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 animate-fade-in-up">
            <h2 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#004f8b]" />
              <span>{t('step4Title', 'Step 4: Fare Review & Payment Clearance')}</span>
            </h2>

            {/* Itemized Fare & GST Breakdown */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                {t('orderSummary', 'Itemized Fare Breakdown')}
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>{t('crossingRoute', 'Ferry Crossing:')}</span>
                  <span className="font-bold">{locTerminal(fromTerminal)} ➔ {locTerminal(toTerminal)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{t('tripType', 'Trip Direction:')}</span>
                  <span className="font-bold capitalize">{locTripType(tripType)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{t('totalPassengers', 'Passenger Count:')}</span>
                  <span className="font-bold">
                    {totalPassengers} {t('passengerCountSuffix', 'Passengers')} ({adults} Ad, {seniors} Sn, {youth} Yth, {juniors} Jr, {infants} Inf)
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{t('baseFare', 'Base Fare:')}</span>
                  <span className="font-bold">{formatCurrency(baseFare)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{taxLabel} ({taxRate}%):</span>
                  <span className="font-bold text-orange-600">{formatCurrency(calculatedTax)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>{t('harbourFee', 'Municipal Harbour Facilities Fee:')}</span>
                  <span className="font-bold">{formatCurrency(harbourFee)}</span>
                </div>

                <div className="border-t border-slate-200 pt-2.5 mt-2.5 flex justify-between items-center text-sm">
                  <span className="font-black text-slate-900">{t('totalDue', 'Total Payable Amount:')}</span>
                  <span className="font-black text-xl text-orange-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                {isFr ? 'Sélectionnez le mode de paiement' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card-simulator')}
                  className={`p-3.5 rounded-2xl text-xs font-bold transition-all border text-left flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'card-simulator'
                      ? 'bg-blue-50 border-[#004f8b] text-[#004f8b] shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-black">{t('payWithCard', 'Credit / Debit Card')}</div>
                    <div className="text-[10px] text-slate-500">
                      {isFr ? 'Validation instantanée en mode test' : 'Instant Test Mode Clearance'}
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('presto')}
                  className={`p-3.5 rounded-2xl text-xs font-bold transition-all border text-left flex items-center justify-between cursor-pointer ${
                    paymentMethod === 'presto'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <div>
                    <div className="font-black">{t('payWithPresto', 'PRESTO Card / Transit Pass')}</div>
                    <div className="text-[10px] text-slate-500">
                      {isFr ? 'Simulateur de transport en commun sans contact' : 'Tap-to-Pay City Transit Simulator'}
                    </div>
                  </div>
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                </button>
              </div>

              <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isFr
                    ? 'Mode de paiement : Environnement de test autorisé. Les transactions sont enregistrées dans MongoDB et génèrent de véritables codes-barres vérifiables.'
                    : 'Payment Mode: Authorized Test Environment. Transactions are recorded in MongoDB and generate genuine verifiable barcodes.'
                  }
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                {t('back', 'Back')}
              </button>
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleCompletePayment}
                className="px-8 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/25 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('confirmAndPay', 'Confirm & Generate Digital Pass')} ({formatCurrency(totalAmount)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 5: CONFIRMED PASS ================= */}
        {step === 5 && confirmedBooking && (
          <div className="max-w-2xl mx-auto">
            {/* Success Alert Banner (Suppressed in Print) */}
            <div className="no-print bg-emerald-500 text-white p-4 rounded-3xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in-down">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-base">
                    {isFr ? 'Réservation confirmée et enregistrée dans MongoDB !' : 'Booking Confirmed & Persisted in MongoDB!'}
                  </h3>
                  <p className="text-xs text-emerald-100">
                    {t('ticketCode', 'Ticket Code')}: <strong>{confirmedBooking.ticketCode}</strong> • {t('bookingRef', 'Ref')}: <strong>{confirmedBooking.bookingReference}</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 font-bold text-xs hover:bg-emerald-50 flex items-center gap-1.5 btn-interactive cursor-pointer shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t('printTicket', 'Print Ticket')}</span>
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 btn-interactive cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t('downloadPdf', 'Download PDF')}</span>
                </button>
              </div>
            </div>

            {/* Official Digital Boarding Pass Card - ISOLATED IN PRINT MODE */}
            <div id="printable-ticket" className="printable-ticket bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative animate-scale-in">
              {/* Ticket Top Marine Band */}
              <div className="bg-gradient-to-r from-[#003366] to-[#005a9c] p-6 text-white flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    {t('cityTransitWaterfront', 'City of Toronto PF&R • Waterfront Transit')}
                  </div>
                  <h2 className="text-xl font-black tracking-tight mt-0.5">
                    {t('officialBoardingPass', 'Official Ferry Boarding Pass')}
                  </h2>
                  <div className="text-xs text-blue-100 mt-0.5">
                    {locTripType(confirmedBooking.tripType)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-blue-200 uppercase font-mono">{t('status', 'Status')}</div>
                  <div className="bg-emerald-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full inline-block mt-1">
                    {t('validPass', 'VALID PASS')}
                  </div>
                </div>
              </div>

              {/* Pass Body with Verified QR Code */}
              <div className="p-6 md:p-8 relative">
                {/* Physical Ticket Perforation Cutout Notches */}
                <div className="ticket-notch-left hidden sm:block"></div>
                <div className="ticket-notch-right hidden sm:block"></div>

                <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-dashed border-slate-300">
                  {/* Real Verified QR Code with Holographic Laser Scanline */}
                  <div id="ticket-qr-code" className="p-3 bg-white border-2 border-slate-800 rounded-2xl shadow-sm flex flex-col items-center relative overflow-hidden group">
                    {/* Laser Scanline Micro-Interaction */}
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-scanline pointer-events-none"></div>

                    <QRCodeSVG
                      value={confirmedBooking.qrPayload || `TORONTO-ISLAND-FERRY:${confirmedBooking.ticketCode}:VALID`}
                      size={150}
                      level="H"
                      includeMargin={false}
                    />
                    <div className="mt-2 flex items-center justify-between w-full text-[10px] font-mono font-bold text-slate-700">
                      <span>{confirmedBooking.ticketCode}</span>
                      <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {isFr ? 'VÉRIFIÉ' : 'VERIFIED'}
                      </span>
                    </div>
                  </div>

                  {/* Trip Details Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-4 text-xs w-full">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{t('leadPassenger', 'Lead Passenger')}</div>
                      <div className="font-extrabold text-slate-900 text-sm mt-0.5">{passengerName}</div>
                      <div className="text-[11px] text-slate-500">{passengerEmail}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{t('travelDate', 'Travel Date')}</div>
                      <div className="font-extrabold text-slate-900 text-sm mt-0.5">{formatDate(confirmedBooking.date)}</div>
                      <div className="text-[11px] text-slate-500">{confirmedBooking.departureTime}</div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{t('crossingRoute', 'Crossing Route')}</div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {locTerminal(confirmedBooking.from)} ➔ {locTerminal(confirmedBooking.to)}
                      </div>
                      <div className="text-[11px] text-blue-700 font-bold">
                        {confirmedBooking.gate ? confirmedBooking.gate.replace('Gate', isFr ? 'Porte' : 'Gate') : (isFr ? 'Porte 2' : 'Gate 2')}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">{t('totalPassengers', 'Passengers & Fares')}</div>
                      <div className="font-bold text-slate-800 mt-0.5">
                        {confirmedBooking.passengers} {t('passengerCountSuffix', 'Total Passengers')}
                      </div>
                      <div className="text-[11px] text-orange-600 font-bold">
                        {t('totalDue', 'Total Paid')}: {formatCurrency(confirmedBooking.pricing?.totalAmount || 0)} (incl. {taxLabel})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Passengers List if multi-passenger */}
                {confirmedBooking.passengerDetails && confirmedBooking.passengerDetails.length > 1 && (
                  <div className="py-3 border-b border-slate-100 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">{isFr ? 'Manifeste des passagers accompagnateurs : ' : 'Accompanying Manifest: '}</span>
                    {confirmedBooking.passengerDetails.slice(1).map((p, i) => (
                      <span key={i} className="inline-block bg-slate-100 px-2 py-0.5 rounded-md mr-1.5 mt-1 font-medium">
                        {p.fullName || `${isFr ? 'Passager' : 'Passenger'} ${i + 2}`}
                      </span>
                    ))}
                  </div>
                )}

                {/* Turnstile Instructions */}
                <div className="mt-6 pt-2 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-slate-400 shrink-0" />
                    <span>{t('scanAtGate', 'Hold barcode against Jack Layton terminal turnstile optical reader upon arrival.')}</span>
                  </div>
                  <div className="no-print flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => navigateTo('dashboard')}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#004f8b] hover:bg-[#003d6d] text-white font-bold text-xs shadow-sm transition-all text-center cursor-pointer"
                    >
                      {t('viewInAccount', 'View in My Account')}
                    </button>
                    <button
                      onClick={() => {
                        setConfirmedBooking(null);
                        setStep(1);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center cursor-pointer"
                    >
                      {t('bookAnotherPass', 'Book Another Ticket')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
