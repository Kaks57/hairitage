
import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail, Scissors } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const Services = () => {
  // Galerie des coupes réalisées
  const haircuts = [
 
  ];

  // Services proposés
  const servicesList = [
    { name: "Coupe Homme Étudiant", price: "15€", description: "Coupe tendance pour étudiants" },
    { name: "Coupe & Barbe Étudiant", price: "20€", description: "Coupe et entretien de barbe pour étudiants" },
    { name: "Coupe Homme", price: "20€", description: "Coupe classique ou moderne pour hommes" },
    { name: "Coupe & Barbe", price: "25€", description: "Coupe et service barbe complet" }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-orange-950">
      <Header />
      
      {/* Bannière services */}
      <section className="relative pt-28 pb-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Nos Services & Réalisations</h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Découvrez notre expertise de coiffure pour hommes avec une galerie de nos meilleures réalisations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/appointments">
              <Button className="bg-black hover:bg-gray-800 text-white px-6 py-3">
                Prendre rendez-vous
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Liste des services */}
      <section className="py-16 bg-white dark:bg-orange-950">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold mb-10 text-center text-orange-600 dark:text-orange-400">
            Nos Services Homme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesList.map((service, index) => (
              <Card key={index} className="border border-orange-200 hover:shadow-lg transition-shadow overflow-hidden dark:bg-black dark:border-orange-800">
                <div className="h-2 bg-orange-500"></div>
                <CardContent className="pt-6 px-6 pb-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">{service.name}</h3>
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{service.price}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                  <Link to="/appointments">
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Réserver
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Contact et Info */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-6">Nous Trouver</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-xl mb-1">Adresse</h3>
                    <p>12 Av. Sébastopol, Metz 57070</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-xl mb-1">Téléphone</h3>
                    <p>+33 3 87 37 32 77</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-xl mb-1">Email</h3>
                    <p>contact@hairitage-metz.fr</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Instagram className="h-6 w-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-xl mb-1">Instagram</h3>
                    <a 
                      href="https://www.instagram.com/hairitage.metz/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      @hairitage.metz
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="font-medium text-xl mb-2">Horaires d'ouverture</h3>
                <ul className="space-y-1">
                  <li className="flex justify-between">
                    <span>Du mardi au dimanche:</span>
                    <span>9h - 20h</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Lundi:</span>
                    <span>Fermé</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="h-80 rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2678.5221402137547!2d6.1657!3d49.1057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4794dc1b5c9fa889%3A0x1d689f33c06b073a!2s12%20Av.%20S%C3%A9bastopol%2C%2057070%20Metz!5e0!3m2!1sfr!2sfr!4v1652172530062!5m2!1sfr!2sfr" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Hairitage"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.webp" alt="Heritage Logo" className="w-6 h-6 mr-1" />
              <span className="ml-2 text-lg font-serif">HAIRITAGE</span>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="https://www.instagram.com/hairitage.metz/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-orange-400 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <span className="text-sm text-gray-400">© {new Date().getFullYear()} Hairitage Metz. Tous droits réservés.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;
