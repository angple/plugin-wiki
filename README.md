# Angple Wiki Plugin

Wikipedia 스타일 위키 플러그인 for [Angple](https://github.com/angple/angple) 커뮤니티 플랫폼.

## 기능

- 위키 전용 게시판 타입 (`wiki`)
- 자동 목차(TOC) 생성
- 백링크 추적 (`[[문서명]]` 링크)
- 리비전 히스토리 (수정 내역, diff, 복구)
- 편집 요약 필드
- 토론 페이지 (댓글 시스템 활용)
- 위키 테마 선택 (클래식/모던/미니멀)

## 설치

```bash
git clone https://github.com/angple/plugin-wiki.git
cd plugin-wiki
./deploy/install.sh /path/to/angple
```

## 사용법

1. Admin → 게시판 관리 → 새 게시판 생성
2. 게시판 타입: `wiki` 선택
3. 저장 후 해당 게시판에서 위키 문서 작성

## 설정

Admin → 플러그인 → 위키 설정에서:

| 설정 | 기본값 | 설명 |
|------|--------|------|
| 위키 테마 | 클래식 | 클래식/모던/미니멀 |
| 목차 표시 | true | 자동 목차 생성 |
| 백링크 표시 | true | 참조 문서 목록 |
| 수정 내역 표시 | true | 편집 이력 |
| 토론 활성화 | true | 댓글 기반 토론 |
| 네임스페이스 | false | Main:, Help: 등 |

## 요구사항

- Angple Core >= 0.1.0
- angple-backend (Go API) — V2ContentRevision 지원

## 라이선스

MIT
