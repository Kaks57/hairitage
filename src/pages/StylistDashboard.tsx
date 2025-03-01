
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, User, Phone, Scissors, Check, X, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import Header from '@/components/Header';

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

const stylists = [
  { id: 'stylist-001', name: 'Garfield', specialties: ['Coupes Homme', 'Barbe'] },
  { id: 'stylist-002', name: 'Hamza', specialties: ['Coupes Homme', 'Barbe'] }
];

const StylistDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedStylist, setSelectedStylist] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Check if user is logged in and is a stylist
  useEffect(() => {
    const loggedInUser = localStorage.getItem('hairitage_user');
    if (!loggedInUser) {
      toast.error('Veuillez vous connecter pour accéder au tableau de bord');
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(loggedInUser);
    setUser(parsedUser);
    
    // Check if user has stylist role
    if (parsedUser.role !== 'stylist') {
      toast.error('Accès non autorisé. Seuls les coiffeurs peuvent accéder à cette page.');
      navigate('/');
      return;
    }
    
    setIsAuthorized(true);
    
    // Load all appointments from localStorage
    const savedAppointments = localStorage.getItem('hairitage_appointments');
    if (savedAppointments) {
      const parsedAppointments = JSON.parse(savedAppointments);
      // Convert string dates back to Date objects
      const appointmentsWithDates = parsedAppointments.map((app: any) => ({
        ...app,
        date: new Date(app.date)
      }));
      setAppointments(appointmentsWithDates);
      
      // Determine which stylist is logged in
      const stylistId = getStylistIdFromUser(parsedUser);
      if (stylistId) {
        setSelectedStylist(stylistId);
      }
    }
  }, [navigate]);
  
  // Helper function to get stylist ID from user
  const getStylistIdFromUser = (user: any) => {
    // Find the stylist ID based on the logged-in user's firstname
    const stylist = stylists.find(s => s.name.toLowerCase() === user.firstName.toLowerCase());
    return stylist ? stylist.id : null;
  };
  
  // Filter appointments when date, stylist or appointments change
  useEffect(() => {
    if (!selectedDate || !selectedStylist || !user) return;
    
    // Verify the current user can only see their own appointments
    const currentUserStylistId = getStylistIdFromUser(user);
    
    // If the current user is trying to access another stylist's data, reset to their own
    if (currentUserStylistId && selectedStylist !== currentUserStylistId) {
      setSelectedStylist(currentUserStylistId);
      toast.error('Vous ne pouvez voir que vos propres rendez-vous');
      return;
    }
    
    const filtered = appointments.filter(app => {
      const appointmentDate = new Date(app.date);
      return (
        app.stylistId === selectedStylist && 
        appointmentDate.getDate() === selectedDate.getDate() &&
        appointmentDate.getMonth() === selectedDate.getMonth() &&
        appointmentDate.getFullYear() === selectedDate.getFullYear()
      );
    });
    
    // Sort by time
    const sorted = [...filtered].sort((a, b) => {
      const timeA = parseInt(a.time.split(':')[0]) * 60 + parseInt(a.time.split(':')[1] || '0');
      const timeB = parseInt(b.time.split(':')[0]) * 60 + parseInt(b.time.split(':')[1] || '0');
      return timeA - timeB;
    });
    
    setFilteredAppointments(sorted);
  }, [selectedDate, selectedStylist, appointments, user]);
  
  // Don't render anything if not authorized
  if (!isAuthorized) {
    return null;
  }
  
  const updateAppointmentStatus = (appointmentId: string, newStatus: 'confirmed' | 'completed' | 'cancelled') => {
    const updatedAppointments = appointments.map(app => 
      app.id === appointmentId ? { ...app, status: newStatus } : app
    );
    
    // Save to localStorage
    localStorage.setItem('hairitage_appointments', JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments);
    
    toast.success(`Rendez-vous ${
      newStatus === 'confirmed' ? 'confirmé' : 
      newStatus === 'completed' ? 'marqué comme terminé' : 'annulé'
    }`);
  };
  
  // Get appointments count by date for the calendar
  const getAppointmentCountByDate = (date: Date) => {
    if (!user) return 0;
    
    const currentUserStylistId = getStylistIdFromUser(user);
    if (!currentUserStylistId) return 0;
    
    return appointments.filter(app => 
      app.stylistId === currentUserStylistId && 
      app.status !== 'cancelled' &&
      new Date(app.date).toDateString() === date.toDateString()
    ).length;
  };
  
  // Disable dates that are in the past
  const disabledDays = (date: Date) => {
    return date < new Date(new Date().setHours(0, 0, 0, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-black text-white">
      <Header />
      
      <div className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-serif font-bold text-orange-400">Tableau de Bord Coiffeur</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sidebar with Calendar & Filters */}
            <Card className="bg-black border border-orange-500 shadow-lg">
              <CardHeader className="bg-orange-950 border-b border-orange-800">
                <CardTitle className="text-xl font-serif text-orange-400">Calendrier</CardTitle>
                <CardDescription className="text-orange-300">Sélectionnez une date pour voir les rendez-vous</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-6">
                {/* Replace dropdown with the current stylist's name */}
                <div className="text-center py-2 bg-orange-950/50 rounded-md border border-orange-800">
                  <p className="text-lg font-medium text-orange-300">
                    {user && stylists.find(s => s.id === selectedStylist)?.name}
                  </p>
                  <p className="text-sm text-orange-400/70">Coiffeur</p>
                </div>
                
                <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-800/30">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={disabledDays}
                    modifiers={{
                      busy: (date) => getAppointmentCountByDate(date) > 0,
                    }}
                    modifiersClassNames={{
                      busy: "bg-orange-600/30 font-bold text-white",
                    }}
                    className="border-none text-white"
                  />
                </div>
                
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-600/30 mr-1"></div>
                    <span>Avec RDV</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-700 mr-1"></div>
                    <span>Sans RDV</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Main Content - Appointments List */}
            <div className="lg:col-span-2">
              <Card className="bg-black border border-orange-500 shadow-lg">
                <CardHeader className="bg-orange-950 border-b border-orange-800 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-serif text-orange-400">
                      Rendez-vous du {selectedDate ? format(selectedDate, 'EEEE d MMMM', { locale: fr }) : '...'}
                    </CardTitle>
                    <CardDescription className="text-orange-300">
                      {selectedStylist && stylists.find(s => s.id === selectedStylist)?.name}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <Tabs defaultValue="all">
                    <TabsList className="grid grid-cols-4 mb-6 bg-black border border-orange-500">
                      <TabsTrigger value="all" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">
                        Tous
                      </TabsTrigger>
                      <TabsTrigger value="pending" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">
                        En attente
                      </TabsTrigger>
                      <TabsTrigger value="confirmed" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">
                        Confirmés
                      </TabsTrigger>
                      <TabsTrigger value="completed" className="data-[state=active]:bg-orange-950 data-[state=active]:text-white">
                        Terminés
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="all" className="space-y-4">
                      {filteredAppointments.length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-orange-500/30 rounded-lg">
                          <Calendar className="mx-auto h-10 w-10 text-orange-400/50 mb-3" />
                          <p className="text-gray-400">Aucun rendez-vous pour cette date</p>
                        </div>
                      ) : (
                        filteredAppointments.map((appointment) => (
                          <AppointmentCard 
                            key={appointment.id} 
                            appointment={appointment} 
                            updateStatus={updateAppointmentStatus} 
                          />
                        ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="pending" className="space-y-4">
                      {filteredAppointments.filter(a => a.status === 'pending').length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-orange-500/30 rounded-lg">
                          <p className="text-gray-400">Aucun rendez-vous en attente</p>
                        </div>
                      ) : (
                        filteredAppointments
                          .filter(a => a.status === 'pending')
                          .map((appointment) => (
                            <AppointmentCard 
                              key={appointment.id} 
                              appointment={appointment} 
                              updateStatus={updateAppointmentStatus} 
                            />
                          ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="confirmed" className="space-y-4">
                      {filteredAppointments.filter(a => a.status === 'confirmed').length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-orange-500/30 rounded-lg">
                          <p className="text-gray-400">Aucun rendez-vous confirmé</p>
                        </div>
                      ) : (
                        filteredAppointments
                          .filter(a => a.status === 'confirmed')
                          .map((appointment) => (
                            <AppointmentCard 
                              key={appointment.id} 
                              appointment={appointment} 
                              updateStatus={updateAppointmentStatus} 
                            />
                          ))
                      )}
                    </TabsContent>
                    
                    <TabsContent value="completed" className="space-y-4">
                      {filteredAppointments.filter(a => a.status === 'completed').length === 0 ? (
                        <div className="text-center p-8 border border-dashed border-orange-500/30 rounded-lg">
                          <p className="text-gray-400">Aucun rendez-vous terminé</p>
                        </div>
                      ) : (
                        filteredAppointments
                          .filter(a => a.status === 'completed')
                          .map((appointment) => (
                            <AppointmentCard 
                              key={appointment.id} 
                              appointment={appointment} 
                              updateStatus={updateAppointmentStatus} 
                            />
                          ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component for displaying individual appointment cards
interface AppointmentCardProps {
  appointment: Appointment;
  updateStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled') => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, updateStatus }) => {
  const { clientFirstName, clientLastName, clientPhoneNumber, serviceName, time, status } = appointment;
  
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-900/50 text-yellow-300 text-xs">En attente</span>;
      case 'confirmed':
        return <span className="px-2 py-1 rounded-full bg-green-900/50 text-green-300 text-xs">Confirmé</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full bg-blue-900/50 text-blue-300 text-xs">Terminé</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full bg-red-900/50 text-red-300 text-xs">Annulé</span>;
      default:
        return null;
    }
  };
  
  return (
    <Card className="bg-black border border-orange-500/70 overflow-hidden shadow">
      <div className="flex">
        <div className="w-2 bg-orange-600"></div>
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-950 p-2 rounded-full">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-white">{time}</p>
                <p className="text-sm text-orange-300">{serviceName}</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <User className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-gray-300">
                {clientFirstName} {clientLastName}
              </span>
            </div>
            
            {clientPhoneNumber && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-orange-500 mr-2" />
                <a href={`tel:${clientPhoneNumber}`} className="text-gray-300 hover:text-orange-400">
                  {clientPhoneNumber}
                </a>
              </div>
            )}
            
            <div className="flex items-center">
              <Scissors className="h-4 w-4 text-orange-500 mr-2" />
              <span className="text-gray-300">{serviceName}</span>
            </div>
          </div>
          
          {status === 'pending' && (
            <div className="mt-4 flex space-x-2">
              <Button 
                size="sm" 
                className="bg-green-700 hover:bg-green-800 text-white"
                onClick={() => updateStatus(appointment.id, 'confirmed')}
              >
                <Check className="h-4 w-4 mr-1" /> Confirmer
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-700 text-red-400 hover:bg-red-950"
                onClick={() => updateStatus(appointment.id, 'cancelled')}
              >
                <X className="h-4 w-4 mr-1" /> Refuser
              </Button>
            </div>
          )}
          
          {status === 'confirmed' && (
            <div className="mt-4">
              <Button 
                size="sm" 
                className="bg-blue-700 hover:bg-blue-800 text-white"
                onClick={() => updateStatus(appointment.id, 'completed')}
              >
                <Check className="h-4 w-4 mr-1" /> Marquer comme terminé
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StylistDashboard;
