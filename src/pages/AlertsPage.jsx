import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Wind, 
  Waves, 
  Sun, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  Mail, 
  Smartphone, 
  Radio, 
  Info,
  ChevronRight
} from 'lucide-react';

export default function AlertsPage() {
  const { alerts, navigateTo, t, locStatus, locRoute, language } = useApp();

  const [filterSeverity, setFilterSeverity] = useState('all');
  const [subPhone, setSubPhone] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!subPhone && !subEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setSubPhone('');
      setSubEmail('');
      alert(language === 'fr' 
        ? 'Abonnement confirmé ! Vous recevrez des alertes SMS et courriel immédiates pour les retards du traversier des îles de Toronto.' 
        : 'Subscription confirmed! You will receive instant SMS and email bulletins for Toronto Island ferry delays.');
    }, 1200);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="pb-6 mb-8 border-b border-slate-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#004f8b] uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>{t('marineBulletinsBadge')}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            {t('serviceAlertsTitle')}
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            {t('serviceAlertsSubtitle')}
          </p>
        </div>

        {/* 1. Lake Ontario Meteorological Telemetry */}
        <div className="bg-gradient-to-tr from-[#002d54] to-[#004f8b] text-white rounded-3xl p-6 md:p-8 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/20">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest bg-emerald-400 text-slate-950 px-2.5 py-1 rounded-full">
                {t('environmentCanadaStation')}
              </span>
              <h2 className="text-xl md:text-2xl font-black mt-2">
                {t('lakeOntarioTelemetry')}
              </h2>
            </div>
            <div className="text-xs text-blue-200">
              {language === 'fr' ? 'Mis à jour :' : 'Updated:'} <strong className="text-white">{language === 'fr' ? 'Toutes les 15 minutes' : 'Every 15 minutes'}</strong> • {language === 'fr' ? 'Statut :' : 'Status:'} <strong className="text-emerald-300">{language === 'fr' ? 'Navigation sécuritaire pour toutes les traversées' : 'Safe for All Sailings'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5 mb-1">
                <Wind className="w-4 h-4 text-cyan-300" />
                <span>{t('surfaceWind')}</span>
              </div>
              <div className="text-2xl font-black text-amber-300">{language === 'fr' ? '9 nœuds SSO' : '9 kts SSW'}</div>
              <div className="text-[10px] text-blue-200 mt-0.5">{language === 'fr' ? 'Rafales jusqu’à 12 nœuds' : 'Gusts up to 12 kts'}</div>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5 mb-1">
                <Waves className="w-4 h-4 text-blue-300" />
                <span>{t('waveSwell')}</span>
              </div>
              <div className="text-2xl font-black text-emerald-300">0.2 m</div>
              <div className="text-[10px] text-blue-200 mt-0.5">{language === 'fr' ? 'Port intérieur calme' : 'Calm inner harbour'}</div>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5 mb-1">
                <Sun className="w-4 h-4 text-amber-300" />
                <span>{language === 'fr' ? 'Temp. air et eau' : 'Air & Water Temp'}</span>
              </div>
              <div className="text-2xl font-black text-white">22° / 18°C</div>
              <div className="text-[10px] text-blue-200 mt-0.5">{language === 'fr' ? 'Traversée agréable' : 'Comfortable crossing'}</div>
            </div>

            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5 mb-1">
                <Radio className="w-4 h-4 text-purple-300" />
                <span>{language === 'fr' ? 'Visibilité / Brume' : 'Visibility / Fog'}</span>
              </div>
              <div className="text-2xl font-black text-white">10 km</div>
              <div className="text-[10px] text-blue-200 mt-0.5">{language === 'fr' ? 'Visibilité dégagée' : 'Clear line of sight'}</div>
            </div>
          </div>
        </div>

        {/* 2. Active Bulletins & Notices List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filter Pills */}
            <div className="flex items-center space-x-2 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase mr-2">{language === 'fr' ? 'Gravité :' : 'Severity:'}</span>
              <button
                onClick={() => setFilterSeverity('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterSeverity === 'all' ? 'bg-[#004f8b] text-white' : 'bg-white border text-slate-600'
                }`}
              >
                {language === 'fr' ? 'Tous les bulletins' : 'All Bulletins'} ({alerts.length})
              </button>
              <button
                onClick={() => setFilterSeverity('advisory')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterSeverity === 'advisory' ? 'bg-amber-500 text-slate-900' : 'bg-white border text-slate-600'
                }`}
              >
                {language === 'fr' ? 'Avis' : 'Advisories'}
              </button>
              <button
                onClick={() => setFilterSeverity('normal')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  filterSeverity === 'normal' ? 'bg-emerald-600 text-white' : 'bg-white border text-slate-600'
                }`}
              >
                {language === 'fr' ? 'Normal' : 'Normal'}
              </button>
            </div>

            {/* List */}
            {filteredAlerts.map((alert) => {
              const alertMsg = alert.message || alert.body || '';
              const alertTime = alert.time || (alert.createdAt ? new Date(alert.createdAt).toLocaleDateString(language === 'fr' ? 'fr-CA' : 'en-CA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : (language === 'fr' ? 'Bulletin actif' : 'Active Bulletin'));
              const severityVal = (alert.severity || 'Advisory').toLowerCase();

              return (
                <div 
                  key={alert._id || alert.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        severityVal.includes('urgent') || severityVal.includes('warn')
                          ? 'bg-red-100 text-red-800'
                          : severityVal.includes('advisory') || severityVal.includes('peak')
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {locStatus(alert.severity)}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">• {locRoute(alert.route) || (language === 'fr' ? 'Tout le réseau' : 'System-Wide')}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{alertTime}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 mb-1">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {alertMsg}
                  </p>
                </div>
              );
            })}

          </div>

          {/* 3. SMS & Email Alert Notification Signup */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {t('subscribeAlertsTitle')}
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                {t('subscribeAlertsDesc')}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">{language === 'fr' ? 'Téléphone cellulaire (SMS)' : 'Mobile Phone (SMS)'}</label>
                  <input
                    type="tel"
                    placeholder="e.g. 416-555-0194"
                    value={subPhone}
                    onChange={(e) => setSubPhone(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#004f8b]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">{t('emailLabel')}</label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-[#004f8b]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={subscribed}
                  className="w-full py-3 rounded-xl bg-[#004f8b] hover:bg-blue-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>{subscribed ? (language === 'fr' ? 'Inscription en cours...' : 'Subscribing...') : t('subscribeButton')}</span>
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400">
              {language === 'fr' 
                ? 'Système d’alertes de la Ville de Toronto • Service gratuit • Désabonnement en tout temps en répondant STOP.' 
                : 'City of Toronto Municipal Alerts System • Free service • Unsubscribe anytime by replying STOP.'}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
