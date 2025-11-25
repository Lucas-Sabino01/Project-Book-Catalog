import { useEffect, useState } from 'react';
import { authService, User } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle, Shield, User as UserIcon } from 'lucide-react';

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const fetchUsers = async () => {
    try {
      const userList = await authService.getAllUsers();
      setUsers(userList);
    } catch {
      toast.error('Falha ao carregar usuários.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    const originalUsers = [...users];
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));

    try {
      await authService.updateUserRole(userId, newRole);
      toast.success(`Permissão do usuário atualizada para ${newRole}.`);
    } catch {
      toast.error('Falha ao atualizar permissão.');
      setUsers(originalUsers);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  if (currentUser?.role !== 'admin' && currentUser?.role !== '2') {
    return (
      <div className="flex justify-center items-center h-screen text-destructive">
        Acesso negado. Você não tem permissão para ver esta página.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">Role: {user.role}</p>
                </div>
                <div className="flex gap-2">
                  {user.role !== 'admin' && (
                    <Button size="sm" onClick={() => handleRoleChange(user.id, 'admin')}>
                      <Shield className="w-4 h-4 mr-2" /> Tornar Admin
                    </Button>
                  )}
                  {user.role !== 'user' && (
                    <Button size="sm" variant="outline" onClick={() => handleRoleChange(user.id, 'user')}>
                      <UserIcon className="w-4 h-4 mr-2" /> Tornar User
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;