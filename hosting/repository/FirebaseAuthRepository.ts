import {
  Auth,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  EmailAuthProvider,
  linkWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

class FirebaseAuthRepository {
  private static auth: Auth | null;
  static uid: string | null;
  static email: string | null;

  public static async initialize(): Promise<string | null> {
    const auth = getAuth();
    FirebaseAuthRepository.auth = auth;

    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          FirebaseAuthRepository.uid = user.uid;
          FirebaseAuthRepository.email = user.email;
          resolve(null);
        } else {
          resolve(null);
        }
      });
    });
  }

  public static async register(email: string, password: string): Promise<string | null> {
    try {
      if (FirebaseAuthRepository.auth.currentUser.isAnonymous) {
        const credential = EmailAuthProvider.credential(email, password);
        await linkWithCredential(FirebaseAuthRepository.auth.currentUser, credential);
      } else {
        await createUserWithEmailAndPassword(FirebaseAuthRepository.auth, email, password);
      }
      return null;
    } catch (error) {
      console.error("ユーザー登録に失敗しました:", error.message);
      return error.message;
    }
  }

  public static async login(email: string, password: string): Promise<string | null> {
    try {
      await signInWithEmailAndPassword(FirebaseAuthRepository.auth, email, password);
      return null;
    } catch (error) {
      console.log("ログインに失敗しました:", error.message);
      return error.message;
    }
  }

  public static async logout(): Promise<string | null> {
    try {
      await signOut(FirebaseAuthRepository.auth);
      return null;
    } catch (error) {
      console.log("サインアウトに失敗しました:", error.message);
      return error.message;
    }
  }

  public static async loginWithGoogle(): Promise<string | null> {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(FirebaseAuthRepository.auth, provider);
      return null;
    } catch (error) {
      console.log("Googleログインに失敗しました:", error.message);
      return error.message;
    }
  }
}

export { FirebaseAuthRepository };
