
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-16 border-t border-gray-100 dark:border-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-heritage-dark-gray dark:text-gray-400 max-w-md">
              Heritage Hair Salon vous offre un espace de beauté unique où expertise et élégance se rencontrent pour sublimer votre style.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-heritage-dark-gray hover:text-heritage-purple transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-heritage-dark-gray hover:text-heritage-purple transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-heritage-dark-gray hover:text-heritage-purple transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-heritage-dark-gray dark:text-white">Services</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Coupe Femme</Link></li>
              <li><Link to="/services" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Coupe Homme</Link></li>
              <li><Link to="/services" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Coloration</Link></li>
              <li><Link to="/services" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Soins</Link></li>
              <li><Link to="/services" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Coiffures de mariage</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-heritage-dark-gray dark:text-white">Liens rapides</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Accueil</Link></li>
              <li><Link to="/about" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">À propos</Link></li>
              <li><Link to="/team" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Notre équipe</Link></li>
              <li><Link to="/gallery" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Galerie</Link></li>
              <li><Link to="/contact" className="text-sm text-heritage-dark-gray hover:text-heritage-purple dark:text-gray-400 dark:hover:text-heritage-purple transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold mb-4 text-heritage-dark-gray dark:text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 text-heritage-purple mt-0.5" />
                <span className="text-sm text-heritage-dark-gray dark:text-gray-400">123 Boulevard de la Coiffure, 75001 Paris</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-heritage-purple" />
                <span className="text-sm text-heritage-dark-gray dark:text-gray-400">+33 1 23 45 67 89</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-heritage-purple" />
                <span className="text-sm text-heritage-dark-gray dark:text-gray-400">contact@heritage-salon.fr</span>
              </li>
              <li className="mt-4">
                <h4 className="text-sm font-medium mb-2 text-heritage-dark-gray dark:text-white">Horaires d'ouverture:</h4>
                <p className="text-sm text-heritage-dark-gray dark:text-gray-400">Lun-Sam: 9h - 19h<br />Dimanche: Fermé</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="py-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-sm text-heritage-dark-gray dark:text-gray-400">
            © {new Date().getFullYear()} Heritage Hair Salon. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
