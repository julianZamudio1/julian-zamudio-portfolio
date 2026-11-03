# Portafolio

Landing de portafolio con Next.js 16, Three.js y GSAP. Fondo de filamentos de luz en WebGL que reacciona al cursor y cambia de forma en cada sección, scroll suave con Lenis y portadas generadas con Higgsfield.

## Desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:3000.

## Qué editar

- **`src/content.ts`**: todo el texto. Lo marcado con `TODO` son datos de ejemplo (proyectos, métricas, testimonios, redes, email). Cámbialos antes de publicar.
- **`src/assets/`**: portadas de proyectos (`cover-1..4.webp`) y el póster del hero. Puedes reemplazarlas por capturas reales de tus proyectos.
- **`public/cv.pdf`**: sube tu CV con ese nombre (el botón "Descargar CV" apunta ahí).
- **`src/lib/scenes.ts`**: la forma del haz de luz en cada sección (puntos de una curva Bézier en unidades de pantalla).
- **Colores**: tokens en `src/app/globals.css` (`--color-lime`, `--color-bg`, etc.). Si cambias el acento, cambia también `lime`/`teal` en el shader de `src/components/FilamentScene.tsx`.

## Publicar en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En vercel.com → **Add New → Project**, importa el repositorio. Vercel detecta Next.js solo; no hace falta configurar nada.
3. Cuando tengas dominio, ponlo en `site.url` dentro de `src/content.ts` (se usa para las imágenes al compartir en redes).

## Notas

- Con `prefers-reduced-motion` activo se desactivan el scroll suave y las animaciones; el fondo queda estático.
- Sin WebGL se muestra el póster del hero en lugar de la escena 3D.
