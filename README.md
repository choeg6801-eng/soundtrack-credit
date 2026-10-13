# Soundtrack Credit — 사이트

시네필을 위한 스마트 시네마 아카이브 링 & 태그 소개 사이트입니다.
빌드 과정이 없는 정적 사이트라서 파일 그대로 올리면 바로 동작합니다.

## 파일 구성

| 파일 | 역할 |
| --- | --- |
| `index.html` | 페이지 뼈대, 메타·OG 태그, 스타일 |
| `app.js` | 화면과 동작 전체 (추천, 갤러리, 녹음 체험, BGM 등) |
| `runtime.js` | 화면을 그리는 작은 엔진 (외부 라이브러리 없음) |
| `form.js` | 사전 알림 신청 폼 처리 |
| `posters/` | 영화 포스터 15장 |
| `favicon.svg`, `og.png` | 탭 아이콘, 링크 공유 미리보기 이미지 |
| `vercel.json` | Vercel 캐시·보안 헤더 설정 |

## 내 컴퓨터에서 미리 보기

`index.html`을 더블클릭하면 브라우저에서 열립니다.

## GitHub에 올리기

1. github.com 로그인 → 오른쪽 위 **+** → **New repository**
2. 이름 입력 (예: `soundtrack-credit`), **Private** 선택 → **Create repository**
3. 새 저장소 화면에서 **uploading an existing file** 클릭
4. 이 폴더 안의 파일과 `posters` 폴더를 모두 끌어다 놓기 → **Commit changes**

## Vercel로 배포하기

1. vercel.com → **Continue with GitHub** 로 로그인
2. **Add New… → Project** → 방금 만든 저장소 옆 **Import**
3. 설정은 그대로 둡니다
   - Framework Preset: **Other**
   - Build Command: 비움 / Output Directory: 비움 (루트)
4. **Deploy** → 1분 안에 `https://<이름>.vercel.app` 주소가 생깁니다

이후 GitHub에 파일을 다시 올리면(커밋) Vercel이 자동으로 재배포합니다.

## 공개 전에 꼭 할 일

- **포스터 저작권**: 포스터는 각 배급사 저작물입니다. 공개 배포 전에 사용 허락을 받거나 자체 이미지로 교체하세요. (`posters/` 파일을 같은 이름으로 바꾸면 됩니다)
- **사전 알림 폼 연결**: `index.html`의 `window.SC_FORM_ENDPOINT = ''` 에 Formspree 등 폼 수집 주소를 넣으세요. 비워 두면 "곧 열려요" 안내만 나옵니다.
- **사업자 정보**: 푸터의 `[상호]`, `[대표자명]`, `[사업자등록번호]` 등 자리표시자를 실제 정보로 바꾸세요. (`app.js`에서 검색)
- **개인정보처리방침·이용약관**: 지금은 링크만 있습니다. 실제 페이지를 만들어 연결하세요.
- **예시 데이터**: 좌석·날씨·음성 메모·날짜는 모두 예시입니다.
- **OG 이미지**: `og.png` 를 원하는 이미지(1200×630)로 바꿀 수 있습니다. 공유 미리보기는 배포 후 절대 주소가 필요하면 `index.html`의 `og:image` 를 `https://<도메인>/og.png` 로 바꾸세요.
