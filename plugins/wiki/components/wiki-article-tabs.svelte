<script lang="ts">
    /**
     * 위키 문서 탭 — Wikipedia Vector 스킨 스타일
     * 문서 | 토론 | 편집 | 역사
     *
     * slot: post.before_content, priority: 1
     */
    import FileText from '@lucide/svelte/icons/file-text';
    import MessageSquare from '@lucide/svelte/icons/message-square';
    import Pencil from '@lucide/svelte/icons/pencil';
    import History from '@lucide/svelte/icons/history';

    let { postId, boardId }: { postId: number; boardId: string } = $props();

    let activeTab = $state<'article' | 'talk' | 'edit' | 'history'>('article');

    function scrollToComments() {
        activeTab = 'talk';
        const el = document.getElementById('comments');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }

    function scrollToRevisions() {
        activeTab = 'history';
        const el = document.querySelector('[data-wiki-revisions]');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
</script>

<nav class="mb-4 border-b border-[var(--wiki-border,#a2a9b1)] dark:border-[#444]">
    <ul class="flex gap-0 text-sm">
        <li>
            <button
                class="flex items-center gap-1.5 border-b-2 px-4 py-2 font-medium transition-colors {activeTab === 'article'
                    ? 'border-[var(--wiki-link-color,#3366cc)] text-[var(--wiki-link-color,#3366cc)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
                onclick={() => {
                    activeTab = 'article';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            >
                <FileText class="h-3.5 w-3.5" />
                문서
            </button>
        </li>
        <li>
            <button
                class="flex items-center gap-1.5 border-b-2 px-4 py-2 font-medium transition-colors {activeTab === 'talk'
                    ? 'border-[var(--wiki-link-color,#3366cc)] text-[var(--wiki-link-color,#3366cc)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
                onclick={scrollToComments}
            >
                <MessageSquare class="h-3.5 w-3.5" />
                토론
            </button>
        </li>
        <li>
            <a
                href="/{boardId}/write?edit={postId}"
                class="flex items-center gap-1.5 border-b-2 border-transparent px-4 py-2 font-medium text-gray-500 transition-colors hover:text-gray-700 dark:hover:text-gray-300"
            >
                <Pencil class="h-3.5 w-3.5" />
                편집
            </a>
        </li>
        <li>
            <button
                class="flex items-center gap-1.5 border-b-2 px-4 py-2 font-medium transition-colors {activeTab === 'history'
                    ? 'border-[var(--wiki-link-color,#3366cc)] text-[var(--wiki-link-color,#3366cc)]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}"
                onclick={scrollToRevisions}
            >
                <History class="h-3.5 w-3.5" />
                역사
            </button>
        </li>
    </ul>
</nav>
