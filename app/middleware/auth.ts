export default defineNuxtRouteMiddleware((_to, _from) => {
    const { isAdmin } = useAuth();
    if (!isAdmin.value) {
        return navigateTo("/admin/login");
    }
});
