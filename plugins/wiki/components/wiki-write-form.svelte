<script lang="ts">
    /**
     * 위키 전용 글쓰기 폼
     *
     * 코어 PostForm 을 `contentFormat='markdown'` 으로 감싸 위키 본문을 마크다운 원문으로
     * 작성/저장하게 한다. 더하여 위키 특유의 편집 요약(edit summary) 필드를 제공한다.
     *
     * (이전 버전은 편집요약 input 만 있어 실제 글 작성이 불가능했음 — 마크다운 네이티브 작성 폼으로 재작성)
     */
    import PostForm from '$lib/components/features/board/post-form.svelte';
    import type { Board, CreatePostRequest, UpdatePostRequest } from '$lib/api/types.js';

    let {
        boardId = '',
        board = undefined,
        categories = [],
        contentFormat = 'markdown',
        onSubmit,
        onCancel,
        isLoading = false
    }: {
        boardId?: string;
        board?: Board;
        categories?: string[];
        contentFormat?: 'html' | 'markdown';
        onSubmit: (data: CreatePostRequest | UpdatePostRequest) => Promise<void>;
        onCancel: () => void;
        isLoading?: boolean;
    } = $props();

    let editSummary = $state('');

    // 편집 요약을 함께 전달 (백엔드 리비전 메타). 요청 타입에 없으면 런타임에서 무시됨.
    async function handleSubmit(data: CreatePostRequest | UpdatePostRequest): Promise<void> {
        const withSummary = {
            ...data,
            edit_summary: editSummary.trim() || undefined
        } as CreatePostRequest | UpdatePostRequest;
        await onSubmit(withSummary);
    }
</script>

<div class="space-y-4">
    <!-- 편집 요약 (위키 전용 필드) -->
    <div class="border-border bg-muted/30 rounded-lg border p-3">
        <label for="edit-summary" class="text-foreground mb-1 block text-sm font-medium">
            편집 요약
        </label>
        <input
            id="edit-summary"
            type="text"
            bind:value={editSummary}
            placeholder="변경 사항을 간단히 설명해주세요 (예: 오타 수정, 내용 보강)"
            class="border-border bg-background focus:ring-primary/20 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            maxlength="200"
        />
        <p class="text-muted-foreground mt-1 text-xs">
            본문은 <strong>마크다운</strong>으로 작성합니다 (예: <code>## 제목</code>,
            <code>**굵게**</code>, 표, <code>[[문서명]]</code> 링크).
        </p>
    </div>

    <PostForm
        mode="create"
        {boardId}
        {board}
        {categories}
        {contentFormat}
        onSubmit={handleSubmit}
        {onCancel}
        {isLoading}
    />
</div>
