import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, Library, ArrowUpRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookService, DashboardStats } from "@/services/bookService";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await bookService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Falha ao buscar estatísticas do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total de Livros", value: stats?.totalBooks, change: "no catálogo", icon: BookOpen, gradient: "gradient-primary" },
    { title: "Autores", value: stats?.totalAuthors, change: "únicos", icon: Users, gradient: "gradient-accent" },
    { title: "Gêneros", value: stats?.totalGenres, change: "categorias", icon: Library, gradient: "gradient-primary" },
    { title: "Crescimento", value: "+40%", change: "vs mês anterior", icon: TrendingUp, gradient: "gradient-accent" },
  ];

  const recentActivity = [
    { book: "1984", author: "George Orwell", action: "adicionado", time: "2h atrás" },
    { book: "Dom Casmurro", author: "Machado de Assis", action: "editado", time: "5h atrás" },
    { book: "O Cortiço", author: "Aluísio Azevedo", action: "visualizado", time: "1d atrás" },
  ];

  const StatCardSkeleton = () => (
    <Card className="relative overflow-hidden border-border/50">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-4 w-4" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-2/4" />
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl glass p-8 glow-primary">
        <div className="absolute inset-0 gradient-primary opacity-5" />
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Bem-vindo de volta! 👋</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Seu catálogo está crescendo. Continue adicionando e organizando seus livros favoritos.
              </p>
            </div>
            <Button onClick={() => navigate('/dashboard/books')} className="gradient-primary border-0 text-white hover:opacity-90 transition-opacity">
              <Zap className="mr-2 h-4 w-4" />
              Adicionar Livro
            </Button>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <StatCardSkeleton key={index} />)
        ) : (
          statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className={`absolute inset-0 ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.gradient} bg-opacity-10`}>
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value ?? 'N/A'}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns */}
        <Card className="lg:col-span-2 border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Atividade Recente</h3>
              <Button variant="ghost" size="sm">Ver tudo</Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors group"
                >
                  <div className="p-2 rounded-lg glass">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.book}</p>
                    <p className="text-sm text-muted-foreground">por {activity.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium capitalize">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions - Takes 1 column */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6">Ações Rápidas</h3>
            <div className="space-y-3">
              {/* Botão Adicionar Livro */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300" />
                <Button onClick={() => navigate('/dashboard/books')} variant="outline" className="w-full justify-start relative z-10 bg-background hover:bg-muted">
                  <BookOpen className="mr-2 h-4 w-4 text-primary" />
                  Adicionar Livro
                </Button>
              </div>

              {/* Botão Novo Autor */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-primary rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300" />
                <Button 
                  onClick={() => navigate('/dashboard/authors')}
                  variant="outline" 
                  className="w-full justify-start relative z-10 bg-background hover:bg-muted"
                >
                  <Users className="mr-2 h-4 w-4 text-accent" />
                  Adicionar Autor
                </Button>
              </div>

              {/* Botão Ver Catálogo */}
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300" />
                <Button onClick={() => navigate('/dashboard/books')} variant="outline" className="w-full justify-start relative z-10 bg-background hover:bg-muted">
                  <Library className="mr-2 h-4 w-4 text-primary" />
                  Ver Catálogo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 overflow-hidden">
          <div className="absolute inset-0 gradient-accent opacity-5" />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold mb-4">📚 Insights do Catálogo</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Gênero mais popular</span>
                <span className="font-semibold text-accent">Ficção</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Ano com mais livros</span>
                <span className="font-semibold text-primary">1949</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Taxa de crescimento</span>
                <span className="font-semibold text-accent">+40%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 overflow-hidden">
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <CardContent className="p-6 relative z-10">
            <h3 className="text-lg font-semibold mb-4">🎯 Próximos Passos</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div>
                  <p className="font-medium">Complete seu catálogo</p>
                  <p className="text-sm text-muted-foreground">Adicione mais livros para melhorar as recomendações</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                <div>
                  <p className="font-medium">Organize por gêneros</p>
                  <p className="text-sm text-muted-foreground">Categorize seus livros para facilitar a busca</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;