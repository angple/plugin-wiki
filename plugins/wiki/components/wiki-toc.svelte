<script lang="ts">
    /**
     * 위키 목차 (Table of Contents)
     * 문서 내용에서 heading(h2, h3, h4)을 추출하여 자동으로 목차를 생성합니다.
     */
    type TocItem = { id: string; text: string; level: number };

    let { content = '' }: { content: string } = $props();

    const tocItems = $derived<TocItem[]>(() => {
        if (!content) return [];
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const headings = doc.querySelectorAll('h2, h3, h4');
        const items: TocItem[] = [];
        headings.forEach((h, i) => {
            const id = h.id || `heading-${i}`;
            items.push({
                id,
                text: h.textContent?.trim() || '',
                level: parseInt(h.tagName[1])
            });
        });
        return items;
    });

    let isCollapsed = $state(false);
</script>

{#if tocItems().length >= 3}
    <div class="border-border bg-muted/30 mb-6 rounded-xl border p-4">
        <button
            class="text-foreground flex w-full items-center justify-between text-sm font-semibold"
            onclick={() => (isCollapsed = !isCollapsed)}
        >
            <span>목차</span>
            <span class="text-muted-foreground text-xs">{isCollapsed ? '펼치기' : '접기'}</span>
        </button>

        {#if !isCollapsed}
            <nav class="mt-3 space-y-1">
                {#each tocItems() as item, i (item.id)}
                    <a
                        href="#{item.id}"
                        class="text-muted-foreground hover:text-primary block text-sm transition-colors"
                        style="padding-left: {(item.level - 2) * 16}px"
                    >
                        {i + 1}. {item.text}
                    </a>
                {/each}
            </nav>
        {/if}
    </div>
{/if}
