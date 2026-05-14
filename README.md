# 📚 수강생 관리 시스템 (HTML 버전)

설치 없이 바로 쓸 수 있는 수강생 관리 웹사이트입니다.

---

## 📁 파일 목록

| 파일 | 설명 |
|---|---|
| **config.js** | ⚠️ 여기만 수정하면 됩니다! Supabase 설정 |
| login.html | 로그인 |
| signup.html | 회원가입 |
| dashboard.html | 대시보드 |
| notices.html | 공지사항 |
| my-courses.html | 이수현황 |
| board.html | 자유게시판 목록 |
| post.html | 게시글 상세 |
| post-write.html | 게시글 작성 |
| admin.html | 관리자 페이지 |
| common.js | 공통 기능 (수정 불필요) |
| supabase_setup.sql | DB 설정 SQL |

---

## ⚡ 사용 방법

### 1단계 — config.js 수정

메모장으로 `config.js` 파일을 열고 아래 두 줄을 수정하세요:

```js
const SUPABASE_URL = 'https://여기에_URL.supabase.co';
const SUPABASE_ANON_KEY = '여기에_키';
const ADMIN_EMAILS = ['관리자이메일@example.com'];
```

👉 Supabase 대시보드 → Project Settings → API 에서 복사

### 2단계 — Supabase SQL 실행

`supabase_setup.sql` 내용을 Supabase → SQL Editor 에 붙여넣고 실행

### 3단계 — 실행

`login.html` 파일을 더블클릭하면 바로 실행됩니다!

---

## 🚀 Vercel 배포 (인터넷에 올리기)

1. [vercel.com](https://vercel.com) 가입
2. 폴더 전체를 GitHub에 올리기
3. Vercel에서 해당 저장소 연결하면 자동 배포!

또는 더 간단하게:
- [netlify.com](https://netlify.com) 접속
- 폴더를 드래그 앤 드롭하면 즉시 배포!
