// 회원 탈퇴  POST /api/delete-account  (Authorization: Bearer <로그인 토큰>)
// 보이스 메모 파일 → 계정 순서로 삭제합니다. 티켓·태그·프로필은 DB에서 자동으로 함께 지워집니다.
// 환경 변수 SUPABASE_SERVICE_ROLE_KEY 필요 (절대 브라우저 코드에 넣지 마세요).
const { send, getJson } = require('./_lib/http');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  const base = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anon = process.env.SUPABASE_ANON_KEY || '';
  if (!base || !service) return send(res, 501, { error: '탈퇴 기능이 아직 설정되지 않았습니다' });
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: 'login' });

  const who = await getJson(`${base}/auth/v1/user`, { headers: { apikey: anon || service, Authorization: `Bearer ${token}` } });
  if (!who.ok || !who.data || !who.data.id) return send(res, 401, { error: 'login' });
  const uid = who.data.id;
  const admin = { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' };

  // 보이스 메모 파일을 모두 지운 뒤에만 계정을 삭제합니다 (중간에 실패하면 계정은 그대로 두고 오류)
  let removed = 0;
  for (let round = 0; round < 50; round++) {
    const list = await getJson(`${base}/storage/v1/object/list/voice`, {
      method: 'POST', headers: admin, body: JSON.stringify({ prefix: uid, limit: 1000, offset: 0 }),
    });
    if (!list.ok || !Array.isArray(list.data)) return send(res, 502, { error: '녹음 파일 정리 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.' });
    const names = list.data.filter((f) => f && f.name).map((f) => `${uid}/${f.name}`);
    if (!names.length) break;
    const rm = await getJson(`${base}/storage/v1/object/voice`, { method: 'DELETE', headers: admin, body: JSON.stringify({ prefixes: names }) });
    if (!rm.ok) return send(res, 502, { error: '녹음 파일 정리 중 문제가 생겼습니다. 잠시 후 다시 시도해 주세요.' });
    removed += names.length;
  }
  const del = await getJson(`${base}/auth/v1/admin/users/${uid}`, { method: 'DELETE', headers: admin });
  if (!del.ok) return send(res, 502, { error: '탈퇴 처리 중 문제가 생겼습니다' });
  send(res, 200, { ok: true, removedFiles: removed });
};
