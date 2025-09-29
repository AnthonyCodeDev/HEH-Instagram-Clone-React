import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import logoImage from "@/assets/stragram-logo.png";
import floatingPhotos from "@/assets/floating-photos.jpg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen gradient-stragram flex">
      {/* Left side - Branding */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-white relative">
        <div className="absolute inset-0 opacity-10">
          <img 
            src={floatingPhotos} 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          <div className="mb-8">
            <img 
              src={logoImage}
              alt="Stragram"
              className="w-16 h-16 mx-auto mb-4 drop-shadow-lg"
            />
            <h1 className="text-4xl font-bold mb-2">Stragram</h1>
            <p className="text-xl text-white/90">
              La plateforme de discussion pour les jeunes.
            </p>
          </div>
          
          {/* Floating photos decoration */}
          <div className="absolute -left-20 -top-20 w-32 h-32 bg-white/10 rounded-2xl backdrop-blur-sm rotate-12 opacity-50"></div>
          <div className="absolute -right-16 top-10 w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm -rotate-6 opacity-50"></div>
          <div className="absolute -left-8 bottom-16 w-28 h-28 bg-white/10 rounded-2xl backdrop-blur-sm rotate-6 opacity-50"></div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <Card className="w-full max-w-md p-8 shadow-card">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
          </div>

          <form className="space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 focus:border-stragram-primary"
              />
            </div>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 rounded-xl border-gray-200 focus:border-stragram-primary pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Button 
              variant="stragram" 
              size="lg" 
              className="w-full"
              asChild
            >
              <Link to="/home">
                Connexion
              </Link>
            </Button>

            <div className="text-center space-y-4">
              <Link 
                to="/forgot-password" 
                className="text-sm text-gray-600 hover:text-stragram-primary transition-smooth"
              >
                Mot de passe oublié ?
              </Link>
              
              <Link 
                to="/register" 
                className="block text-sm text-stragram-primary hover:underline"
              >
                S'inscrire sur stragram.com
              </Link>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">ou</span>
              </div>
            </div>

            <Button 
              variant="google" 
              size="lg" 
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              S'inscrire avec Google
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;