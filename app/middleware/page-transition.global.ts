const resolveStackIndex = (path: string): number | null => {
    if (path === "/") {
        return 0;
    }

    if (path === "/gallery") {
        return 1;
    }

    if (path.startsWith("/admin")) {
        return 2;
    }

    return null;
};

export default defineNuxtRouteMiddleware((to, from) => {
    const toIndex = resolveStackIndex(to.path);
    const fromIndex = resolveStackIndex(from.path);

    let transitionName = "page-fade";

    if (toIndex !== null && fromIndex !== null) {
        if (toIndex > fromIndex) {
            transitionName = "page-slide-left";
        } else if (toIndex < fromIndex) {
            transitionName = "page-slide-right";
        }
    }

    to.meta.pageTransition = {
        name: transitionName,
        mode: "out-in",
    };

    from.meta.pageTransition = {
        name: transitionName,
        mode: "out-in",
    };
});