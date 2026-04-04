<script lang="ts">
    /**
     * 수정 내역 패널
     * V2ContentRevision을 활용하여 문서의 편집 이력을 표시합니다.
     */
    import History from '@lucide/svelte/icons/history';
    import User from '@lucide/svelte/icons/user';

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
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}분 전`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}시간 전`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}일 전`;
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    const changeTypeLabel: Record<string, string> = {
        create: '생성',
        update: '편집',
        soft_delete: '삭제',
        restore: '복구'
    };
</script>

{#if !isLoading && revisions.length > 0}
    <div class="border-border mt-6 border-t pt-4">
        <h3 class="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
            <History class="h-4 w-4" />
            수정 내역
        </h3>
        <div class="space-y-2">
            {#each revisions as rev (rev.id)}
                <div class="text-muted-foreground flex items-center gap-2 text-xs">
                    <span
                        class="rounded-full px-1.5 py-0.5 text-[10px] font-medium {rev.change_type === 'create'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}"
                    >
                        {changeTypeLabel[rev.change_type] || rev.change_type}
                    </span>
                    <span class="flex items-center gap-1">
                        <User class="h-3 w-3" />
                        {rev.edited_by_name}
                    </span>
                    <span>{formatDate(rev.edited_at)}</span>
                    {#if rev.edit_summary}
                        <span class="text-foreground/70 italic">— {rev.edit_summary}</span>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
{/if}
