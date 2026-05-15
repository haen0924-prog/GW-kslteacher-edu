const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser   = null;  // 관리자 (Supabase Auth)
let currentStudent = null; // 수강생 (세션)

async function requireAuth() {
  const studentId = sessionStorage.getItem('student_id');
  const isAdmin   = sessionStorage.getItem('is_admin');

  if (studentId) {
    // 수강생 로그인 상태
    currentStudent = {
      id:   studentId,
      name: sessionStorage.getItem('student_name'),
      isAdmin: false,
    };
    return currentStudent;
  }

  // 관리자 로그인 상태 확인
  const { data } = await sb.auth.getSession();
  if (data.session) {
    currentUser = data.session.user;
    currentStudent = {
      id:      currentUser.id,
      name:    currentUser.user_metadata?.full_name || currentUser.email,
      email:   currentUser.email,
      isAdmin: ADMIN_EMAILS.includes(currentUser.email),
    };
    return currentStudent;
  }

  location.href = 'login.html';
  return null;
}

function isAdminUser() {
  return currentStudent?.isAdmin === true;
}

function logout() {
  sessionStorage.clear();
  localStorage.removeItem('student_id');
  localStorage.removeItem('student_name');
  sb.auth.signOut();
  location.href = 'login.html';
}

function renderSidebar(activePage) {
  const name    = currentStudent?.name ?? '';
  const admin   = isAdminUser();

  const studentNav = [
    { href:'dashboard.html',  label:'대시보드',   icon:'🏠' },
    { href:'notices.html',    label:'공지사항',   icon:'📢' },
    { href:'my-courses.html', label:'이수현황',   icon:'📚' },
    { href:'board.html',      label:'자유게시판', icon:'💬' },
    { href:'mypage.html',     label:'마이페이지', icon:'👤' },
  ];

  const adminNav2 = [
    { href:'dashboard.html',      label:'대시보드',     icon:'🏠' },
    { href:'notices-admin.html',  label:'공지사항 관리', icon:'📢' },
    { href:'board.html',          label:'자유게시판',   icon:'💬' },
    { href:'admin.html',          label:'수강생 관리',   icon:'⚙️' },
  ];

  const navItems = admin ? adminNav2 : studentNav;

  const navHTML = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${activePage===item.href?'active':''}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </a>`).join('');

  const adminNav = '';

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar-logo">
      <div class="sidebar-logo-icon">K</div>
      <div>
        <p class="sidebar-logo-title">한국수어교원 양성과정</p>
        <p class="sidebar-logo-sub">강원특별자치도수어문화원</p>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${navHTML}
      ${adminNav}
    </nav>
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar">${name[0]?.toUpperCase() ?? '?'}</div>
        <div class="user-info">
          <p class="user-email">${name}</p>
          <p class="user-role">${admin ? '관리자' : '수강생'}</p>
        </div>
      </div>
      <button class="logout-btn" onclick="logout()">🚪 로그아웃</button>
    </div>`;
}

