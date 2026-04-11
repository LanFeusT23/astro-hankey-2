import type { User } from "firebase/auth";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

const mapUser = (u: User): AuthUser => ({
  uid: u.uid,
  email: u.email,
  displayName: u.displayName,
  photoURL: u.photoURL,
});

export const useAuth = () => {
  const user = useState<AuthUser | null>("auth-user", () => null);
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
        return;
      }

      const { getAuth, GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      user.value = mapUser(result.user);
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
    } finally {
      loading.value = false;
    }
  };

  const initAuth = async () => {
    const app = await getFirebaseApp();
    if (!app) return;

    const { getAuth } = await import("firebase/auth");
    const auth = getAuth(app);
    auth.onAuthStateChanged((firebaseUser) => {
      user.value = firebaseUser ? mapUser(firebaseUser) : null;
    });
  };

  return { user, loading, error, isAuthenticated, signInWithGoogle, signOut, initAuth };
};
