import type { UserInfoEntity } from "model/UserInfoEntity";
import { UserInfoEntityConverter } from "util/UserInfoEntityConverter";
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
        return UserInfoEntityConverter.fromFirestore(docSnap.id, docSnap.data());
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error getting userInfo:", error);
      throw error;
    }
  }

  public static async createUserInfo(
    uid: string,
    email: string,
    lastName: string | null = null,
    firstName: string | null = null,
    lastNameKana: string | null = null,
    firstNameKana: string | null = null,
    typingSkillLevel: number | null = null,
    webSkill: string | null = null,
    programmingExp: string | null = null,
    aiServices: string[] | null = null,
    aiUsage: string | null = null,
    projectExpect: string | null = null,
  ): Promise<string | null> {
    try {
      await addDoc(collection(FirebaseConfig.db, this.UserInfoCollectionName), {
        uid,
        email,
        lastName,
        firstName,
        lastNameKana,
        firstNameKana,
        typingSkillLevel,
        webSkill,
        programmingExp,
        aiServices,
        aiUsage,
        projectExpect,
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
    uid: string,
    update: {
      lastName?: string | null;
      firstName?: string | null;
      lastNameKana?: string | null;
      firstNameKana?: string | null;
      typingSkillLevel?: number | null;
      webSkill?: string | null;
      programmingExp?: string | null;
      aiServices?: string[] | null;
      aiUsage?: string | null;
      projectExpect?: string | null;
    },
  ): Promise<UserInfoEntity | null> {
    try {
      // id取得
      const userInfo = await this.getUserInfo(uid);
      if (!userInfo) throw new Error("ユーザー情報が見つかりません");
      await updateDoc(doc(FirebaseConfig.db, this.UserInfoCollectionName, userInfo.id), {
        ...update,
        updatedAt: serverTimestamp(),
      });
      console.log("UserInfo updated successfully");
      return await this.getUserInfo(uid);
    } catch (error) {
      console.error("Error updating userInfo:", error);
      throw error;
    }
  }
}

export { FireStoreRepository };
