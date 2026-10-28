import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', redirectTo = null }) {
  const { handleLoginSuccess, navigateTo, t, language } = useApp();
  const [tab, setTab] = useState(initialTab); // 'login' | 'register'

  // Form states - always initialize empty
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Always initialize / reset fields cleanly when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen, initialTab]);

  const handleTabSwitch = (newTab) => {
    setTab(newTab);
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
    setSuccessMsg('');
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await api.auth.login(email, password);
        handleLoginSuccess(res.user, res.token);
        setSuccessMsg(t('loginSuccess', 'Logged in successfully!'));
        setTimeout(() => {
          onClose();
          if (redirectTo) {
            navigateTo(redirectTo);
          }
        }, 500);
      } else {
        const res = await api.auth.register(name, email, password, phone);
        handleLoginSuccess(res.user, res.token);
        setSuccessMsg(t('registerSuccess', 'Account created successfully! Welcome to Toronto Ferry Services.'));
        setTimeout(() => {
          onClose();
          if (redirectTo) {
            navigateTo(redirectTo);
          }
        }, 500);
      }
    } catch (err) {
      setError(err.message || t('authFailed', 'Authentication failed. Please verify your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-modal-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#003366] to-[#005a9c] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all btn-interactive cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>{t('torontoTransitPortal', 'Toronto City Transit Portal')}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
            {tab === 'login' ? t('signInYourAccount', 'Sign In to Your Account') : t('createCitizenAccount', 'Create Citizen Account')}
          </h2>
          <p className="text-xs text-blue-100/90 mt-1">
            {tab === 'login' 
              ? t('signInDesc', 'Access your saved ferry tickets, PRESTO passes, and booking history.') 
              : t('createAccountDesc', 'Join Toronto Island Ferry services for advance ticket purchases.')}
          </p>

          {/* Tab selector */}
          <div className="flex bg-white/15 p-1 rounded-xl mt-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleTabSwitch('login')}
              className={`flex-1 py-1.5 rounded-lg transition-all pill-interactive cursor-pointer ${
                tab === 'login' ? 'bg-white text-[#003366] shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              {t('signInTab', 'Sign In')}
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch('register')}
              className={`flex-1 py-1.5 rounded-lg transition-all pill-interactive cursor-pointer ${
                tab === 'register' ? 'bg-white text-[#003366] shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              {t('newAccountTab', 'New Account')}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-fade-in-down">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fade-in-down">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form 
            onSubmit={handleSubmit} 
            className="space-y-3.5"
            autoComplete="off"
            id="passenger-auth-form"
          >
            {tab === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('fullNameLabel', 'Full Name')}</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      id="passenger-register-name"
                      name="passenger_register_name"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('fullNamePlaceholder', 'e.g. Sarah Jenkins')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]/30 focus:border-[#004f8b] input-interactive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{t('phoneLabel', 'Phone Number (Optional)')}</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      id="passenger-register-phone"
                      name="passenger_register_phone"
                      autoComplete="off"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('phonePlaceholder', '416-555-0199')}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]/30 focus:border-[#004f8b] input-interactive"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('emailLabel', 'Email Address')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  id="passenger-auth-email"
                  name="passenger_auth_email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder', 'name@example.com')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]/30 focus:border-[#004f8b] input-interactive"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('passwordLabel', 'Password')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  id="passenger-auth-password"
                  name="passenger_auth_password"
                  autoComplete={tab === 'register' ? 'new-password' : 'current-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004f8b]/30 focus:border-[#004f8b] input-interactive"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 btn-interactive cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{tab === 'login' ? t('signInTab', 'Sign In') : (language === 'FR' ? 'Créer mon compte' : 'Create My Account')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Secure Portal Footer */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-600">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {language === 'FR' ? 'Compte de transport vérifié de la Ville de Toronto' : 'City of Toronto Verified Transit Account'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                onClose();
                navigateTo('admin');
              }}
              className="text-[#004f8b] hover:text-blue-800 font-bold hover:underline cursor-pointer"
            >
              {language === 'FR' ? 'Portail personnel et admin →' : 'Staff & Admin Portal →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
