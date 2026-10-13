// 앱이 처음 열릴 때 읽는 공개 설정. (anon 키는 공개용 키라서 브라우저에 보내도 안전합니다)
const { send } = require('./_lib/http');

module.exports = async function handler(req, res) {
  const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const anon = process.env.SUPABASE_ANON_KEY || '';
  send(res, 200, {
    supabaseUrl: url && anon ? url : null,
    supabaseAnonKey: url && anon ? anon : null,
    movies: Boolean(process.env.TMDB_API_KEY),
    accountDeletion: Boolean(url && process.env.SUPABASE_SERVICE_ROLE_KEY),
  });
};
