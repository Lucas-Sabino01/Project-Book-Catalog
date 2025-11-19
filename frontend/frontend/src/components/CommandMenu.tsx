import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import {
  BookOpen,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Shield,
  Moon,
  Sun,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleLogout: () => void;
}

import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function CommandMenu({ open, setOpen, handleLogout }: CommandMenuProps) {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const { user } = useAuth();

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="sr-only">Menu de Comandos</DialogTitle>
      <DialogDescription className="sr-only">
        Use este menu para navegar rapidamente pela aplicação e executar ações.
      </DialogDescription>

      <CommandInput placeholder="Digite um comando ou pesquise..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Navegação">
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard"))}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Visão Geral</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/books"))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Catálogo de Livros</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/authors"))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Autores</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/settings"))}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configurações</span>
          </CommandItem>
          {user?.role === 'admin' && (
            <CommandItem onSelect={() => runCommand(() => navigate("/dashboard/admin"))}>
              <Shield className="mr-2 h-4 w-4" />
              <span>Administração</span>
            </CommandItem>
          )}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Ações">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Mudar para Tema Claro</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Mudar para Tema Escuro</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(handleLogout)}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}