import React, { useState, useEffect, useCallback } from 'react';
import { User } from './types/database';
import DigitalLibrary from './components/DigitalLibrary';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { databaseService } from './services/database';
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationSystem from './components/NotificationSystem';
import { useNotification } from './contexts/NotificationContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('library');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { notifications, removeNotification } = useNotification();

  // Load data from database on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Check if user is already logged in
        const user = await databaseService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const navigateToAuth = useCallback(() => {
    setCurrentPage('auth');
  }, []);

  const navigateToLibrary = useCallback(() => {
    setCurrentPage('library');
  }, []);

  const handleBookAdded = useCallback(() => {
    // This will trigger a refresh of books in DigitalLibrary
    console.log('Book added, refreshing library...');
  }, []);

  const handleNavigateToLibrary = useCallback(() => {
    setCurrentPage('library');
  }, []);

  const handleNavigateToOPAC = useCallback(() => {
    setCurrentPage('library');
  }, []);

  const [activeMenu, setActiveMenu] = useState<string | undefined>(undefined);

  const handleNavigateToStatistics = useCallback(() => {
    setActiveMenu('statistics');
    setCurrentPage('dashboard');
  }, []);

  const handleLogin = async (user: User) => {
    try {
    setCurrentUser(user);
    setCurrentPage('dashboard');
      
      // Log activity
      await databaseService.createActivity({
        user_id: user.id,
        type: 'login',
        description: `User ${user.name} logged in`,
      });
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleLogout = async () => {
    try {
      if (currentUser) {
        // Log activity
        await databaseService.createActivity({
          user_id: currentUser.id,
          type: 'logout',
          description: `User ${currentUser.name} logged out`,
        });
      }
      
      // Sign out from database
      await databaseService.signOut();
      
      setCurrentUser(null);
      setCurrentPage('library');
      setActiveMenu(undefined);
    } catch (error) {
      console.error('Error logging out:', error);
      // Still logout locally even if database call fails
    setCurrentUser(null);
    setCurrentPage('library');
    setActiveMenu(undefined);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data dari database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'library' && (
        <DigitalLibrary 
          currentUser={currentUser}
          onNavigateToDashboard={navigateToDashboard}
          onNavigateToAuth={navigateToAuth}
          onBookAdded={handleBookAdded}
          onNavigateToStatistics={handleNavigateToStatistics}
        />
      )}
      {currentPage === 'auth' && (
        <AuthPage 
          onLogin={handleLogin}
          onBack={navigateToLibrary}
        />
      )}
      {currentPage === 'dashboard' && currentUser && (
        <Dashboard 
          user={currentUser} 
          onLogout={handleLogout} 
          onNavigateToLibrary={handleNavigateToLibrary}
          onNavigateToOPAC={handleNavigateToOPAC}
          onBookAdded={handleBookAdded}
          dashboardType={currentUser.role as 'librarian' | 'teacher' | 'student'}
          initialActiveMenu={activeMenu}
        />
      )}
      
      {/* Global Notification System */}
      <NotificationSystem 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;