const sidebarCSS = `
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Noto Sans KR',sans-serif; background:#f8fafc; display:flex; min-height:100vh; }
  #sidebar { width:240px; background:white; border-right:1px solid #e5e7eb; display:flex; flex-direction:column; min-height:100vh; position:fixed; top:0; left:0; }
  .sidebar-logo { display:flex; align-items:center; gap:0.75rem; padding:1.25rem 1rem; border-bottom:1px solid #f3f4f6; }
  .sidebar-logo-icon { width:36px; height:36px; background:#2563eb; border-radius:0.625rem; display:flex; align-items:center; justify-content:center; color:white; font-weight:700; font-size:0.9rem; flex-shrink:0; }
  .sidebar-logo-title { font-size:0.78rem; font-weight:700; color:#111827; line-height:1.3; }
  .sidebar-logo-sub   { font-size:0.65rem; color:#9ca3af; line-height:1.3; }
  .sidebar-nav { flex:1; padding:0.75rem; display:flex; flex-direction:column; gap:2px; }
  .nav-item { display:flex; align-items:center; gap:0.625rem; padding:0.625rem 0.75rem; border-radius:0.5rem; font-size:0.875rem; font-weight:500; color:#6b7280; text-decoration:none; transition:all 0.15s; }
  .nav-item:hover { background:#f9fafb; color:#111827; }
  .nav-item.active { background:#eff6ff; color:#2563eb; }
  .nav-item.admin-item:hover { background:#fff7ed; color:#ea580c; }
  .nav-item.active-admin { background:#fff7ed; color:#ea580c; }
  .nav-icon { font-size:1rem; }
  .sidebar-footer { padding:0.75rem; border-top:1px solid #f3f4f6; }
  .sidebar-user { display:flex; align-items:center; gap:0.625rem; padding:0.5rem; margin-bottom:0.25rem; }
  .user-avatar { width:32px; height:32px; background:#e5e7eb; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:600; color:#374151; flex-shrink:0; }
  .user-email { font-size:0.75rem; font-weight:500; color:#111827; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:150px; }
  .user-role  { font-size:0.7rem; color:#9ca3af; }
  .logout-btn { width:100%; padding:0.5rem; background:none; border:none; border-radius:0.5rem; font-size:0.8rem; color:#9ca3af; cursor:pointer; text-align:left; font-family:inherit; transition:background 0.15s,color 0.15s; }
  .logout-btn:hover { background:#f9fafb; color:#374151; }
  #main { margin-left:240px; flex:1; padding:2rem; }
  h1.page-title { font-size:1.5rem; font-weight:700; color:#111827; margin-bottom:0.375rem; display:flex; align-items:center; gap:0.5rem; }
  .page-sub { color:#6b7280; font-size:0.875rem; margin-bottom:2rem; }
  .card { background:white; border-radius:0.875rem; border:1px solid #f3f4f6; padding:1.5rem; box-shadow:0 1px 4px rgba(0,0,0,0.04); }
  .btn-primary { background:#2563eb; color:white; border:none; padding:0.6rem 1.25rem; border-radius:0.5rem; font-size:0.875rem; font-weight:600; cursor:pointer; font-family:inherit; transition:background 0.15s; display:inline-flex; align-items:center; gap:0.4rem; text-decoration:none; }
  .btn-primary:hover { background:#1d4ed8; }
  .btn-secondary { background:white; color:#374151; border:1.5px solid #d1d5db; padding:0.6rem 1.25rem; border-radius:0.5rem; font-size:0.875rem; font-weight:500; cursor:pointer; font-family:inherit; transition:background 0.15s; display:inline-flex; align-items:center; gap:0.4rem; text-decoration:none; }
  .btn-secondary:hover { background:#f9fafb; }
  .btn-danger { background:white; color:#ef4444; border:1.5px solid #fca5a5; padding:0.5rem 1rem; border-radius:0.5rem; font-size:0.8rem; font-weight:500; cursor:pointer; font-family:inherit; transition:background 0.15s; }
  .btn-danger:hover { background:#fef2f2; }
  .input-field { width:100%; padding:0.6rem 0.875rem; border:1.5px solid #d1d5db; border-radius:0.5rem; font-size:0.9rem; font-family:inherit; outline:none; transition:border-color 0.2s; }
  .input-field:focus { border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,0.08); }
  .error-msg   { background:#fef2f2; color:#ef4444; padding:0.625rem 0.875rem; border-radius:0.5rem; font-size:0.85rem; margin-bottom:1rem; }
  .success-msg { background:#f0fdf4; color:#16a34a; padding:0.625rem 0.875rem; border-radius:0.5rem; font-size:0.85rem; margin-bottom:1rem; }
  .badge { display:inline-block; padding:0.2rem 0.6rem; border-radius:9999px; font-size:0.75rem; font-weight:500; }
  .badge-blue  { background:#dbeafe; color:#1d4ed8; }
  .badge-green { background:#dcfce7; color:#15803d; }
  .badge-red   { background:#fee2e2; color:#b91c1c; }
  .badge-gray  { background:#f3f4f6; color:#4b5563; }
  label { display:block; font-size:0.875rem; font-weight:500; color:#374151; margin-bottom:0.375rem; }
`;

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = sidebarCSS;
  document.head.insertBefore(style, document.head.firstChild);
}
