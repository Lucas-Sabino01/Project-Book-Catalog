import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, Moon, Sun, LoaderCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { username: "", password: "" };
    let hasError = false;

    if (!username.trim()) {
      newErrors.username = "O nome de usuário é obrigatório.";
      toast.error(newErrors.username);
      hasError = true;
    }

    if (password.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
      if (!hasError) toast.error(newErrors.password);
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      setIsLoading(true);
      toast.loading("Autenticando...");

      setTimeout(() => {
        setIsLoading(false);
        toast.dismiss();
        toast.success(`Bem-vindo de volta, ${username}!`);

        login(username);
        
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-library-parchment via-background to-library-gold/10 animate-gradient" />
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-accent opacity-light-50 dark:opacity-40 rounded-full animate-float" />
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-primary to-accent opacity-light-20 dark:opacity-15 rotate-45 animate-float-delayed" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent opacity-light-40 dark:opacity-15 rounded-lg animate-pulse-slow" />
      
      {/* Sparkle effects */}
      <Sparkles className="absolute top-1/4 left-1/4 w-4 h-4 text-accent opacity-light-80 dark:opacity-70 animate-sparkle" />
      <Sparkles className="absolute bottom-1/3 right-1/3 w-3 h-3 text-library-gold opacity-90 dark:opacity-80 animate-sparkle-delayed" />
      
      {/* Login Card */}
      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-xl bg-card/80 z-10 relative overflow-hidden group hover:shadow-accent/20 transition-all duration-500">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="absolute top-4 right-4 z-20 text-muted-foreground hover:text-foreground bg-background/30 hover:bg-background/70 rounded-full"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
        
        <CardHeader className="space-y-4 text-center pb-8 relative">
          {/* Icon with animated background */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse-slow" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20">
                <BookOpen className="w-8 h-8 text-accent animate-float-gentle" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-serif tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Bem-vindo de volta
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Acesse o catálogo para gerenciar os livros.
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 relative">
            <div className="space-y-2 group/input">
              <Label 
                htmlFor="username" 
                className="text-sm font-medium transition-colors duration-200"
              >
                Usuário
              </Label>
              <div className="relative">
                <Input
                  id="username"
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsFocused("username")}
                  onBlur={() => setIsFocused(null)}
                  className="h-12 bg-background/50 border-border focus:border-accent transition-all duration-300 focus:shadow-lg focus:shadow-accent/10 pr-10"
                  required
                />
                {isFocused === "username" && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-accent rounded-full animate-ping" />
                  </div>
                )}
                {errors.username && (
                  <p className="text-sm text-destructive mt-2 animate-pulse-slow">
                    {errors.username}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 group/input">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium transition-colors duration-200"
              >
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused("password")}
                  onBlur={() => setIsFocused(null)}
                  className="h-12 bg-background/50 border-border focus:border-accent transition-all duration-300 focus:shadow-lg focus:shadow-accent/10 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && (
                  <p className="text-sm text-destructive mt-2 animate-pulse-slow">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Lembrar de mim
                </label>
              </div>
              <Button variant="link" className="p-0 h-auto text-sm text-muted-foreground hover:text-primary">
                Esqueceu a senha?
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium shadow-lg hover:shadow-xl hover:shadow-accent/20 transition-all duration-300 group/button relative overflow-hidden"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <LoaderCircle className="w-5 h-5 animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Entrar
                  <BookOpen className="w-4 h-4 group-hover/button:rotate-12 transition-transform duration-300" />
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent/20 to-primary opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
            </Button>
          </CardFooter>
        </form>
        
        {/* Bottom decoration */}
        <div className="h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </Card>
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-accent to-transparent opacity-light-15 dark:opacity-10 rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-library-gold to-transparent opacity-light-15 dark:opacity-10 rounded-tl-full" />
    </div>
  );
};

export default LoginPage;