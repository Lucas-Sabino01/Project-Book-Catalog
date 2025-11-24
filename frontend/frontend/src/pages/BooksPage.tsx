import { useState, useEffect } from "react";
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
import { bookService, Book } from "@/services/bookService";
import { Skeleton } from "@/components/ui/skeleton";

const BooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const booksPerPage = 5;

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const filtered = books.filter((book) =>
      book.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredBooks(filtered);
    setCurrentPage(1);
  };

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const data = await bookService.getAllBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      toast.error("Falha ao buscar livros.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const handleSaveBook = async (bookData: { titulo: string, autor: string, genero: string, pages: number, ano_publicacao: number }) => {
    try {
      if (selectedBook) {
        await bookService.updateBook(selectedBook.id!, bookData);
        toast.success("Livro atualizado com sucesso!");
      } else {
        await bookService.createBook(bookData);
        toast.success("Livro adicionado com sucesso!");
      }
      fetchBooks();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar livro.");
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedBook) {
      try {
        await bookService.deleteBook(selectedBook.id!);
        toast.success("Livro deletado com sucesso!");
        fetchBooks();
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Falha ao deletar livro.");
      }
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
            {isLoading ? (
              Array.from({ length: booksPerPage }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : currentBooks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum livro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              currentBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell> 
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.publication_year}</TableCell>
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
        bookTitle={selectedBook?.title || ""}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default BooksPage;