import {
  collection,
  query,
  where,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  limit,
  getDocs,
} from "firebase/firestore";
import { FirebaseConfig } from "./FirebaseConfig";

class FireStoreRepository {
  private static readonly UserInfoCollectionName = "user-info-collection";

  public static async getUserInfo(uid: string): Promise<UserInfoEntity | null> {
    try {
      const q = query(
        collection(FirebaseConfig.db, this.UserInfoCollectionName),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(1),
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        return {
          id: docSnap.id,
          uid: docSnap.data().uid,
          name: docSnap.data().name,
          furigana: docSnap.data().furigana,
          createdAt: docSnap.data().createdAt,
          updatedAt: docSnap.data().updatedAt,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting userInfo:", error);
      throw error;
    }
  }

  public static async createUserInfo(uid: string, name: string, furigana: string): Promise<string | null> {
    try {
      await addDoc(collection(FirebaseConfig.db, this.UserInfoCollectionName), {
        uid,
        name,
        furigana,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return null;
    } catch (error) {
      console.error("Error adding userInfo:", error);
      throw error;
    }
  }

  public static async updateUserInfo(
    entity: UserInfoEntity,
    name: string | null,
    furigana: string | null,
  ): Promise<UserInfoEntity | null> {
    try {
      await updateDoc(doc(FirebaseConfig.db, this.UserInfoCollectionName, entity.id), {
        name: name ?? entity.name,
        furigana: furigana ?? entity.furigana,
        updatedAt: serverTimestamp(),
      });
      console.log("UserInfo updated successfully");
      return await this.getUserInfo(entity.uid);
    } catch (error) {
      console.error("Error updating userInfo:", error);
      throw error;
    }
  }
}

export { FireStoreRepository };
