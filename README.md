# Soundtrack Credit

시네필을 위한 스마트 시네마 아카이브 서비스입니다.

| 주소 | 내용 |
| --- | --- |
| `/` | 소개(랜딩) 페이지 · 사전 알림 신청 |
| `/app/` | **서비스 웹앱** — 회원가입·로그인, 티켓북, 30초 보이스 메모, OST·촬영지, 추천, 링·태그 연결 |
| `/privacy`, `/terms` | 개인정보처리방침·이용약관 (초안) |
| `/api/*` | 서버 기능 (Vercel 함수) |

GitHub에 올리고 Vercel로 배포하면 **바로 동작**합니다. 아래 설정을 하기 전에는 앱이 **체험 모드**(이 브라우저에만 저장)로 열리고, 설정을 마치면 실제 회원 서비스로 바뀝니다.

---

## 1. 배포 (이미 했다면 건너뛰기)

1. GitHub에서 **Private** 저장소를 만들고 이 폴더 안의 파일을 모두 올립니다. (`app-src`, `api`, `supabase`, `tools` 폴더 포함)
2. vercel.com → **Add New… → Project** → 저장소 **Import** → Framework Preset **Other**, Build Command·Output Directory는 비워 두고 **Deploy**.

> 기존 저장소에 덮어쓸 때는 GitHub에서 **Add file → Upload files**로 압축을 푼 파일을 모두 끌어다 놓으면 됩니다.

---

## 2. Supabase 연결 (회원·데이터·녹음 저장) — 약 10분

1. **supabase.com** 가입 → **New project**
   - Region: **Northeast Asia (Seoul)**
   - Database Password는 따로 안전하게 보관
2. 왼쪽 **SQL Editor → New query** → 이 저장소의 `supabase/schema.sql` 내용을 전부 붙여 넣고 **Run**
   - 표(회원 프로필·티켓·링·사전 알림), 보안 규칙(본인 데이터만 접근), 녹음 저장 공간(비공개)이 한 번에 만들어집니다.
3. **Authentication → URL Configuration**
   - Site URL: `https://내도메인` (예: `https://soundtrack-credit.vercel.app`)
   - Redirect URLs에 추가: `https://내도메인/app/`
4. **Project Settings → API Keys**(또는 Data API)에서 세 값을 복사
   - Project URL → `SUPABASE_URL`
   - `anon` `public` 키 → `SUPABASE_ANON_KEY`
   - `service_role` 키 → `SUPABASE_SERVICE_ROLE_KEY` (**절대 공개 금지** — Vercel 환경 변수에만 넣기)
5. **메일 발송 설정 (꼭 필요)** — Supabase 기본 메일은 **시간당 2통**뿐이고 **프로젝트 팀원 주소로만** 보내져서, 일반 회원은 가입 확인 메일을 받지 못합니다. 둘 중 하나를 하세요.
   - **권장:** Resend·SendGrid 같은 메일 서비스 가입 → **Authentication → Emails → SMTP Settings**에 입력 (도메인 인증 필요)
   - **베타 기간 임시 방법:** **Authentication → Sign In / Providers → Email** 에서 **Confirm email** 끄기 → 가입 즉시 로그인됩니다. (이 경우에도 ‘메일 링크 로그인’·‘비밀번호 재설정’은 SMTP 설정 후에 동작)
6. (권장) **Authentication → Emails → Templates**에서 가입 확인·로그인 링크·비밀번호 재설정 메일 문구를 한국어로 바꾸기

## 3. Vercel 환경 변수 넣기

Vercel 프로젝트 → **Settings → Environment Variables** 에 아래를 추가하고, **Deployments → 최근 배포 → ⋯ → Redeploy**.

| 이름 | 값 | 없으면 |
| --- | --- | --- |
| `SUPABASE_URL` | Supabase Project URL | 체험 모드로 동작 |
| `SUPABASE_ANON_KEY` | anon public 키 | 체험 모드로 동작 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role 키 | 회원 탈퇴 버튼이 비활성화 |
| `TMDB_API_KEY` | TMDB API 키 또는 읽기 토큰 | 기본 영화 15편 안에서만 검색·추천 |

**확인:** 브라우저에서 `https://내도메인/api/config` 를 열어 `"supabaseUrl"` 에 주소가 보이면 연결 완료입니다.

## 4. TMDB 키 (전 세계 영화 검색·포스터·추천)

themoviedb.org 가입 → **Settings → API** → 신청서 작성 → **API Key** 복사 → 위 `TMDB_API_KEY` 에 넣기.
TMDB 무료 키는 **비상업용**입니다. 유료 판매를 시작하기 전에 TMDB에 상업용 라이선스를 문의하세요. (`LAUNCH.md` 참고)

