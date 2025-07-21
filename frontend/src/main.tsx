import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/auth/Login.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrivateRoute from "./components/PrivateRoute.tsx";
import Dashboard from "./pages/ui/Dashboard.tsx";
import AuthProvider from "./providers/AuthProvider.tsx";
import PrivateRoute2 from "./components/PrivateRoute2.tsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Notes from "./pages/ui/Notes.tsx";
import Category from "./pages/ui/Category.tsx";
import Todo from "./pages/ui/Todo.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route element={<PrivateRoute2 />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<AuthProvider />}>
        <Route element={<PrivateRoute />}>
          <Route path="/" index={true} element={<Dashboard />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/category" element={<Category />} />
          <Route path="/todo" element={<Todo />} />
        </Route>
      </Route>
    </Route>
  )
);

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={true} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
