import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle } from "lucide-react";
import { Book } from "@/services/bookService";

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onSave: (book: { titulo: string, autor: string, genero: string, pages: number, ano_publicacao: number }) => void;
}

const BookForm = ({ book, onSave, onCancel }: { book: Book | null, onSave: (book: { titulo: string, autor: string, genero: string, pages: number, ano_publicacao: number }) => void, onCancel: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: book?.title || "",
    autor: book?.author || "",
    genero: book?.genre || "",
    ano_publicacao: book?.publication_year?.toString() || "",
    pages: book?.pages?.toString() || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onSave({
        titulo: formData.titulo,
        autor: formData.autor,
        genero: formData.genero,
        ano_publicacao: parseInt(formData.ano_publicacao),
        pages: parseInt(formData.pages),
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="titulo">Título</Label>
          <Input
            id="titulo"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="autor">Autor</Label>
          <Input
            id="autor"
            value={formData.autor}
            onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="genero">Gênero</Label>
          <Input
            id="genero"
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
            disabled={isLoading}
            placeholder="Ex: Ficção Científica"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="ano">Ano de Publicação</Label>
          <Input
            id="ano"
            type="number"
            value={formData.ano_publicacao}
            onChange={(e) => setFormData({ ...formData, ano_publicacao: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pages">Páginas</Label>
          <Input
            id="pages"
            type="number"
            value={formData.pages}
            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
            disabled={isLoading}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Salvar"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export const BookDialog = ({ open, onOpenChange, book, onSave }: BookDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{book ? "Editar Livro" : "Adicionar Novo Livro"}</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para {book ? "atualizar" : "adicionar"} o livro no catálogo.
          </DialogDescription>
        </DialogHeader>
        {open && <BookForm key={book?.id || 'new'} book={book} onSave={onSave} onCancel={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
};