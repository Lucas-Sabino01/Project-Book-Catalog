import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Toaster richColors position="top-right" />
    </div>
  );
}

export default App;