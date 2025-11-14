import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, MoreHorizontal, Edit, Trash } from "lucide-react";
import { BookDialog } from "@/components/BookDialog";
import { DeleteBookDialog } from "@/components/DeleteBookDialog";
import { toast } from "sonner";

interface Book {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano_publicacao: number;
}

const mockBooks: Book[] = [
  { id: 1, titulo: "1984", autor: "George Orwell", genero: "Ficção Científica", ano_publicacao: 1949 },
  { id: 2, titulo: "O Senhor dos Anéis", autor: "J.R.R. Tolkien", genero: "Fantasia", ano_publicacao: 1954 },
  { id: 3, titulo: "Dom Casmurro", autor: "Machado de Assis", genero: "Romance", ano_publicacao: 1899 },
  { id: 4, titulo: "Harry Potter e a Pedra Filosofal", autor: "J.K. Rowling", genero: "Fantasia", ano_publicacao: 1997 },
  { id: 5, titulo: "O Pequeno Príncipe", autor: "Antoine de Saint-Exupéry", genero: "Fábula", ano_publicacao: 1943 },
];

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(mockBooks);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const booksPerPage = 5;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = books.filter((book) =>
      book.titulo.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const handleAddBook = () => {
    setSelectedBook(null);
    setIsDialogOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    setIsDialogOpen(true);
  };

  const handleDeleteBook = (book: Book) => {
    setSelectedBook(book);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveBook = (bookData: Omit<Book, "id">) => {
    if (selectedBook) {
      const updatedBooks = books.map((book) =>
        book.id === selectedBook.id ? { ...bookData, id: selectedBook.id } : book
      );
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      toast.success("Livro atualizado com sucesso!");
    } else {
      const newBook = { ...bookData, id: Math.max(...books.map((b) => b.id)) + 1 };
      setBooks([...books, newBook]);
      setFilteredBooks([...books, newBook]);
      toast.success("Livro adicionado com sucesso!");
    }
    setIsDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedBook) {
      const updatedBooks = books.filter((book) => book.id !== selectedBook.id);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      toast.success("Livro deletado!");
      setIsDeleteDialogOpen(false);
    }
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de Livros</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os livros do seu catálogo
          </p>
        </div>
        <Button onClick={handleAddBook}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo Livro
        </Button>
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Filtrar por título..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Tabela */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Gênero</TableHead>
              <TableHead>Ano de Publicação</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum livro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              currentBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.titulo}</TableCell>
                  <TableCell>{book.autor}</TableCell>
                  <TableCell>{book.genero}</TableCell>
                  <TableCell>{book.ano_publicacao}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditBook(book)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteBook(book)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentPage(index + 1)}
                  isActive={currentPage === index + 1}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Diálogos */}
      <BookDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        book={selectedBook}
        onSave={handleSaveBook}
      />
      <DeleteBookDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        bookTitle={selectedBook?.titulo || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default BooksPage;