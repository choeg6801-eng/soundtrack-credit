import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';
import { server } from './lib/server.js';
import { createSupabaseBackend } from './backend/supabase.js';
import { createLocalBackend } from './backend/local.js';

try {
  const t = localStorage.getItem('sc.theme');
  if (t) document.documentElement.dataset.theme = t;
} catch (e) { /* 저장 불가 환경 */ }

async function boot() {
  const config = (await server.config()) || { supabaseUrl: null, movies: false, accountDeletion: false };
  const backend = config.supabaseUrl
    ? createSupabaseBackend({ url: config.supabaseUrl, anonKey: config.supabaseAnonKey })
    : createLocalBackend();
  let init = { user: null, recovery: false, error: null };
  try { init = { ...init, ...(await backend.init()) }; } catch (e) { init.error = e.message; }
  createRoot(document.getElementById('root')).render(<App backend={backend} config={config} init={init} />);
}
boot();
