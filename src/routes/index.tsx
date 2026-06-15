import { createFileRoute } from "@tanstack/react-router";
import App from "@/app/App";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pace Seller" },
      { name: "description", content: "Plataforma de vendas, catálogo e marketing." },
    ],
  }),
  component: App,
});
