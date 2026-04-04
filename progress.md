# Progress Log: Wiki Plugin

## Session: 2026-04-03 — Phase 1 완료
- GitHub 레포 생성: https://github.com/angple/plugin-wiki
- plugin.json, 5개 컴포넌트, register-wiki.ts 훅 구현
- wiki-board, wiki-write-form, wiki-toc, wiki-backlinks, wiki-revisions
- deploy/install.sh 작성
- 위키 테마 설정 (classic/modern/minimal)

## Session: 2026-04-04 — Phase 2 시작
- task_plan.md 작성 (5 Step 계획)
- findings.md 작성 (리서치 결과 정리)
- Step 1 완료: 백엔드 wiki_backlinks 테이블 + API + edit_summary
  - `internal/domain/v2/wiki.go` — WikiBacklink 모델
  - `internal/repository/v2/wiki_backlink_repo.go` — Repository (CRUD + ReplaceBacklinks)
  - `internal/handler/v2/wiki_handler.go` — GET /api/v2/posts/:id/backlinks
  - `internal/service/v2/wiki_link_parser.go` — [[위키링크]] 정규식 파서
  - `internal/domain/v2/revision.go` — edit_summary 필드 추가
  - go build 성공
- Step 3 진행: TipTap WikiLink 익스텐션
  - `plugin-wiki/plugins/wiki/extensions/wiki-link.ts` — 완성
  - InputRule: `[[text]]$` → WikiLink 노드
  - renderHTML: `<a data-wiki-link class="wiki-link">`
  - renderText: `[[title]]` (마크다운 호환)
- Step 2 완료: post_save 백링크 자동 갱신
  - `cmd/api/main.go` — WikiBacklinkRepository 초기화, AutoMigrate
  - GET /api/v2/posts/:id/backlinks 라우트 등록
  - post 생성/수정 시 [[링크]] 파싱 → wiki_backlinks 갱신 (goroutine)
  - 빨간 링크: IsBroken=true
- Step 4 완료: UI 연동 확인
  - wiki-backlinks.svelte, wiki-revisions.svelte 이미 API 호출 구현
  - 빨간 링크 스타일: wiki-link.ts에서 isBroken → brokenLinkClass
- go build 성공 (에러 0)
