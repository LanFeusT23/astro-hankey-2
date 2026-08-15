import { marked } from "marked";

marked.setOptions({
    breaks: true,
    gfm: true,
});

const escapeHtml = (value: string) =>
    value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

export const useMarkdownRenderer = () => {
    const renderMarkdown = (value: string | undefined) => {
        if (!value?.trim()) {
            return "";
        }
        return marked.parse(escapeHtml(value.trim())) as string;
    };

    return { renderMarkdown };
};
