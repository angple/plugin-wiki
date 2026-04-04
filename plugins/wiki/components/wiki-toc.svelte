<script lang="ts">
    /**
     * 위키 목차 (Table of Contents)
     * 문서 내용에서 heading(h2, h3, h4)을 추출하여 자동으로 목차를 생성합니다.
     * sticky 포지셔닝으로 스크롤 시에도 고정됩니다.
     */
    import List from '@lucide/svelte/icons/list';

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
    <div class="wiki-toc sticky top-4 mb-6 rounded-lg border border-[var(--wiki-border,#a2a9b1)] bg-[var(--wiki-bg-sidebar,#f6f6f6)] p-4 dark:border-[#444] dark:bg-[#16213e]">
        <button
            class="flex w-full items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300"
            onclick={() => (isCollapsed = !isCollapsed)}
        >
            <span class="flex items-center gap-1.5">
                <List class="h-3.5 w-3.5" />
                목차
            </span>
            <span class="text-xs text-gray-400">{isCollapsed ? '펼치기' : '접기'}</span>
        </button>

        {#if !isCollapsed}
            <nav class="mt-3 space-y-0.5">
                {#each tocItems() as item, i (item.id)}
                    <a
                        href="#{item.id}"
                        class="block rounded px-2 py-1 text-sm text-[var(--wiki-link-color,#3366cc)] transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                        style="padding-left: {(item.level - 2) * 16 + 8}px"
                    >
                        {i + 1}. {item.text}
                    </a>
                {/each}
            </nav>
        {/if}
    </div>
{/if}
