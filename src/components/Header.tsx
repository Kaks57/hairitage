import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Calendar, Home, Scissors, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Logo from './Logo';
import { useMediaQuery } from '@/hooks/use-mobile';

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ transparent = false }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('hairitage_user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('hairitage_user');
    setUser(null);
    toast.success('Déconnexion réussie');
    navigate('/');
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const closeMenu = () => {
    setIsOpen(false);
  };

  const headerClass = transparent 
    ? "fixed top-0 left-0 right-0 z-50 bg-transparent border-b border-orange-800/30" 
    : "fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-95 border-b border-orange-800/30 shadow-md";

  return (
    <header className={headerClass}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <Logo />
            </Link>
          </div>
          
          {/* Desktop menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-orange-200 hover:text-orange-400 px-2 py-1 rounded-md transition-colors">
              Accueil
            </Link>
            <Link to="/services" className="text-orange-200 hover:text-orange-400 px-2 py-1 rounded-md transition-colors">
              Services
            </Link>
            <Link to="/appointments" className="text-orange-200 hover:text-orange-400 px-2 py-1 rounded-md transition-colors">
              Rendez-vous
            </Link>
          </nav>
          
          {/* User menu / Login button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative text-orange-200 hover:text-orange-400 hover:bg-orange-950/50">
                    <Avatar className="h-8 w-8 rounded-full bg-orange-900 border border-orange-500">
                      <AvatarFallback className="bg-orange-900 text-white">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                        {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                      </AvatarFallback>
                    </Avatar>
                    <span className="ml-2">{user.firstName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black border border-orange-500 text-white">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-orange-800/50" />
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer hover:bg-orange-950"
                    onClick={() => navigate('/appointments')}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Mes rendez-vous</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer hover:bg-orange-950"
                    onClick={() => navigate('/stylist-dashboard')}
                  >
                    <Scissors className="mr-2 h-4 w-4" />
                    <span>Tableau de bord coiffeur</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-orange-800/50" />
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer hover:bg-orange-950 text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-orange-200 hover:text-orange-400 hover:bg-orange-950/50"
                >
                  Connexion
                </Button>
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Inscription
                </Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {user && isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2 text-orange-400 hover:bg-orange-950/50">
                    <Avatar className="h-8 w-8 rounded-full bg-orange-900 border border-orange-500">
                      <AvatarFallback className="bg-orange-900 text-white">
                        {user.firstName ? user.firstName.charAt(0).toUpperCase() : ''}
                        {user.lastName ? user.lastName.charAt(0).toUpperCase() : ''}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-black border border-orange-500 text-white">
                  <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                  <DropdownMenuItem className="flex items-center cursor-default">
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.firstName} {user.lastName}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-orange-800/50" />
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer hover:bg-orange-950 text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Déconnexion</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-orange-400 hover:text-white hover:bg-orange-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'} bg-black border-t border-orange-800/30`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium text-orange-200 hover:text-white hover:bg-orange-900"
            onClick={closeMenu}
          >
            <Home className="inline-block mr-2 h-4 w-4" />
            Accueil
          </Link>
          <Link 
            to="/services" 
            className="block px-3 py-2 rounded-md text-base font-medium text-orange-200 hover:text-white hover:bg-orange-900"
            onClick={closeMenu}
          >
            <Scissors className="inline-block mr-2 h-4 w-4" />
            Services
          </Link>
          <Link 
            to="/appointments" 
            className="block px-3 py-2 rounded-md text-base font-medium text-orange-200 hover:text-white hover:bg-orange-900"
            onClick={closeMenu}
          >
            <Calendar className="inline-block mr-2 h-4 w-4" />
            Rendez-vous
          </Link>
          <Link 
            to="/stylist-dashboard" 
            className="block px-3 py-2 rounded-md text-base font-medium text-orange-200 hover:text-white hover:bg-orange-900"
            onClick={closeMenu}
          >
            <Users className="inline-block mr-2 h-4 w-4" />
            Tableau de bord coiffeur
          </Link>
          
          {!user && (
            <div className="pt-4 pb-3 border-t border-orange-800/30">
              <div className="flex items-center px-3">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/login');
                    closeMenu();
                  }}
                  className="w-full justify-center text-orange-200 hover:text-white hover:bg-orange-900 mb-2"
                >
                  Connexion
                </Button>
              </div>
              <div className="flex items-center px-3">
                <Button 
                  onClick={() => {
                    navigate('/signup');
                    closeMenu();
                  }}
                  className="w-full justify-center bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Inscription
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
