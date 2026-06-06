import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn("Faltan las variables de entorno de Supabase. Por favor, asegúrate de configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.");
}

export const supabase = createBrowserClient(
  supabaseUrl || "",
  supabaseKey || ""
);
