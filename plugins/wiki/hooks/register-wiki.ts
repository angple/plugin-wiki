/**
 * 위키 플러그인 레이아웃/컴포넌트 등록 Hook
 *
 * 1. wiki 게시판 타입을 Board Type Registry에 등록
 * 2. wiki 글쓰기 폼 등록
 * 3. TOC, 백링크, 수정내역을 post 슬롯에 등록
 */
import { boardTypeRegistry } from '$lib/components/features/board/board-type-registry.js';
import { postSlotRegistry } from '$lib/components/features/board/post-slot-registry.js';
import { writeFormRegistry } from '$lib/components/features/board/write-form-registry.js';
import WikiBoard from '../components/wiki-board.svelte';
import WikiWriteForm from '../components/wiki-write-form.svelte';
import WikiToc from '../components/wiki-toc.svelte';
import WikiBacklinks from '../components/wiki-backlinks.svelte';
import WikiRevisions from '../components/wiki-revisions.svelte';

export default function registerWikiLayouts() {
    // 1. 위키 게시판 타입 등록
    boardTypeRegistry.register('wiki', WikiBoard, 'plugin');

    // 2. 위키 글쓰기 폼 등록
    writeFormRegistry.register('wiki', WikiWriteForm, 'plugin');

    // 3. 목차 (TOC) — post.before_content 슬롯
    postSlotRegistry.register('post.before_content', {
        component: WikiToc,
        condition: (boardType: string) => boardType === 'wiki',
        priority: 5,
        propsMapper: (data: Record<string, unknown>) => ({
            content: (data.post as { content?: string })?.content || ''
        })
    });

    // 4. 백링크 — post.after_content 슬롯
    postSlotRegistry.register('post.after_content', {
        component: WikiBacklinks,
        condition: (boardType: string) => boardType === 'wiki',
        priority: 50,
        propsMapper: (data: Record<string, unknown>) => ({
            postId: (data.post as { id?: number })?.id
        })
    });

    // 5. 수정 내역 — post.after_content 슬롯
    postSlotRegistry.register('post.after_content', {
        component: WikiRevisions,
        condition: (boardType: string) => boardType === 'wiki',
        priority: 60,
        propsMapper: (data: Record<string, unknown>) => ({
            postId: (data.post as { id?: number })?.id
        })
    });
}
