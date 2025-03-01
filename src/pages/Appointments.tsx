
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, Scissors, User, Users, Instagram, Home } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';

// Helper function to generate available time slots
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 19; hour++) {
    if (hour !== 13) { // Exclude lunch hour
      slots.push(`${hour}:00`);
      if (hour !== 19) slots.push(`${hour}:30`);
    }
  }
  return slots;
};

// Mocked stylists data
const stylists = [
  { id: 'stylist-001', name: 'Garfield', specialties: ['Coupes Homme', 'Barbe'] },
  { id: 'stylist-002', name: 'Hamza', specialties: ['Coupes Homme', 'Barbe'] }
];

// Services data
const services = [
  { id: 'service-001', name: 'Coupe Homme', duration: 30, price: 20 },
  { id: 'service-002', name: 'Coupe Homme Étudiant', duration: 30, price: 15 },
  { id: 'service-003', name: 'Coupe & Barbe', duration: 45, price: 25 },
  { id: 'service-004', name: 'Coupe & Barbe Étudiant', duration: 45, price: 20 }
];

interface Appointment {
  id: string;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhoneNumber: string;
  stylistId: string;
  stylistName: string;
  serviceId: string;
  serviceName: string;
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

const Appointments: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedStylist, setSelectedStylist] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState('book');
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<{[key: string]: string[]}>({});
  
  const timeSlots = generateTimeSlots();
  
  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('hairitage_user');
    if (!user) {
      toast.error('Vous devez être connecté pour accéder à cette page');
      navigate('/login');
    } else {
      // Load appointments from localStorage
      const savedAppointments = localStorage.getItem('hairitage_appointments');
      if (savedAppointments) {
        const parsedAppointments = JSON.parse(savedAppointments);
        // Convert string dates back to Date objects
        const appointmentsWithDates = parsedAppointments.map((app: any) => ({
          ...app,
          date: new Date(app.date)
        }));
        setAppointments(appointmentsWithDates);
        
        // Calculate booked slots
        updateBookedSlots(appointmentsWithDates);
      }
    }
  }, [navigate]);
  
  // Update booked slots when stylist or date changes
  useEffect(() => {
    if (selectedStylist && date) {
      updateBookedSlots(appointments);
    }
  }, [selectedStylist, date]);
  
  // Calculate which slots are already booked
  const updateBookedSlots = (appointmentsList: Appointment[]) => {
    const slots: {[key: string]: string[]} = {};
    
    appointmentsList.forEach(app => {
      if (app.status !== 'cancelled') {
        const dateStr = format(app.date, 'yyyy-MM-dd');
        const stylistKey = `${dateStr}-${app.stylistId}`;
        
        if (!slots[stylistKey]) {
          slots[stylistKey] = [];
        }
        
        slots[stylistKey].push(app.time);
      }
    });
    
    setBookedSlots(slots);
  };
  
  // Get available time slots for selected date and stylist
  const getAvailableTimeSlots = () => {
    if (!date || !selectedStylist) return timeSlots;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    const stylistKey = `${dateStr}-${selectedStylist}`;
    const bookedForStylist = bookedSlots[stylistKey] || [];
    
    return timeSlots.filter(slot => !bookedForStylist.includes(slot));
  };
  
  const handleBookAppointment = () => {
    if (!date || !selectedStylist || !selectedService || !selectedTime) {
      toast.error('Veuillez remplir tous les champs pour réserver');
      return;
    }
    
    const user = JSON.parse(localStorage.getItem('hairitage_user') || '{}');
    const stylist = stylists.find(s => s.id === selectedStylist);
    const service = services.find(s => s.id === selectedService);
    
    if (!stylist || !service) {
      toast.error('Informations de réservation invalides');
      return;
    }
    
    // Check if slot is still available (in case of concurrent booking)
    const dateStr = format(date, 'yyyy-MM-dd');
    const stylistKey = `${dateStr}-${selectedStylist}`;
    const bookedForStylist = bookedSlots[stylistKey] || [];
    
    if (bookedForStylist.includes(selectedTime)) {
      toast.error('Ce créneau vient d\'être réservé, veuillez en choisir un autre');
      updateBookedSlots(appointments);
      return;
    }
    
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      clientId: user.id,
      clientFirstName: user.firstName,
      clientLastName: user.lastName,
      clientPhoneNumber: user.phoneNumber || '',
      stylistId: stylist.id,
      stylistName: stylist.name,
      serviceId: service.id,
      serviceName: service.name,
      date: date,
      time: selectedTime,
      status: 'pending'
    };
    
    const updatedAppointments = [...appointments, newAppointment];
    
    // Save to localStorage
    localStorage.setItem('hairitage_appointments', JSON.stringify(updatedAppointments));
    
    setAppointments(updatedAppointments);
    updateBookedSlots(updatedAppointments);
    
    setShowSuccess(true);
    toast.success('Rendez-vous réservé avec succès !');
    
    // Reset form
    setDate(new Date());
    setSelectedStylist('');
    setSelectedService('');
    setSelectedTime('');
  };
  
  const handleCancelAppointment = (appointmentId: string) => {
    const updatedAppointments = appointments.map(app => 
      app.id === appointmentId ? { ...app, status: 'cancelled' as const } : app
    );
    
    localStorage.setItem('hairitage_appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
    updateBookedSlots(updatedAppointments);
    toast.success('Rendez-vous annulé');
  };
  
  const filteredAppointments = {
    upcoming: appointments.filter(app => 
      (app.status === 'pending' || app.status === 'confirmed') &&
      (new Date(`${format(app.date, 'yyyy-MM-dd')}T${app.time}`) > new Date())
    ),
    past: appointments.filter(app => 
      app.status === 'completed' || 
      (new Date(`${format(app.date, 'yyyy-MM-dd')}T${app.time}`) < new Date() && app.status !== 'cancelled')
    ),
    cancelled: appointments.filter(app => app.status === 'cancelled')
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-black text-white">
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-serif font-bold text-orange-400">Mes Rendez-vous</h1>
          </div>
          <p className="text-gray-300 text-center mb-8">Réservez et gérez vos rendez-vous chez Hairitage</p>
          
          {showSuccess ? (
            <Card className="bg-black border border-orange-500 shadow-lg overflow-hidden animate-fade-in">
              <CardHeader className="bg-green-950 border-b border-green-800">
                <CardTitle className="text-xl font-serif text-green-400">Réservation Confirmée</CardTitle>
                <CardDescription className="text-green-300">Votre rendez-vous a été réservé avec succès!</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-4">
                <p className="text-white">Votre demande de rendez-vous a été enregistrée et est en attente de confirmation par le coiffeur.</p>
                <p className="text-white">Vous pouvez consulter vos rendez-vous à venir dans l'onglet "À venir".</p>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button 
                  className="bg-green-700 hover:bg-green-800 text-white"
                  onClick={() => setShowSuccess(false)}
                >
                  Voir mes rendez-vous
                </Button>
                <Button 
                  variant="outline" 
                  className="border-orange-500 text-orange-300 hover:bg-orange-950"
                  onClick={() => navigate('/')}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Tabs defaultValue="book" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8 bg-black border border-orange-500">
                <TabsTrigger value="book" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">Réserver</TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">À venir ({filteredAppointments.upcoming.length})</TabsTrigger>
                <TabsTrigger value="history" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">Historique</TabsTrigger>
              </TabsList>
              
              <TabsContent value="book" className="animate-fade-in">
                <Card className="bg-black border border-orange-500 overflow-hidden shadow-lg">
                  <CardHeader className="bg-orange-950 border-b border-orange-800">
                    <CardTitle className="text-xl font-serif text-orange-400">Nouvelle réservation</CardTitle>
                    <CardDescription className="text-orange-300">Choisissez votre créneau, coiffeur et service</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Date
                        </label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal bg-black border-orange-600 text-white",
                                !date && "text-gray-400"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 2))}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Coiffeur
                        </label>
                        <Select value={selectedStylist} onValueChange={(value) => {
                          setSelectedStylist(value);
                          setSelectedTime(''); // Reset time when stylist changes
                        }}>
                          <SelectTrigger className="w-full bg-black border-orange-600 text-white">
                            <SelectValue placeholder="Choisir un coiffeur">
                              {selectedStylist ? (
                                <div className="flex items-center">
                                  <User className="mr-2 h-4 w-4" />
                                  {stylists.find(s => s.id === selectedStylist)?.name}
                                </div>
                              ) : (
                                "Choisir un coiffeur"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-black border border-orange-500 text-white">
                            {stylists.map((stylist) => (
                              <SelectItem key={stylist.id} value={stylist.id} className="hover:bg-orange-950">
                                <div className="flex items-center">
                                  <User className="mr-2 h-4 w-4" />
                                  {stylist.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Service
                        </label>
                        <Select value={selectedService} onValueChange={setSelectedService}>
                          <SelectTrigger className="w-full bg-black border-orange-600 text-white">
                            <SelectValue placeholder="Choisir un service">
                              {selectedService ? (
                                <div className="flex items-center">
                                  <Scissors className="mr-2 h-4 w-4" />
                                  {services.find(s => s.id === selectedService)?.name}
                                </div>
                              ) : (
                                "Choisir un service"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-black border border-orange-500 text-white">
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id} className="hover:bg-orange-950">
                                <div className="flex items-center">
                                  <Scissors className="mr-2 h-4 w-4" />
                                  {service.name} - {service.price}€ ({service.duration} min)
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Heure
                        </label>
                        <Select value={selectedTime} onValueChange={setSelectedTime} disabled={!selectedStylist || !date}>
                          <SelectTrigger className="w-full bg-black border-orange-600 text-white">
                            <SelectValue placeholder={!selectedStylist || !date ? "Sélectionnez d'abord date et coiffeur" : "Choisir une heure"}>
                              {selectedTime ? (
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {selectedTime}
                                </div>
                              ) : (
                                !selectedStylist || !date ? "Sélectionnez d'abord date et coiffeur" : "Choisir une heure"
                              )}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-black border border-orange-500 text-white">
                            {getAvailableTimeSlots().length === 0 ? (
                              <div className="p-2 text-orange-400 text-center">Aucun créneau disponible</div>
                            ) : (
                              getAvailableTimeSlots().map((slot) => (
                                <SelectItem key={slot} value={slot} className="hover:bg-orange-950">
                                  <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    {slot}
                                  </div>
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-orange-950/30 border-t border-orange-800/50 flex justify-between">
                    <Button 
                      variant="outline"
                      className="border-orange-500 text-orange-300 hover:bg-orange-950"
                      onClick={() => navigate('/')}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Accueil
                    </Button>
                    <Button 
                      className="bg-orange-600 hover:bg-orange-700 text-white button-animation"
                      onClick={handleBookAppointment}
                      disabled={!date || !selectedStylist || !selectedService || !selectedTime}
                    >
                      Réserver
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="upcoming" className="animate-fade-in space-y-4">
                {filteredAppointments.upcoming.length === 0 ? (
                  <Card className="bg-black border border-orange-500 shadow-md p-6 text-center">
                    <p className="text-gray-300">Vous n'avez aucun rendez-vous à venir</p>
                    <Button 
                      variant="link" 
                      className="text-orange-400"
                      onClick={() => setActiveTab('book')}
                    >
                      Réserver maintenant
                    </Button>
                  </Card>
                ) : (
                  filteredAppointments.upcoming.map((appointment) => (
                    <Card key={appointment.id} className="bg-black border border-orange-500 overflow-hidden shadow-md">
                      <CardHeader className="bg-orange-950 border-b border-orange-800 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-serif text-orange-400">{appointment.serviceName}</CardTitle>
                            <CardDescription className="text-orange-300">Avec {appointment.stylistName}</CardDescription>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-300">
                              {format(appointment.date, 'EEEE d MMMM', { locale: fr })}
                            </span>
                            <p className="text-orange-400 font-medium">{appointment.time}</p>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardFooter className="bg-orange-950/30 border-t border-orange-800/50 flex justify-between items-center">
                        <span className={cn(
                          "text-xs font-medium px-2.5 py-0.5 rounded-full",
                          appointment.status === 'pending' ? "bg-yellow-900 text-yellow-300" : 
                          "bg-green-900 text-green-300"
                        )}>
                          {appointment.status === 'pending' ? 'En attente' : 'Confirmé'}
                        </span>
                        <Button 
                          variant="outline" 
                          className="text-red-400 border-red-800 hover:bg-red-950"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Annuler
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="history" className="animate-fade-in">
                <Tabs defaultValue="past">
                  <TabsList className="w-full grid grid-cols-2 mb-4 bg-black border border-orange-500">
                    <TabsTrigger value="past" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">Passés ({filteredAppointments.past.length})</TabsTrigger>
                    <TabsTrigger value="cancelled" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">Annulés ({filteredAppointments.cancelled.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="past" className="space-y-4">
                    {filteredAppointments.past.length === 0 ? (
                      <Card className="bg-black border border-orange-500 shadow-md p-6 text-center">
                        <p className="text-gray-300">Aucun rendez-vous passé</p>
                      </Card>
                    ) : (
                      filteredAppointments.past.map((appointment) => (
                        <Card key={appointment.id} className="bg-black border border-orange-500 overflow-hidden shadow-md opacity-80">
                          <CardHeader className="bg-orange-950/50 border-b border-orange-800/50 pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-serif text-orange-400">{appointment.serviceName}</CardTitle>
                                <CardDescription className="text-orange-300">Avec {appointment.stylistName}</CardDescription>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium text-gray-300">
                                  {format(appointment.date, 'EEEE d MMMM', { locale: fr })}
                                </span>
                                <p className="text-orange-400 font-medium">{appointment.time}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardFooter className="bg-orange-950/20 border-t border-orange-800/30">
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-900 text-blue-300">
                              Terminé
                            </span>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                  
                  <TabsContent value="cancelled" className="space-y-4">
                    {filteredAppointments.cancelled.length === 0 ? (
                      <Card className="bg-black border border-orange-500 shadow-md p-6 text-center">
                        <p className="text-gray-300">Aucun rendez-vous annulé</p>
                      </Card>
                    ) : (
                      filteredAppointments.cancelled.map((appointment) => (
                        <Card key={appointment.id} className="bg-black border border-orange-500 overflow-hidden shadow-md opacity-70">
                          <CardHeader className="bg-orange-950/30 border-b border-orange-800/30 pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-serif text-orange-400">{appointment.serviceName}</CardTitle>
                                <CardDescription className="text-orange-300">Avec {appointment.stylistName}</CardDescription>
                              </div>
                              <div className="text-right">
                                <span className="text-sm font-medium text-gray-300">
                                  {format(appointment.date, 'EEEE d MMMM', { locale: fr })}
                                </span>
                                <p className="text-orange-400 font-medium">{appointment.time}</p>
                              </div>
                            </div>
                          </CardHeader>
                          <CardFooter className="bg-orange-950/20 border-t border-orange-800/30">
                            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-900 text-red-300">
                              Annulé
                            </span>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </TabsContent>
            </Tabs>
          )}
          
          <div className="mt-12 text-center">
            <a 
              href="https://www.instagram.com/hairitage.metz/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-orange-400 hover:underline"
            >
              <Instagram className="h-5 w-5 mr-2" />
              Suivez-nous sur Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
