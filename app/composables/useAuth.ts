import type { User } from "firebase/auth";

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

const USER_COLLECTION_PROD = "users";
const USER_COLLECTION_STAGING = "testUsers";

const mapUser = (u: User): AuthUser => ({
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
});

export const useAuth = () => {
    const user = useState<AuthUser | null>("auth-user", () => null);
    const isAdmin = useState<boolean>("auth-is-admin", () => false);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => user.value !== null);

    const getFirebaseApp = async () => {
        const config = useRuntimeConfig();
        const firebase = config.public.firebase as Record<string, string>;

        if (!firebase.apiKey) {
            return null;
        }

        const { initializeApp, getApps } = await import("firebase/app");
        if (getApps().length === 0) {
            return initializeApp(firebase);
        }
        return getApps()[0];
    };

    const checkIsAdmin = async (uid: string): Promise<boolean> => {
        const app = await getFirebaseApp();
        if (!app) {
            return false;
        }
        const config = useRuntimeConfig();
        const collectionName =
            config.public.appEnv === "staging" ? USER_COLLECTION_STAGING : USER_COLLECTION_PROD;
        const { getFirestore, collection, query, where, getDocs } = await import(
            "firebase/firestore"
        );
        const db = getFirestore(app);
        const q = query(collection(db, collectionName), where("uid", "==", uid));
        const snap = await getDocs(q);
        if (snap.empty) {
            return false;
        }
        const userData = snap.docs[0].data();
        return userData.type === "Admin";
    };

    const signInWithGoogle = async () => {
        loading.value = true;
        error.value = null;
        try {
            const app = await getFirebaseApp();

            if (!app) {
                // Dev stub: simulate login when Firebase is not configured
                user.value = {
                    uid: "stub-user-001",
                    email: "dev@astrophotography.local",
                    displayName: "Dev User (Stub)",
                    photoURL: null,
                };
                isAdmin.value = true;
                return;
            }

            const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
            const auth = getAuth(app);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            user.value = mapUser(result.user);
            isAdmin.value = await checkIsAdmin(result.user.uid);
        } catch (e) {
            error.value = e instanceof Error ? e.message : "Sign in failed";
            throw e;
        } finally {
            loading.value = false;
        }
    };

    const signOut = async () => {
        loading.value = true;
        try {
            const app = await getFirebaseApp();
            if (app) {
                const { getAuth } = await import("firebase/auth");
                const auth = getAuth(app);
                await auth.signOut();
            }
            user.value = null;
            isAdmin.value = false;
        } finally {
            loading.value = false;
        }
    };

    const initAuth = async () => {
        const app = await getFirebaseApp();
        if (!app) {
            return;
        }

        const { getAuth } = await import("firebase/auth");
        const auth = getAuth(app);
        auth.onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                user.value = mapUser(firebaseUser);
                isAdmin.value = await checkIsAdmin(firebaseUser.uid);
            } else {
                user.value = null;
                isAdmin.value = false;
            }
        });
    };

    return { user, loading, error, isAuthenticated, isAdmin, signInWithGoogle, signOut, initAuth };
};
