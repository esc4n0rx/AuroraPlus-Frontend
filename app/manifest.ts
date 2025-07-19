import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Aurora Streaming",
    short_name: "Aurora",
    description: "Plataforma de streaming Aurora - Filmes, séries e esportes ao vivo",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f23",
    theme_color: "#1a1a2e",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    categories: ["entertainment", "video"],
    orientation: "portrait-primary",
  }
}
