import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import AuthModal from './components/AuthModal';

// Pages
import HomePage from './pages/HomePage';
import SchedulesPage from './pages/SchedulesPage';
import BookingPage from './pages/BookingPage';
import RouteMapsPage from './pages/RouteMapsPage';
import ParksTrailsPage from './pages/ParksTrailsPage';
import RecreationProgramsPage from './pages/RecreationProgramsPage';
import PermitsPage from './pages/PermitsPage';
import EventsNewsPage from './pages/EventsNewsPage';
import ContactSupportPage from './pages/ContactSupportPage';
import CustomerDashboardPage from './pages/CustomerDashboardPage';
import AdminPage from './pages/AdminPage';
import AlertsPage from './pages/AlertsPage';
import GlobalSearchModal from './components/GlobalSearchModal';

function AppContent() {
  const { 
    activePage, 
    authModalConfig, 
    closeAuthModal, 
    isSearchOpen, 
    setIsSearchOpen 
  } = useApp();

  const renderActivePage = () => {
    switch (activePage) {
      case 'schedules':
        return <SchedulesPage />;
      case 'booking':
        return <BookingPage />;
      case 'routes-map':
        return <RouteMapsPage />;
      case 'parks-trails':
        return <ParksTrailsPage />;
      case 'programs':
        return <RecreationProgramsPage />;
      case 'permits':
        return <PermitsPage />;
      case 'events-news':
        return <EventsNewsPage />;
      case 'contact':
        return <ContactSupportPage />;
      case 'dashboard':
        return <CustomerDashboardPage />;
      case 'admin':
        return <AdminPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 text-slate-800 transition-colors duration-200 overflow-x-hidden">
      <Header />
      <main className="flex-1 w-full overflow-x-hidden">
        <div key={activePage} className="page-transition-enter w-full">
          {renderActivePage()}
        </div>
      </main>
      <Footer />
      <MobileBottomNav />

      {/* Global Authentication Modal */}
      {authModalConfig.isOpen && (
        <AuthModal
          key={`auth-modal-${authModalConfig.tab}`}
          isOpen={authModalConfig.isOpen}
          onClose={closeAuthModal}
          initialTab={authModalConfig.tab}
          redirectTo={authModalConfig.redirectTo}
        />
      )}

      {/* Global Discoverability Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
