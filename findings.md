# Findings: Wiki Plugin Research

## 리비전 시스템 (이미 완성)
- `V2ContentRevision` 모델: ID, PostID, Version, ChangeType, Title, Content, EditedBy, EditedByName, EditedAt
- `RevisionRepository`: Create, FindByPostID, FindByPostIDAndVersion, GetNextVersion
- API: `GET /api/v1/boards/:slug/posts/:id/revisions`, `POST .../restore`
- edit_summary 칼럼만 추가하면 됨

## PostMeta (모델만 존재)
- `v2_post_meta` 테이블: PostID, Namespace, MetaKey, MetaValue(JSON)
- Repository 미구현 — 필요 시 직접 구현
- wiki namespace로 locked, redirect, category 저장 가능

## TipTap WikiLink 구현 방법
- Mention 패턴 참조: char 트리거 + suggestion + renderHTML
- 권장: 독립 Node 타입 (Mark가 아님), InputRule로 `[[text]]` 감지
- renderHTML: `<a data-wiki-link="true" class="wiki-link">`
- 코어 수정 없이 플러그인에서 에디터 확장 주입하는 방법 확인 필요

## 백엔드 Hook 시스템
- HookManager: Register(event, pluginName, handler, priority)
- Do(event, data) — Action 실행
- Apply(event, data) — Filter 실행 (체이닝)
- post_save 이벤트로 백링크 갱신 가능

## Giving 플러그인 패턴
- boardTypeRegistry.register('giving', Component, 'plugin')
- writeFormRegistry.register('giving', Component, 'plugin')
- postSlotRegistry.register('post.after_content', { component, condition, priority, propsMapper })
