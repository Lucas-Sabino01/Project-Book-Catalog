import * as React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, LogOut, User, Settings, Command } from "lucide-react";
import { toast } from "sonner";
import { CommandMenu } from "./CommandMenu";
import { ProfileDialog } from "./ProfileDialog";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    toast.success("Logout realizado com sucesso!");
    logout();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Visão Geral";
    if (path === "/dashboard/books") return "Catálogo de Livros";
    if (path === "/dashboard/authors") return "Autores";
    if (path === "/dashboard/admin") return "Administração";
    if (path === "/dashboard/settings") return "Configurações";
    return "Dashboard";
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name.substring(0, 2).toUpperCase();
  };

  const [openCommandMenu, setOpenCommandMenu] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommandMenu((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CommandMenu open={openCommandMenu} setOpen={setOpenCommandMenu} handleLogout={handleLogout} />
      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} user={user} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Redesigned Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center justify-between p-4 md:p-6">
            {/* Page Title with Gradient */}
            <div className="flex items-center gap-3">
              {/* Logo */}
              <div className="relative group cursor-pointer" onClick={() => navigate('/dashboard')}>
                <div className="absolute -inset-2 gradient-primary rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative p-2 glass rounded-lg border border-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              {/* Command Menu Button - Now responsive */}
              <Button
                variant="outline"
                className="text-muted-foreground text-sm gap-2 flex"
                onClick={() => setOpenCommandMenu(true)}
              >
                <Command className="h-4 w-4" />
                <span className="hidden sm:inline">Comandos</span>
                <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[13px] font-medium text-muted-foreground opacity-100 sm:inline-flex">
                  <span className="text-xs">⌘</span>Ctrl + K
                </kbd>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarFallback className="gradient-primary text-white font-semibold text-lg">
                        {getInitials(user?.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;