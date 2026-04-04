/**
 * TipTap WikiLink Extension
 *
 * [[문서명]] 패턴을 감지하여 인라인 위키 링크 노드로 변환합니다.
 *
 * 사용법:
 *   에디터에서 [[문서명]] 입력 → 자동으로 위키링크 노드로 변환
 *   렌더링: <a data-wiki-link="true" href="/wiki/문서명" class="wiki-link">문서명</a>
 */
import { Node, mergeAttributes } from '@tiptap/core';
import { InputRule } from '@tiptap/core';

export interface WikiLinkOptions {
    basePath: string;
    linkClass: string;
    brokenLinkClass: string;
    HTMLAttributes: Record<string, string>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        wikiLink: {
            setWikiLink: (attrs: { title: string; href?: string }) => ReturnType;
        };
    }
}

export const WikiLink = Node.create<WikiLinkOptions>({
    name: 'wikiLink',

    group: 'inline',
    inline: true,
    atom: true,

    addOptions() {
        return {
            basePath: '/wiki/',
            linkClass: 'wiki-link text-primary underline decoration-dotted',
            brokenLinkClass: 'wiki-link-broken text-red-500 underline decoration-dotted',
            HTMLAttributes: {}
        };
    },

    addAttributes() {
        return {
            title: {
                default: null,
                parseHTML: (element: HTMLElement) =>
                    element.getAttribute('data-wiki-title') || element.textContent,
                renderHTML: (attributes: Record<string, string>) => ({
                    'data-wiki-title': attributes.title
                })
            },
            href: {
                default: null,
                parseHTML: (element: HTMLElement) => element.getAttribute('href'),
                renderHTML: (attributes: Record<string, string>) => ({
                    href: attributes.href || `${this.options.basePath}${encodeURIComponent(attributes.title)}`
                })
            },
            isBroken: {
                default: false,
                parseHTML: (element: HTMLElement) => element.getAttribute('data-broken') === 'true',
                renderHTML: (attributes: Record<string, boolean>) => {
                    if (attributes.isBroken) {
                        return { 'data-broken': 'true' };
                    }
                    return {};
                }
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'a[data-wiki-link]'
            }
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        const isBroken = node.attrs.isBroken;
        const linkClass = isBroken ? this.options.brokenLinkClass : this.options.linkClass;

        return [
            'a',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-wiki-link': 'true',
                class: linkClass
            }),
            node.attrs.title || ''
        ];
    },

    renderText({ node }) {
        return `[[${node.attrs.title}]]`;
    },

    addCommands() {
        return {
            setWikiLink:
                (attrs) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: {
                            title: attrs.title,
                            href: attrs.href || `${this.options.basePath}${encodeURIComponent(attrs.title)}`
                        }
                    });
                }
        };
    },

    addInputRules() {
        return [
            new InputRule({
                find: /\[\[([^\]]+)\]\]$/,
                handler: ({ state, range, match }) => {
                    const title = match[1];
                    const { tr } = state;

                    if (title) {
                        const node = this.type.create({
                            title,
                            href: `${this.options.basePath}${encodeURIComponent(title)}`
                        });
                        tr.replaceWith(range.from, range.to, node);
                    }
                }
            })
        ];
    }
});

export default WikiLink;
