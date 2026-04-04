<script lang="ts">
    /**
     * 백링크 패널
     * 이 문서를 [[링크]]로 참조하는 다른 위키 문서 목록을 표시합니다.
     */
    import Link2 from '@lucide/svelte/icons/link-2';

    let { postId }: { postId: number } = $props();
    let backlinks = $state<Array<{ id: number; title: string; board_slug: string }>>([]);
    let isLoading = $state(true);

    $effect(() => {
        if (!postId) return;
        fetchBacklinks();
    });

    async function fetchBacklinks() {
        isLoading = true;
        try {
            const res = await fetch(`/api/v2/posts/${postId}/backlinks`);
            if (res.ok) {
                const data = await res.json();
                backlinks = data.data || [];
            }
        } catch {
            // 백링크 API가 아직 없으면 무시
        } finally {
            isLoading = false;
        }
    }
</script>

{#if !isLoading && backlinks.length > 0}
    <div class="border-border mt-6 border-t pt-4">
        <h3 class="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
            <Link2 class="h-4 w-4" />
            이 문서를 참조하는 문서 ({backlinks.length})
        </h3>
        <ul class="space-y-1">
            {#each backlinks as link (link.id)}
                <li>
                    <a
                        href="/{link.board_slug}/{link.id}"
                        class="text-primary text-sm hover:underline"
                    >
                        {link.title}
                    </a>
                </li>
            {/each}
        </ul>
    </div>
{/if}
