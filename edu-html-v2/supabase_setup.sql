-- =============================================
-- 실제 테이블 구조에 맞는 RLS 설정
-- Supabase SQL Editor 에서 실행하세요
-- =============================================

-- 1. edu_students 에 user_id 컬럼 추가 (이미 했다면 스킵)
ALTER TABLE public.edu_students 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. edu_posts 에 view_count 컬럼 추가 (없을 경우 대비)
ALTER TABLE public.edu_posts
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- =============================================
-- edu_students RLS
-- =============================================
ALTER TABLE public.edu_students ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "학생 본인 조회" ON public.edu_students;
CREATE POLICY "학생 본인 조회"
  ON public.edu_students FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "관리자 전체 관리" ON public.edu_students;
CREATE POLICY "관리자 전체 관리"
  ON public.edu_students FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'admin@example.com'
    )
  );

-- =============================================
-- edu_notices RLS
-- =============================================
ALTER TABLE public.edu_notices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "공지 읽기" ON public.edu_notices;
CREATE POLICY "공지 읽기"
  ON public.edu_notices FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "공지 관리자 쓰기" ON public.edu_notices;
CREATE POLICY "공지 관리자 쓰기"
  ON public.edu_notices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND email = 'admin@example.com'
    )
  );

-- =============================================
-- edu_posts RLS
-- =============================================
ALTER TABLE public.edu_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "게시판 읽기" ON public.edu_posts;
CREATE POLICY "게시판 읽기"
  ON public.edu_posts FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "게시판 작성" ON public.edu_posts;
CREATE POLICY "게시판 작성"
  ON public.edu_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "본인 글 삭제" ON public.edu_posts;
CREATE POLICY "본인 글 삭제"
  ON public.edu_posts FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- 조회수 증가 함수
-- =============================================
CREATE OR REPLACE FUNCTION increment_view_count(post_id BIGINT)
RETURNS void AS $$
  UPDATE public.edu_posts SET view_count = view_count + 1 WHERE id = post_id;
$$ LANGUAGE sql SECURITY DEFINER;
