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

interface Book {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  ano_publicacao: number;
}

interface BookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: Book | null;
  onSave: (book: Omit<Book, "id">) => void;
}

const BookForm = ({ book, onSave, onCancel }: { book: Book | null, onSave: (book: Omit<Book, "id">) => void, onCancel: () => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: book?.titulo || "",
    autor: book?.autor || "",
    genero: book?.genero || "",
    ano_publicacao: book?.ano_publicacao.toString() || "",
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