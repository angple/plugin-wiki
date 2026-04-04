# Task Plan: Wiki Plugin Phase 2 — 백링크 + 위키링크

## Goal
Angple 위키 플러그인에 핵심 위키 기능 구현:
1. `[[위키링크]]` TipTap 익스텐션 (에디터에서 문서 간 링크)
2. 백링크 시스템 (어떤 문서가 이 문서를 참조하는지 추적)
3. 리비전에 편집 요약(edit_summary) 추가

## Phase 2 체크리스트

### Step 1: 백엔드 — wiki_backlinks 테이블 + API
- [x] `angple-backend`에 `WikiBacklink` 도메인 모델 생성
  - 파일: `internal/domain/v2/wiki.go`
  - 필드: ID, SourcePostID, TargetPostID, LinkText, IsBroken, CreatedAt
- [x] `WikiBacklinkRepository` 구현
  - 파일: `internal/repository/v2/wiki_backlink_repo.go`
  - 메서드: Create, DeleteBySourceID, FindByTargetID, FindBySourceID
- [x] API 엔드포인트 추가
  - GET `/api/v2/posts/:id/backlinks` → FindByTargetID
  - 파일: `internal/handler/v2/handler.go`에 추가
- [x] V2ContentRevision에 `edit_summary` 칼럼 추가
  - 파일: `internal/domain/v2/revision.go`
  - 마이그레이션: ALTER TABLE v2_content_revisions ADD COLUMN edit_summary VARCHAR(200)
- [x] 빌드 확인: `go build ./...`

### Step 2: 백엔드 — post_save 훅으로 백링크 자동 갱신
- [x] 위키링크 파서 함수
  - 파일: `internal/service/v2/wiki_link_parser.go`
  - 기능: HTML 콘텐츠에서 `[[문서명]]` 패턴 추출
  - 정규식: `\[\[([^\]]+)\]\]`
- [x] post_save 시 백링크 갱신 로직
  - 기존 백링크 삭제 (SourcePostID 기준)
  - 새 링크 파싱 → 대상 문서 조회 → 백링크 INSERT
  - 존재하지 않는 문서 → IsBroken = true
- [x] PostService.UpdatePost에 훅 연동 (main.go에서 직접 goroutine)
  - 또는 HookManager.Do("post_save", data) 활용

### Step 3: 프론트엔드 — TipTap WikiLink 익스텐션
- [x] WikiLink Node 확장 생성
  - 파일: `plugin-wiki/plugins/wiki/extensions/wiki-link.ts`
  - 패턴: `[[문서명]]` → 인라인 링크 노드
  - InputRule: `\[\[([^\]]+)\]\]` 감지 → WikiLink 노드 삽입
  - renderHTML: `<a data-wiki-link="true" href="/wiki/문서명" class="wiki-link">문서명</a>`
- [ ] WikiLink Suggestion (선택사항)
  - `[[` 입력 시 문서 검색 드롭다운 (Mention 패턴 참조)
  - API: GET `/api/v2/posts/search?board_type=wiki&q=검색어`
- [ ] tiptap-editor.svelte에 WikiLink 확장 등록 방법 결정
  - 방법 A: 코어 에디터에 직접 추가 (코어 수정 필요)
  - 방법 B: hook 시스템으로 동적 주입 (코어 수정 불필요, 권장)
  - 방법 C: wiki-write-form에서 별도 에디터 인스턴스 (비효율)

### Step 4: 프론트엔드 — 백링크/리비전 UI 연동
- [x] wiki-backlinks.svelte — API 연동 확인 (Step 1의 API)
- [x] wiki-revisions.svelte — 편집 요약 표시 (edit_summary 필드 이미 포함)
- [x] 빨간 링크 스타일 — WikiLink 확장에서 isBroken → wiki-link-broken 클래스

### Step 5: 통합 테스트
- [x] 위키 게시판 생성 (v2_boards slug='wiki', settings.boardType='wiki')
- [x] wiki_backlinks 테이블 자동 생성 확인
- [x] GET /api/v2/posts/:id/backlinks API 정상 응답
- [x] /wiki 페이지 200 정상 렌더링
- [ ] 문서 작성 → `[[다른문서]]` 입력 → 링크 렌더링 확인 (로그인 필요)
- [ ] 다른 문서에서 백링크 패널에 표시되는지 확인
- [ ] 리비전 목록에 편집 요약 표시 확인
- [ ] 빨간 링크 (존재하지 않는 문서) 스타일 확인

### 발견된 이슈
- BACKEND_URL 환경변수 누락 시 SSR fetch 실패 (모든 게시판 500)
- g5_write_message 테이블 누락 (DB 덤프에 미포함)
- wiki-board.svelte 커스텀 레이아웃이 적용되려면 boardType 매칭 로직 필요

## Definition of Done
- [ ] `[[문서명]]` 입력 시 에디터에서 위키링크로 변환
- [ ] 문서 저장 시 백링크 자동 갱신
- [ ] 문서 하단에 "이 문서를 참조하는 문서" 목록 표시
- [ ] 리비전에 편집 요약 저장/표시
- [ ] 존재하지 않는 문서 → 빨간 링크

## 핵심 파일 참조
- `angple-backend/internal/domain/v2/revision.go` — V2ContentRevision (이미 완성)
- `angple-backend/internal/repository/v2/revision_repo.go` — RevisionRepository
- `angple-backend/internal/handler/v2/handler.go:705` — GetPostRevisions 엔드포인트
- `angple/apps/web/src/lib/components/features/editor/tiptap-editor.svelte` — 에디터
- `angple/apps/web/src/lib/components/features/editor/mention-suggestion.ts` — Mention 패턴
- `angple-premium/plugins/giving/hooks/register-layouts.ts` — 플러그인 등록 패턴
