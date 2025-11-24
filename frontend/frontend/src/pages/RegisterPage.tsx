import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, Moon, Sun, LoaderCircle, Eye, EyeOff, UserPlus } from "lucide-react";
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
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { username: "", password: "", confirmPassword: "" };
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

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
      if (!hasError) toast.error(newErrors.confirmPassword);
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Criando sua conta...");

    try {
      // O backend espera um 'role', será definido como 'user' por padrão
      await register(username, password, 'user');
      toast.success("Conta criada com sucesso! Redirecionando para o login...", { id: loadingToast });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocorreu um erro desconhecido", { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Reutilizando o mesmo background animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-library-parchment via-background to-library-gold/10 animate-gradient" />
      <div className="absolute top-20 left-10 w-32 h-32 border-2 border-accent opacity-light-50 dark:opacity-40 rounded-full animate-float" />
      <div className="absolute bottom-32 right-16 w-24 h-24 bg-gradient-to-br from-primary to-accent opacity-light-20 dark:opacity-15 rotate-45 animate-float-delayed" />
      <Sparkles className="absolute top-1/4 left-1/4 w-4 h-4 text-accent opacity-light-80 dark:opacity-70 animate-sparkle" />
      
      <Card className="w-full max-w-md shadow-2xl border-border/50 backdrop-blur-xl bg-card/80 z-10 relative overflow-hidden group hover:shadow-accent/20 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        
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
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/20 blur-xl animate-pulse-slow" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20">
                <UserPlus className="w-8 h-8 text-accent animate-float-gentle" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-serif tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              Crie sua Conta
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Junte-se ao nosso catálogo de livros.
            </CardDescription>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 relative">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input id="username" type="text" placeholder="seu_usuario" value={username} onChange={(e) => setUsername(e.target.value)} required />
              {errors.username && <p className="text-sm text-destructive mt-2">{errors.username}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm text-destructive mt-2">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <div className="relative">
                <Input id="confirm-password" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive mt-2">{errors.confirmPassword}</p>}
            </div>
          </CardContent>
          
          <CardFooter className="flex-col pt-2 gap-4">
            <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
              {isLoading ? (
                <>
                  <LoaderCircle className="w-5 h-5 animate-spin mr-2" />
                  Cadastrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </CardFooter>
        </form>
        
        <div className="h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </Card>
    </div>
  );
};

export default RegisterPage;