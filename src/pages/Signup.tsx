
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { User, Mail, Lock, Phone } from 'lucide-react';
import Header from '@/components/Header';

// Define validation schema
const signupSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  phoneNumber: z.string().min(10, { message: 'Veuillez entrer un numéro de téléphone valide' }),
  password: z.string().min(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    setIsLoading(true);
    
    // Create a new user object
    const newUser = {
      id: `user-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password, // In a real app, you would hash this password
      role: 'client', // Default role is client
      createdAt: new Date().toISOString()
    };
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Check if a user with this email already exists
        const users = JSON.parse(localStorage.getItem('hairitage_users') || '[]');
        const existingUser = users.find((user: any) => user.email === data.email);
        
        if (existingUser) {
          toast.error('Un compte avec cette adresse email existe déjà');
          setIsLoading(false);
          return;
        }
        
        // Save the new user to localStorage
        localStorage.setItem('hairitage_users', JSON.stringify([...users, newUser]));
        
        // Log the user in by storing their info in localStorage
        localStorage.setItem('hairitage_user', JSON.stringify(newUser));
        
        toast.success('Compte créé avec succès!');
        navigate('/'); // Redirect to home page after successful signup
      } catch (error) {
        console.error('Signup error:', error);
        toast.error('Une erreur est survenue lors de la création du compte');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-900 to-black text-white">
      <Header />
      
      <div className="pt-24 pb-12 flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-black border border-orange-500 shadow-xl">
          <CardHeader className="space-y-1 bg-orange-950/70 border-b border-orange-700/50">
            <CardTitle className="text-2xl font-serif text-center text-orange-400">Créer un compte</CardTitle>
            <CardDescription className="text-center text-orange-200">
              Rejoignez la communauté Hairitage
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Prénom</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-orange-600" />
                            <Input 
                              placeholder="Prénom" 
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
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Nom</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-orange-600" />
                            <Input 
                              placeholder="Nom" 
                              className="pl-10 bg-black border-orange-600 text-white" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Numéro de téléphone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-orange-600" />
                          <Input 
                            placeholder="06 12 34 56 78"
                            type="tel"
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
                
                <FormField
                  control={form.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Confirmer le mot de passe</FormLabel>
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
                  {isLoading ? "Création en cours..." : "Créer un compte"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t border-orange-800/50 bg-orange-950/30">
            <div className="text-sm text-center text-orange-300 mt-2">
              Vous avez déjà un compte?{' '}
              <Link to="/login" className="text-orange-400 hover:underline">Se connecter</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
