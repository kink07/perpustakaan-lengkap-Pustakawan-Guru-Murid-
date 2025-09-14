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
  const [activeMenu, setActiveMenu] = useState<string | undefined>(undefined);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
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
          
          // Check hash routing after user is loaded
          const hash = window.location.hash;
          if (hash && hash.startsWith('#')) {
            const menuId = hash.substring(1); // Remove # from hash
            setActiveMenu(menuId);
            setCurrentPage('dashboard');
          } else {
            // Default to dashboard if user is logged in
            setCurrentPage('dashboard');
          }
        } else {
          // If no user found, ensure we're on the library page
          setCurrentUser(null);
          setCurrentPage('library');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadData();
  }, []);

  // Handle hash-based routing for navigation changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#') && currentUser && !isInitialLoad) {
        const menuId = hash.substring(1); // Remove # from hash
        setActiveMenu(menuId);
        setCurrentPage('dashboard');
      }
    };

    // Listen for hash changes (but not on initial load)
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentUser, isInitialLoad]);

  // Update hash URL when page or menu changes (but not on initial load)
  useEffect(() => {
    if (!isInitialLoad) {
      if (currentPage === 'library') {
        window.location.hash = '';
      } else if (currentPage === 'dashboard' && activeMenu) {
        window.location.hash = `#${activeMenu}`;
      } else if (currentPage === 'auth') {
        window.location.hash = '#auth';
      }
    }
  }, [currentPage, activeMenu, isInitialLoad]);

  const navigateToDashboard = () => {
    // Set initial active menu based on user role for dashboard
    let initialMenu = 'opac'; // Default
    if (currentUser?.role === 'student') {
      initialMenu = 'profile'; // Student dashboard starts with profile
    } else if (currentUser?.role === 'teacher') {
      initialMenu = 'profile'; // Teacher dashboard starts with profile
    } else if (currentUser?.role === 'librarian') {
      initialMenu = 'statistics'; // Librarian dashboard starts with statistics
    }
    
    setActiveMenu(initialMenu);
    setCurrentPage('dashboard');
  };

  const navigateToAuth = useCallback(() => {
    setCurrentPage('auth');
  }, []);

  const navigateToLibrary = useCallback(() => {
    setCurrentPage('library');
    setActiveMenu(undefined);
  }, []);

  const [bookRefreshTrigger, setBookRefreshTrigger] = useState(0);

  const handleBookAdded = useCallback(() => {
    // This will trigger a refresh of books in DigitalLibrary
    console.log('Book added, refreshing library...');
    setBookRefreshTrigger(prev => prev + 1);
  }, []);

  const handleNavigateToLibrary = useCallback(() => {
    setCurrentPage('library');
    setActiveMenu(undefined);
  }, []);

  const handleNavigateToOPAC = useCallback(() => {
    setCurrentPage('library');
    setActiveMenu(undefined);
  }, []);

  const handleNavigateToStatistics = useCallback(() => {
    setActiveMenu('statistics');
    setCurrentPage('dashboard');
  }, []);

  const handleLogin = async (user: User) => {
    try {
      setCurrentUser(user);
      
      // Set initial active menu based on user role for dashboard
      let initialMenu = 'opac'; // Default
      if (user.role === 'student') {
        initialMenu = 'profile'; // Student dashboard starts with profile
      } else if (user.role === 'teacher') {
        initialMenu = 'profile'; // Teacher dashboard starts with profile
      } else if (user.role === 'librarian') {
        initialMenu = 'statistics'; // Librarian dashboard starts with statistics
      }
      
      setActiveMenu(initialMenu);
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

  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser);
  };

  const handleMenuChange = (menuId: string) => {
    setActiveMenu(menuId);
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
          bookRefreshTrigger={bookRefreshTrigger}
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
          onUserUpdate={handleUserUpdate}
          onMenuChange={handleMenuChange}
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