import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export const useMarkdownRenderer = () => {
    const renderMarkdown = (value: string | undefined) => {
        if (!value?.trim()) {
            return "";
        }
        const tokens = marked.lexer(value.trim(), {
            breaks: true,
            gfm: true,
        });
        return sanitizeHtml(marked.parser(tokens));
    };

    return { renderMarkdown };
};
