import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Book } from "lucide-react";
import { toast } from "sonner";
import { bookService, AuthorStats } from "@/services/bookService";
import { Skeleton } from "@/components/ui/skeleton";

const AuthorsPage = () => {
  const [authors, setAuthors] = useState<AuthorStats[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<AuthorStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setIsLoading(true);
        const data = await bookService.getAuthors();
        setAuthors(data);
        setFilteredAuthors(data);
      } catch (error) {
        toast.error("Falha ao carregar autores.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = authors.filter((author) =>
      author.author.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredAuthors(filtered);
  };

  const AuthorCardSkeleton = () => (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-end justify-between text-sm text-muted-foreground">
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Autores</h1>
        <Input
          placeholder="Filtrar por autor..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, index) => <AuthorCardSkeleton key={index} />)
        ) : (
          filteredAuthors.map((authorStat) => (
            <Card key={authorStat.author} className="flex flex-col hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
                <div className="p-3 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
                  <Users className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg truncate">{authorStat.author}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-end justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Book className="h-4 w-4" />
                  <span>{authorStat.bookCount} {authorStat.bookCount > 1 ? 'livros' : 'livro'}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AuthorsPage;