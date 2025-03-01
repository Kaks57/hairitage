
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Check if user is authenticated (in a real application, this would use your auth system)
  const isAuthenticated = localStorage.getItem('heritage_user') !== null;
  const userType = localStorage.getItem('heritage_user_type') || 'client';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Notre équipe', path: '/team' },
    { name: 'Contact', path: '/contact' },
    ...(isAuthenticated && userType === 'client' ? [{ name: 'Mes rendez-vous', path: '/appointments' }] : []),
    ...(isAuthenticated && userType === 'stylist' ? [{ name: 'Dashboard', path: '/stylist-dashboard' }] : []),
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Logo onClick={closeMenu} />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-heritage-purple relative group ${
                    location.pathname === link.path ? 'text-heritage-purple' : 'text-heritage-dark-gray'
                  }`}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-heritage-purple transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></span>
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full p-2 transition-colors hover:bg-secondary"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              {isAuthenticated ? (
                <Link to="/profile">
                  <Button variant="ghost" className="font-medium">
                    Profile
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="outline" className="border-heritage-purple text-heritage-purple hover:bg-heritage-purple hover:text-white transition-all duration-300">
                    Connexion
                  </Button>
                </Link>
              )}
              
              {!isAuthenticated && (
                <Link to="/signup">
                  <Button className="bg-heritage-purple text-white hover:bg-heritage-dark-purple transition-all duration-300">
                    Inscription
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="mr-4 rounded-full p-2 transition-colors hover:bg-secondary"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={toggleMenu}
              className="text-heritage-dark-gray p-2 focus:outline-none"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 bg-background z-40 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
        style={{ top: "60px" }}
      >
        <div className="flex flex-col h-full p-8 space-y-8">
          <div className="flex flex-col space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-lg font-medium transition-colors hover:text-heritage-purple ${
                  location.pathname === link.path ? 'text-heritage-purple' : 'text-heritage-dark-gray'
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="pt-6 mt-auto border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <Link to="/profile" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start font-medium">
                  Profile
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="outline" className="w-full mb-3 border-heritage-purple text-heritage-purple hover:bg-heritage-purple hover:text-white">
                    Connexion
                  </Button>
                </Link>
                <Link to="/signup" onClick={closeMenu}>
                  <Button className="w-full bg-heritage-purple text-white hover:bg-heritage-dark-purple">
                    Inscription
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