## 5. 운영하면서 자주 하는 일

- **사전 알림 신청자 보기:** Supabase → **Table Editor → waitlist** → 오른쪽 위 **Export → CSV**
- **회원·티켓 보기:** Table Editor → `profiles`, `tickets`
- **녹음 파일:** Storage → `voice` (회원별 폴더, 비공개)
- **촬영지 관리:** Table Editor → `filming_locations`
  - 회원 제보는 `status = pending` 으로 들어와요. 확인 후 `approved` 로 바꾸면 모든 회원에게 보여요 (틀리면 `rejected`).
  - 직접 추가: Insert row → `movie_id`(TMDB 영화 번호), `name`, `note`, `lat`·`lon`(구글 지도에서 장소 우클릭 → 좌표 복사), `source = curated`, `status = approved`
  - 영화 번호는 themoviedb.org 영화 주소 끝의 숫자예요 (예: 라라랜드 313369)
  - 운영자 목록이 없거나 부족하면 위키데이터의 촬영지가 자동으로 함께 표시돼요
- **정식 멤버로 바꾸기(수동):** `profiles` 표에서 해당 회원의 `plan` 을 `member` 로 수정

---

## 기능별 지원 환경

| 기능 | 지원 | 지원하지 않을 때 |
| --- | --- | --- |
| 바코드 자동 인식 | 안드로이드 Chrome | 예매번호 직접 입력 또는 건너뛰기 |
| 30초 녹음 | 최신 Chrome·Safari·Edge (아이폰 포함) | 안내 문구 표시 |
| 메일 링크 로그인·비밀번호 재설정 | 링크를 **요청한 같은 브라우저**에서 열기 (보안) | 다른 기기에서 열면 ‘이메일과 비밀번호로 로그인’ 안내 |
| 음성 → 글 변환 | Chrome, Safari (기기 음성 인식) | 녹음만 저장, 글은 직접 입력 |
| 링에 NFC 기록 | 안드로이드 Chrome | 주소 복사 → 아이폰은 ‘NFC Tools’ 앱으로 기록 |
| 링 태그해서 열기 | NFC 되는 모든 휴대폰 (아이폰 XS 이후 포함) | — |
| 홈 화면에 추가(앱처럼) | 안드로이드·아이폰 | — |

## 링이 동작하는 방식

- 링(NFC 칩)에는 `https://내도메인/app/#/tap/<링코드>` 주소만 기록됩니다. 개인정보는 들어가지 않습니다.
- **앱에서 직접 기록:** 링·태그 메뉴 → 연결 시작
- **공장에서 미리 기록해 출고:** Supabase SQL Editor에서 아래를 실행하면 링 코드와 **연결 코드(8자리)**가 만들어집니다. 결과를 CSV로 내려받아 공장에 전달하세요.
  ```sql
  select ring_id, claim_code, 'https://내도메인/app/#/tap/' || ring_id as nfc_url
  from public.generate_rings(100);
  ```
  - `nfc_url` → 링 칩에 기록, `claim_code` → 포장 안 카드에 인쇄
  - 고객이 처음 태그하면 “연결 코드 8자리” 입력 화면이 나오고, 맞으면 그 계정에 연결됩니다. 코드를 모르는 사람은 링 주소를 알아도 가로챌 수 없고, 10번 틀리면 잠깁니다.
  - 고객이 연결을 해제(또는 탈퇴)하면 다시 연결 코드로 다른 계정에 연결할 수 있어요(중고 양도).
- 태그하면: 최근 8시간 안에 등록한 티켓의 녹음 화면, 없으면 새 티켓 등록 화면이 열립니다.

---

## 개발자용

```
app-src/       웹앱 소스 (React). 수정 후 빌드하면 app/app.js 가 새로 만들어집니다
  └ npm install && npm run build
app/           웹앱 배포 파일 (index.html, app.css, app.js)
api/           Vercel 서버 함수 (Node 18+, 외부 패키지 없음)
supabase/      데이터베이스 스키마
tools/dev-server.js   로컬 실행: node tools/dev-server.js → http://localhost:3000
```

로컬에서 실제 Supabase로 테스트하려면 저장소 맨 위에 `.env.local` 파일을 만들고 `SUPABASE_URL=...` 형식으로 값을 적은 뒤 `node tools/dev-server.js` 를 실행하세요. (`.env.local` 은 GitHub에 올라가지 않습니다)

랜딩 페이지(`index.html`, `app.js`, `runtime.js`)는 디자인 시안에서 변환한 정적 파일입니다.

---

출시 전에 해야 할 일(사업자, 결제, 라이선스, 하드웨어, 비용)은 **`LAUNCH.md`** 에 정리했습니다.
