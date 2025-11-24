import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/services/authService";
import { Badge } from "@/components/ui/badge";
import { Shield, LoaderCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export const ProfileDialog = ({ open, onOpenChange, user }: ProfileDialogProps) => {
  const { updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setPassword("");
      setConfirmPassword("");
    }
  }, [user, open]);

  const handleSave = async () => {
    if (!user) return;

    if (password && password.length < 6) {
      toast.error("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    const updateData: { username?: string; password?: string } = {};

    if (username !== user.username) {
      updateData.username = username;
    }
    if (password) {
      updateData.password = password;
    }

    if (Object.keys(updateData).length === 0) {
      toast.info("Nenhuma alteração para salvar.");
      setIsLoading(false);
      onOpenChange(false);
      return;
    }

    try {
      await updateProfile(updateData);
      toast.success("Perfil atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar perfil.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil aqui. Clique em salvar quando terminar.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Deixe em branco para não alterar" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={!password} />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Permissão:</p>
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize font-semibold">
              {user.role}
            </Badge>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <><LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
            ) : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};