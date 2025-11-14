import { Button } from "@/components/ui/button";

export function BibliotecaPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Catálogo de Livros</h1>
        <Button>Adicionar Novo Livro</Button>
      </div>
      <p>(Aqui vai a tabela ou os cards dos livros...)</p>
    </div>
  );
}