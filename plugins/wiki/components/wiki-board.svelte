<script lang="ts">
    import { Button } from '$lib/components/ui/button/index.js';
    import BookOpen from '@lucide/svelte/icons/book-open';
    import Search from '@lucide/svelte/icons/search';
    import Clock from '@lucide/svelte/icons/clock';
    import FileText from '@lucide/svelte/icons/file-text';

    let { posts = [], boardId = '', boardName = '' }: {
        posts: Array<{
            id: number;
            title: string;
            content?: string;
            created_at: string;
            updated_at: string;
            view_count: number;
            comment_count: number;
            mb_nick?: string;
        }>;
        boardId: string;
        boardName: string;
    } = $props();

    let searchQuery = $state('');

    const filtered = $derived(
        searchQuery
            ? posts.filter((p) =>
                  p.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : posts
    );

    function formatDate(dateStr: string): string {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }
</script>

<div class="space-y-4">
    <!-- 위키 헤더 -->
    <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
            <BookOpen class="text-primary h-5 w-5" />
            <h2 class="text-lg font-bold">{boardName || '위키'}</h2>
            <span class="text-muted-foreground text-sm">({posts.length}개 문서)</span>
        </div>
        <a href="/{boardId}/write">
            <Button size="sm">
                <FileText class="mr-1 h-4 w-4" />
                새 문서
            </Button>
        </a>
    </div>

    <!-- 검색 -->
    <div class="relative">
        <Search class="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
            type="text"
            bind:value={searchQuery}
            placeholder="문서 검색..."
            class="border-border bg-background w-full rounded-lg border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
    </div>

    <!-- 문서 목록 -->
    {#if filtered.length === 0}
        <div class="text-muted-foreground flex flex-col items-center py-12">
            <BookOpen class="mb-3 h-12 w-12 opacity-50" />
            <p class="text-sm">
                {searchQuery ? '검색 결과가 없습니다.' : '아직 문서가 없습니다.'}
            </p>
        </div>
    {:else}
        <div class="divide-border divide-y rounded-xl border">
            {#each filtered as post (post.id)}
                <a
                    href="/{boardId}/{post.id}"
                    class="hover:bg-muted/50 flex items-center gap-3 px-4 py-3 transition-colors"
                >
                    <FileText class="text-muted-foreground h-4 w-4 shrink-0" />
                    <div class="min-w-0 flex-1">
                        <p class="text-foreground truncate text-sm font-medium">{post.title}</p>
                        <div class="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
                            <span>{post.mb_nick || '익명'}</span>
                            <span class="flex items-center gap-1">
                                <Clock class="h-3 w-3" />
                                {formatDate(post.updated_at || post.created_at)}
                            </span>
                            <span>조회 {post.view_count}</span>
                        </div>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
