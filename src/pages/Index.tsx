
import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Calendar, Clock, MapPin, Star, User, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-orange-950">
      {/* Hero Section */}
      <Header transparent={true} />
      
      <header className="relative min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-b from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              H<span className="text-black">airitage</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg">
             Votre coupe, Notre héritage
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/appointments">
                <Button 
                  className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-md button-animation"
                  size="lg"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Prendre rendez-vous
                </Button>
              </Link>
             
            </div>
            
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-white" />
                <span className="text-sm md:text-base">Du mardi au dimanche 9h/20h</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-white" />
                <span className="text-sm md:text-base">Metz, France</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-white" />
                <span className="text-sm md:text-base">5.0 (500+ avis)</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src="public/hairitage photo.webp" 
                alt="Salon de coiffure Hairitage" 
                className="w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-black rounded-full -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-orange-300 rounded-full -z-10"></div>
          </div>
        </div>
      </header>
      
      {/* Services Section */}
      <section className="py-20 px-4 bg-white dark:bg-orange-950">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-orange-600 dark:text-orange-400">Nos Services</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Des coupes hommes modernes aux soins barbe professionnels, nous proposons des services spécialisés à prix accessibles.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Coupe Homme",
                description: "Coupe tendance adaptée à votre style et à la forme de votre visage.",
                icon: Scissors,
                price: "20€"
              },
              {
                title: "Coupe Étudiant",
                description: "Tarif spécial pour les étudiants avec carte valide.",
                icon: Scissors,
                price: "15€"
              },
              {
                title: "Coupe & Barbe",
                description: "Service complet incluant coupe et entretien de barbe.",
                icon: Scissors,
                price: "25€"
              },
              {
                title: "Coupe & Barbe Étudiant",
                description: "Forfait coupe et barbe à tarif étudiant.",
                icon: Scissors,
                price: "20€"
              }
            ].map((service, index) => (
              <Card key={index} className="border border-orange-200 hover:shadow-lg transition-shadow overflow-hidden dark:bg-orange-900 dark:border-orange-800">
                <div className="h-2 bg-orange-500"></div>
                <CardContent className="p-6">
                  <div className="bg-orange-100 dark:bg-orange-800/60 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <service.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold mb-2 text-gray-900 dark:text-white">{service.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-orange-600 dark:text-orange-400">{service.price}</span>
                    <Link to="/appointments">
                      <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white dark:border-orange-400 dark:text-orange-400 dark:hover:bg-orange-400 dark:hover:text-black">
                        Réserver
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
          
          </div>
        </div>
      </section>
      
      {/* Stylists Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-black">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-orange-600 dark:text-orange-400">Nos Coiffeurs</h2>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Rencontrez notre équipe de professionnels talentueux et passionnés
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {[
              {
                name: "Garfield",
                role: "Barbier senior",
                specialties: "Coupes hommes, Dégradés",
                image: "public/garfield.PNG"
              },
              {
                name: "Hamza",
                role: "Barbier styliste",
                specialties: "Coupes modernes, Barbes",
                image: "/hamza.PNG"
              }
            ].map((stylist, index) => (
              <div key={index} className="flex flex-col items-center animate-fade-in">
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-orange-500/20">
                  <img 
                    src={stylist.image} 
                    alt={stylist.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white">{stylist.name}</h3>
                <p className="text-orange-600 dark:text-orange-400 font-medium mb-2">{stylist.role}</p>
                <p className="text-gray-600 dark:text-gray-300 text-center">{stylist.specialties}</p>
                <Link to="/appointments" className="mt-4">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-4 button-animation">
                    Prendre rendez-vous
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
          {/* Call to Action */}
          <section className="py-20 px-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Prêt pour une nouvelle coupe ?</h2>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Réservez dès maintenant votre prochain rendez-vous chez Hairitage et laissez-nous sublimer votre style.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup">
              <Button className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg button-animation">
                <User className="mr-2 h-5 w-5" />
                Créer un compte
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline"  className="border-2 border-black bg-black text-white hover:bg-black hover:text-white hover:border-black px-8 py-6 text-lg button-animation">
              <User className="mr-2 h-5 w-5" />
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Contact */}
      <section className="py-16 px-4 bg-white dark:bg-orange-950">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif font-bold mb-4 text-orange-600 dark:text-orange-400">Nous Trouver</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="rounded-lg overflow-hidden h-80">
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
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xl mb-1 text-gray-900 dark:text-white">Adresse</h3>
                    <p className="text-gray-600 dark:text-gray-300">12 Av. Sébastopol, Metz 57070</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
                    <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xl mb-1 text-gray-900 dark:text-white">Horaires</h3>
                    <p className="text-gray-600 dark:text-gray-300">Du mardi au dimanche 9h/20h</p>
                    <p className="text-gray-600 dark:text-gray-300">Lundi: Fermé</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 dark:bg-orange-900 rounded-full p-3">
                    <Instagram className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-xl mb-1 text-gray-900 dark:text-white">Instagram</h3>
                    <a 
                      href="https://www.instagram.com/hairitage.metz/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      @hairitage.metz
                    </a>
                  </div>
                </div>
              </div>
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

export default Index;
