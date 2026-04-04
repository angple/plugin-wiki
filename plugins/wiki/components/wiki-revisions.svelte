<script lang="ts">
    /**
     * 수정 내역 패널 — Wikipedia 스타일
     * V2ContentRevision 기반, "이 문서는 X에 마지막으로 편집되었습니다" 표시
     */
    import History from '@lucide/svelte/icons/history';
    import User from '@lucide/svelte/icons/user';
    import ChevronDown from '@lucide/svelte/icons/chevron-down';

    let { postId }: { postId: number } = $props();
    let revisions = $state<
        Array<{
            id: number;
            version: number;
            change_type: string;
            edited_by_name: string;
            edited_at: string;
            edit_summary?: string;
        }>
    >([]);
    let isLoading = $state(true);
    let showAll = $state(false);

    $effect(() => {
        if (!postId) return;
        fetchRevisions();
    });

    async function fetchRevisions() {
        isLoading = true;
        try {
            const res = await fetch(`/api/v2/posts/${postId}/revisions?limit=10`);
            if (res.ok) {
                const data = await res.json();
                revisions = data.data || [];
            }
        } catch {
            // API 미구현 시 무시
        } finally {
            isLoading = false;
        }
    }

    function formatDate(dateStr: string): string {
        const d = new Date(dateStr);
        return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }

    const lastRevision = $derived(revisions.length > 0 ? revisions[0] : null);

    const changeTypeLabel: Record<string, string> = {
        create: '생성',
        update: '편집',
        soft_delete: '삭제',
        restore: '복구'
    };
</script>

<div data-wiki-revisions class="mt-6 border-t border-[var(--wiki-border,#a2a9b1)] pt-4 dark:border-[#444]">
    <!-- 최종 수정 정보 (Wikipedia 스타일) -->
    {#if lastRevision}
        <p class="text-xs text-gray-500">
            이 문서는 <strong>{formatDate(lastRevision.edited_at)}</strong>에
            <a href="#" class="text-[var(--wiki-link-color,#3366cc)] hover:underline">{lastRevision.edited_by_name}</a>님이
            마지막으로 편집하였습니다.
            {#if lastRevision.edit_summary}
                <span class="italic">({lastRevision.edit_summary})</span>
            {/if}
        </p>
    {/if}

    <!-- 수정 내역 목록 -->
    {#if !isLoading && revisions.length > 1}
        <button
            class="mt-3 flex items-center gap-1 text-xs text-[var(--wiki-link-color,#3366cc)] hover:underline"
            onclick={() => (showAll = !showAll)}
        >
            <History class="h-3 w-3" />
            수정 내역 ({revisions.length}건)
            <ChevronDown class="h-3 w-3 transition-transform {showAll ? 'rotate-180' : ''}" />
        </button>

        {#if showAll}
            <div class="mt-2 space-y-1.5 rounded border border-[var(--wiki-border,#a2a9b1)] bg-[var(--wiki-bg-sidebar,#f6f6f6)] p-3 dark:border-[#444] dark:bg-[#16213e]">
                {#each revisions as rev (rev.id)}
                    <div class="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span
                            class="inline-block w-10 rounded px-1 py-0.5 text-center text-[10px] font-medium {rev.change_type === 'create'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}"
                        >
                            {changeTypeLabel[rev.change_type] || rev.change_type}
                        </span>
                        <span>{formatDate(rev.edited_at)}</span>
                        <span class="flex items-center gap-0.5">
                            <User class="h-3 w-3" />
                            {rev.edited_by_name}
                        </span>
                        {#if rev.edit_summary}
                            <span class="italic text-gray-400">— {rev.edit_summary}</span>
                        {/if}
                    </div>
                {/each}
            </div>
        {/if}
    {/if}
</div>
