import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build:archivo` usa el modo "archivo": todo (JS, CSS, fuentes e imágenes)
// queda dentro de un solo HTML que se abre con doble clic, sin servidor ni internet.
export default defineConfig(({ mode }) => {
  const archivo = mode === 'archivo';
  return {
    plugins: [react(), tailwindcss(), ...(archivo ? [viteSingleFile()] : [])],
    build: archivo ? { outDir: 'dist-archivo', assetsInlineLimit: Infinity } : {},
    // fs.allow '..': permite importar los .md de /Contenido (fuera de /web) como fuente de datos.
    server: { port: 5173, strictPort: true, fs: { allow: ['..'] } },
    preview: { port: 4173, strictPort: true },
  };
});
