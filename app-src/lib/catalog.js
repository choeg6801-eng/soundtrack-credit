// 체험 모드·TMDB 미설정 시 쓰는 기본 영화 목록 (포스터는 /posters 폴더)
// id 는 TMDB 영화 ID 와 같아서, 나중에 TMDB 를 켜도 기록이 그대로 이어집니다.
const P = (f) => `/posters/${f}.jpg`;
export const CATALOG = [
  { id: 313369, title: '라라랜드', originalTitle: 'La La Land', year: 2016, genres: ['음악', '로맨스', '드라마'], poster: P('la-la-land'), moods: ['아련함', '설렘'], sound: '재즈', ost: 'City of Stars', place: 'LA 그리피스 천문대' },
  { id: 198277, title: '비긴 어게인', originalTitle: 'Begin Again', year: 2013, genres: ['음악', '드라마'], poster: P('begin-again'), moods: ['설렘', '청량'], sound: '팝', ost: 'Lost Stars', place: '뉴욕 맨해튼' },
  { id: 122906, title: '어바웃 타임', originalTitle: 'About Time', year: 2013, genres: ['로맨스', '판타지'], poster: P('about-time'), moods: ['포근함', '아련함'], sound: '팝', ost: 'How Long Will I Love You', place: '영국 콘월 해변' },
  { id: 37165, title: '트루먼 쇼', originalTitle: 'The Truman Show', year: 1998, genres: ['드라마', '코미디'], poster: P('truman-show'), moods: ['그리움', '경이'], sound: '피아노', ost: 'Truman Sleeps', place: '미국 플로리다 시사이드' },
  { id: 135397, title: '쥬라기 월드', originalTitle: 'Jurassic World', year: 2015, genres: ['액션', '모험', 'SF'], poster: P('jurassic-world'), moods: ['긴장', '경이'], sound: '오케스트라', ost: 'Welcome to Jurassic World', place: '하와이 카우아이' },
  { id: 5723, title: '원스', originalTitle: 'Once', year: 2007, genres: ['음악', '로맨스', '드라마'], poster: P('once'), moods: ['아련함', '설렘'], sound: '어쿠스틱', ost: 'Falling Slowly', place: '더블린 그래프턴 스트리트' },
  { id: 369557, title: '싱 스트리트', originalTitle: 'Sing Street', year: 2016, genres: ['음악', '드라마', '로맨스'], poster: P('sing-street'), moods: ['설렘', '청량'], sound: '신스', ost: 'Drive It Like You Stole It', place: '아일랜드 더블린' },
  { id: 244786, title: '위플래쉬', originalTitle: 'Whiplash', year: 2014, genres: ['음악', '드라마'], poster: P('whiplash'), moods: ['긴장'], sound: '재즈', ost: 'Whiplash', place: '미국 로스앤젤레스' },
  { id: 509, title: '노팅 힐', originalTitle: 'Notting Hill', year: 1999, genres: ['로맨스', '코미디'], poster: P('notting-hill'), moods: ['설렘', '포근함'], sound: '팝', ost: 'She', place: '런던 포토벨로 로드' },
  { id: 59436, title: '미드나잇 인 파리', originalTitle: 'Midnight in Paris', year: 2011, genres: ['로맨스', '판타지', '코미디'], poster: P('midnight-in-paris'), moods: ['아련함', '설렘'], sound: '재즈', ost: 'Si Tu Vois Ma Mère', place: '파리 생테티엔뒤몽 성당 계단' },
  { id: 76, title: '비포 선라이즈', originalTitle: 'Before Sunrise', year: 1995, genres: ['로맨스', '드라마'], poster: P('before-sunrise'), moods: ['설렘', '아련함'], sound: '어쿠스틱', ost: 'Come Here', place: '오스트리아 빈 프라터 대관람차' },
  { id: 157336, title: '인터스텔라', originalTitle: 'Interstellar', year: 2014, genres: ['SF', '드라마', '모험'], poster: P('interstellar'), moods: ['경이', '그리움'], sound: '오케스트라', ost: 'Cornfield Chase', place: '아이슬란드 스비나펠스요쿨 빙하' },
  { id: 14160, title: '업', originalTitle: 'Up', year: 2009, genres: ['애니메이션', '가족', '모험'], poster: P('up'), moods: ['아련함', '포근함'], sound: '오케스트라', ost: 'Married Life', place: '베네수엘라 앙헬 폭포 (배경 모티브)' },
  { id: 862, title: '토이 스토리', originalTitle: 'Toy Story', year: 1995, genres: ['애니메이션', '가족', '코미디'], poster: P('toy-story'), moods: ['포근함', '설렘'], sound: '팝', ost: "You've Got a Friend in Me", place: '' },
  { id: 361743, title: '탑건: 매버릭', originalTitle: 'Top Gun: Maverick', year: 2022, genres: ['액션', '드라마'], poster: P('top-gun-maverick'), moods: ['긴장', '경이'], sound: '팝', ost: 'Hold My Hand', place: '샌디에이고 노스아일랜드 해군기지' },
];

