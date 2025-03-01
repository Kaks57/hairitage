
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import Header from '@/components/Header';

// Define validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  password: z.string().min(1, { message: 'Veuillez entrer votre mot de passe' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    // Check if already logged in
    const currentUser = localStorage.getItem('hairitage_user');
    if (currentUser) {
      navigate('/'); // Redirect if already logged in
    }
  }, [navigate]);
  
  const onSubmit = (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('hairitage_users') || '[]');
        
        // Find user with matching email and password
        const user = users.find((u: any) => 
          u.email === data.email && u.password === data.password
        );
        
        if (user) {
          // Store user info in localStorage (logged in)
          localStorage.setItem('hairitage_user', JSON.stringify(user));
          toast.success('Connexion réussie!');
          navigate('/'); // Redirect to home page after successful login
        } else {
          // Check if the email could be for a stylist
          if (data.email === 'garfield@hairitage.com' && data.password === 'password123') {
            const stylist = {
              id: 'stylist-1',
              firstName: 'Garfield',
              lastName: 'Smith',
              email: 'garfield@hairitage.com',
              phone: '0123456789',
              role: 'stylist'
            };
            localStorage.setItem('hairitage_user', JSON.stringify(stylist));
            toast.success('Connexion en tant que coiffeur réussie!');
            navigate('/stylist-dashboard');
            return;
          } else if (data.email === 'hamza@hairitage.com' && data.password === 'password123') {
            const stylist = {
              id: 'stylist-2',
              firstName: 'Hamza',
              lastName: 'Ben',
              email: 'hamza@hairitage.com',
              phone: '0765432198',
              role: 'stylist'
            };
            localStorage.setItem('hairitage_user', JSON.stringify(stylist));
            toast.success('Connexion en tant que coiffeur réussie!');
            navigate('/stylist-dashboard');
            return;
          }
          
          setLoginError('Email ou mot de passe incorrect');
          toast.error('Email ou mot de passe incorrect');
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError('Une erreur est survenue lors de la connexion');
        toast.error('Une erreur est survenue lors de la connexion');
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-black text-white">
      <Header />
      
      <div className="pt-24 pb-12 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-black border border-orange-500 shadow-xl">
          <CardHeader className="space-y-1 bg-orange-950/70 border-b border-orange-700/50">
            <CardTitle className="text-2xl font-serif text-center text-orange-400">Connexion</CardTitle>
            <CardDescription className="text-center text-orange-200">
              Entrez vos identifiants pour accéder à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {loginError && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-500/50 rounded-md text-red-200 text-sm">
                {loginError}
              </div>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-orange-600" />
                          <Input 
                            placeholder="email@exemple.com" 
                            type="email"
                            className="pl-10 bg-black border-orange-600 text-white" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Mot de passe</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-orange-600" />
                          <Input 
                            placeholder="••••••••" 
                            type="password"
                            className="pl-10 bg-black border-orange-600 text-white" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 space-y-3">
              <h3 className="text-sm text-orange-300 text-center">Comptes de démonstration</h3>
              <div className="grid grid-cols-1 gap-2 text-xs text-orange-300">
                <div className="p-2 border border-orange-800/50 rounded-md">
                  <p><strong>Coiffeur 1:</strong> garfield@hairitage.com / password123</p>
                </div>
                <div className="p-2 border border-orange-800/50 rounded-md">
                  <p><strong>Coiffeur 2:</strong> hamza@hairitage.com / password123</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-orange-800/50 bg-orange-950/30">
            <div className="text-sm text-center text-orange-300 mt-2">
              Vous n'avez pas de compte?{' '}
              <Link to="/signup" className="text-orange-400 hover:underline">S'inscrire</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
