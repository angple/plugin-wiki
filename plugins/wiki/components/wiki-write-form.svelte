<script lang="ts">
    /**
     * 위키 전용 글쓰기 폼
     * 기본 PostForm 위에 편집 요약(edit summary) 필드를 추가합니다.
     */
    let { editSummary = '' }: { editSummary: string } = $props();
</script>

<!-- 편집 요약 (위키 전용 필드) -->
<div class="border-border mt-4 border-t pt-4">
    <label for="edit-summary" class="text-foreground mb-1 block text-sm font-medium">
        편집 요약
    </label>
    <input
        id="edit-summary"
        type="text"
        bind:value={editSummary}
        placeholder="변경 사항을 간단히 설명해주세요 (예: 오타 수정, 내용 보강)"
        class="border-border bg-background w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        maxlength="200"
    />
    <p class="text-muted-foreground mt-1 text-xs">
        다른 편집자가 변경 내용을 쉽게 파악할 수 있도록 간단히 작성해주세요.
    </p>
</div>