export const MOODS = ['설렘', '아련함', '포근함', '그리움', '경이', '긴장', '청량', '위로'];

export const byId = (id) => CATALOG.find((m) => m.id === Number(id)) || null;

const norm = (s) => String(s || '').toLowerCase().replace(/[\s:·\-'’.]/g, '');
export function searchCatalog(q) {
  const t = norm(q);
  if (!t) return CATALOG.slice();
  return CATALOG.filter((m) => norm(m.title).includes(t) || norm(m.originalTitle).includes(t));
}

// 기본 목록 안에서의 추천: 무드 ×3, 장르 ×2, 사운드 ×2 (랜딩 페이지의 추천 계산과 같은 방식)
export function recommendFromCatalog(tickets) {
  const seen = new Set(tickets.map((t) => Number(t.movie_id)).filter(Boolean));
  const seeds = tickets.map((t) => {
    const c = byId(t.movie_id);
    return { title: t.title, moods: (t.moods && t.moods.length ? t.moods : c ? c.moods : []), genres: t.genres && t.genres.length ? t.genres : c ? c.genres : [], sound: c ? c.sound : null };
  });
  if (!seeds.length) return [];
  const out = CATALOG.filter((m) => !seen.has(m.id)).map((m) => {
    let best = { score: -1, seed: null, sharedMoods: [], sharedGenres: [] };
    for (const s of seeds) {
      const sm = m.moods.filter((x) => s.moods.includes(x));
      const sg = m.genres.filter((x) => s.genres.includes(x));
      const score = sm.length * 3 + Math.min(sg.length, 2) * 2 + (s.sound && s.sound === m.sound ? 2 : 0);
      if (score > best.score) best = { score, seed: s.title, sharedMoods: sm, sharedGenres: sg };
    }
    return { ...m, score: best.score, becauseTitles: best.seed ? [best.seed] : [], sharedMoods: best.sharedMoods, sharedGenres: best.sharedGenres };
  }).filter((m) => m.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
  const top = out.length ? out[0].score : 1;
  out.forEach((m) => { m.match = Math.round(55 + 43 * (m.score / top)); });
  return out;
}

// ── 취향으로 찾기 ───────────────────────────
export const GENRE_CHOICES = ['로맨스', '드라마', '음악', '코미디', '판타지', 'SF', '모험', '액션', '애니메이션', '가족', '스릴러', '미스터리', '범죄', '역사', '공포', '다큐멘터리'];

// 무드를 고르면 어울리는 장르로 바꿔서 함께 찾습니다
export const MOOD_GENRES = {
  설렘: ['로맨스', '음악'], 아련함: ['드라마', '로맨스'], 포근함: ['가족', '애니메이션', '코미디'], 그리움: ['드라마'],
  경이: ['SF', '판타지', '모험'], 긴장: ['스릴러', '액션'], 청량: ['음악', '코미디'], 위로: ['드라마', '가족'],
};

export function tasteGenres(genres, moods) {
  const out = [...genres];
  moods.forEach((m) => (MOOD_GENRES[m] || []).forEach((g) => { if (!out.includes(g)) out.push(g); }));
  return out.slice(0, 6);
}

export function discoverFromCatalog(genres, moods, exclude) {
  const ex = new Set(exclude.map(Number));
  const all = tasteGenres(genres, moods);
  const out = CATALOG.filter((m) => !ex.has(m.id)).map((m) => {
    const sg = m.genres.filter((g) => all.includes(g));
    const sm = m.moods.filter((x) => moods.includes(x));
    return { ...m, sharedGenres: sg, sharedMoods: sm, score: sg.length * 2 + sm.length * 3 };
  }).filter((m) => m.score > 0).sort((a, b) => b.score - a.score);
  const top = out.length ? out[0].score : 1;
  out.forEach((m) => { m.match = Math.round(55 + 43 * (m.score / top)); });
  return out;
}
