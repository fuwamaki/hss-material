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
  onSnapshot,
} from "firebase/firestore";
import { FirebaseConfig } from "./FirebaseConfig";
import { NoticeEntity } from "model/NoticeEntity";
import { DocumentEntity } from "model/DocumentEntity";
import { ChatMessageEntity } from "model/ChatMessageEntity";
import { SubmissionOriginalPlayEntity } from "model/SubmissionOriginalPlayEntity";
import { SubmissionOriginalSiteEntity } from "model/SubmissionOriginalSiteEntity";
import { SubmissionQuizEntity } from "model/SubmissionQuizEntity";
import { NoticeEntityConverter } from "util/NoticeEntityConverter";
import { DocumentEntityConverter } from "util/DocumentEntityConverter";
import { ChatMessageEntityConverter } from "util/ChatMessageEntityConverter";
import { SubmissionOriginalPlayEntityConverter } from "util/SubmissionOriginalPlayEntityConverter";
import { SubmissionOriginalSiteEntityConverter } from "util/SubmissionOriginalSiteEntityConverter";
import { SubmissionQuizEntityConverter } from "util/SubmissionQuizEntityConverter";
import { LectureSeasonEntityConverter } from "util/LectureSeasonEntityConverter";
import { LectureSeasonEntity } from "model/LectureSeasonEntity";

class FireStoreRepository {
  // UserInfoキャッシュ
  private static userInfoCache: Map<string, UserInfoEntity | null> = new Map();
  // LectureSeasonキャッシュ
  private static lectureSeasonCache: LectureSeasonEntity[] | null = null;
  private static readonly UserInfoCollectionName = "user-info-collection";
  private static readonly NoticeCollectionName = "notice-collection";
  private static readonly ChatMessageCollectionName = "chat-message-collection";
  private static readonly DocumentCollectionName = "document-collection";
  private static readonly SubmissionOriginalPlayCollectionName = "submission-original-play-collection";
  private static readonly SubmissionOriginalSiteCollectionName = "submission-original-site-collection";
  private static readonly SubmissionQuizCollectionName = "submission-quiz-collection";

  /*
   * UserInfo
   */
  public static async getUserInfo(uid: string): Promise<UserInfoEntity | null> {
    // キャッシュがあれば返す
    if (this.userInfoCache.has(uid)) {
      return this.userInfoCache.get(uid) ?? null;
    }
    try {
      const q = query(
        collection(FirebaseConfig.db, this.UserInfoCollectionName),
        where("uid", "==", uid),
        orderBy("createdAt", "desc"),
        limit(1),
      );
      const querySnapshot = await getDocs(q);
      let result: UserInfoEntity | null = null;
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        result = UserInfoEntityConverter.fromFirestore(docSnap.id, docSnap.data());
      }
      // キャッシュに保存
      this.userInfoCache.set(uid, result);
      return result;
    } catch (error) {
      console.error("Error getting userInfo:", error);
      throw error;
    }
  }

  public static async createUserInfo(
    uid: string,
    email: string,
    seasonId?: string | null,
    seasonName?: string | null,
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
  ): Promise<void> {
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
        seasonId,
        seasonName,
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
      seasonId?: string | null;
      seasonName?: string | null;
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
      // 更新後キャッシュも更新
      const updated = await this.getUserInfo(uid);
      this.userInfoCache.set(uid, updated);
      return updated;
    } catch (error) {
      console.error("Error updating userInfo:", error);
      throw error;
    }
  }

  /*
   * LectureSeason
   */
  public static async getActiveLectureSeasons(): Promise<LectureSeasonEntity[]> {
    if (this.lectureSeasonCache) {
      return this.lectureSeasonCache;
    }
    try {
      const q = query(
        collection(FirebaseConfig.db, "lecture-season-collection"),
        where("isActive", "==", true),
        orderBy("createdAt", "asc"),
      );
      const querySnapshot = await getDocs(q);
      const result = querySnapshot.docs.map((docSnap) =>
        LectureSeasonEntityConverter.fromFirestore(docSnap.id, docSnap.data()),
      );
      this.lectureSeasonCache = result;
      return result;
    } catch (error) {
      console.error("Error getting active lecture seasons:", error);
      throw error;
    }
  }

  // シーズンキャッシュをクリアするメソッド（必要に応じて呼び出し）
  public static clearLectureSeasonCache() {
    this.lectureSeasonCache = null;
  }

  /*
   * Notice
   */
  public static async getAllNotice(seasonId: string): Promise<NoticeEntity[]> {
    const q = query(
      collection(FirebaseConfig.db, this.NoticeCollectionName),
      where("seasonId", "==", seasonId),
      where("isPublish", "==", true),
      orderBy("orderId", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => NoticeEntityConverter.fromFirestore(docSnap.id, docSnap.data()));
  }

  public static async getLatestPublishedNotice(seasonId: string): Promise<NoticeEntity | null> {
    const q = query(
      collection(FirebaseConfig.db, this.NoticeCollectionName),
      where("seasonId", "==", seasonId),
      where("isPublish", "==", true),
      orderBy("orderId", "desc"),
      limit(1),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return NoticeEntityConverter.fromFirestore(snapshot.docs[0].id, snapshot.docs[0].data());
  }

  /*
   * Document
   */
  public static async getDocumentById(documentId: string): Promise<DocumentEntity | null> {
    const ref = doc(FirebaseConfig.db, this.DocumentCollectionName, documentId);
    const snap = await getDocs(
      query(collection(FirebaseConfig.db, this.DocumentCollectionName), where("id", "==", documentId)),
    );
    if (snap.empty) return null;
    return DocumentEntityConverter.fromFirestore(snap.docs[0].id, snap.docs[0].data());
  }

  /*
   * ChatMessage
   */
  public static async sendStudentChatMessage(studentId: string, senderId: string, message: string): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.ChatMessageCollectionName), {
      studentId,
      senderId,
      senderRole: "student",
      message,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  public static getChatMessagesByStudentId(
    studentId: string,
    onUpdate: (messages: ChatMessageEntity[]) => void,
    onError?: (error: unknown) => void,
  ): () => void {
    const q = query(
      collection(FirebaseConfig.db, this.ChatMessageCollectionName),
      where("studentId", "==", studentId),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) =>
          ChatMessageEntityConverter.fromFirestore(docSnap.id, docSnap.data()),
        );
        onUpdate(data);
      },
      (error) => {
        console.error("Error getting chat messages:", error);
        if (onError) onError(error);
      },
    );
  }

  /*
   * Submission
   */
  public static async getLatestSubmissionOriginalPlay(studentId: string): Promise<SubmissionOriginalPlayEntity | null> {
    const q = query(
      collection(FirebaseConfig.db, this.SubmissionOriginalPlayCollectionName),
      where("studentId", "==", studentId),
      orderBy("updatedAt", "desc"),
      limit(1),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return SubmissionOriginalPlayEntityConverter.fromFirestore(snapshot.docs[0].id, snapshot.docs[0].data());
  }

  public static async addSubmissionOriginalPlay(
    studentId: string,
    title: string,
    targetUser: string,
    userStory: string,
  ): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.SubmissionOriginalPlayCollectionName), {
      studentId,
      title,
      targetUser,
      userStory,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  public static async updateSubmissionOriginalPlay(
    id: string,
    update: Partial<SubmissionOriginalPlayEntity>,
  ): Promise<void> {
    await updateDoc(doc(FirebaseConfig.db, this.SubmissionOriginalPlayCollectionName, id), {
      ...update,
      updatedAt: serverTimestamp(),
    });
  }

  public static async getLatestSubmissionOriginalSite(studentId: string): Promise<SubmissionOriginalSiteEntity | null> {
    const q = query(
      collection(FirebaseConfig.db, this.SubmissionOriginalSiteCollectionName),
      where("studentId", "==", studentId),
      orderBy("updatedAt", "desc"),
      limit(1),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return SubmissionOriginalSiteEntityConverter.fromFirestore(snapshot.docs[0].id, snapshot.docs[0].data());
  }

  public static async addSubmissionOriginalSite(
    studentId: string,
    keyFeature: string,
    sourceCode: string,
  ): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.SubmissionOriginalSiteCollectionName), {
      studentId,
      keyFeature,
      sourceCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  public static async updateSubmissionOriginalSite(
    id: string,
    update: Partial<SubmissionOriginalSiteEntity>,
  ): Promise<void> {
    await updateDoc(doc(FirebaseConfig.db, this.SubmissionOriginalSiteCollectionName, id), {
      ...update,
      updatedAt: serverTimestamp(),
    });
  }

  public static async getLatestSubmissionQuiz(studentId: string): Promise<SubmissionQuizEntity | null> {
    const q = query(
      collection(FirebaseConfig.db, this.SubmissionQuizCollectionName),
      where("studentId", "==", studentId),
      orderBy("updatedAt", "desc"),
      limit(1),
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return SubmissionQuizEntityConverter.fromFirestore(snapshot.docs[0].id, snapshot.docs[0].data());
  }

  public static async addSubmissionQuiz(studentId: string, keyFeature: string, sourceCode: string): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.SubmissionQuizCollectionName), {
      studentId,
      keyFeature,
      sourceCode,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  public static async updateSubmissionQuiz(id: string, update: Partial<SubmissionQuizEntity>): Promise<void> {
    await updateDoc(doc(FirebaseConfig.db, this.SubmissionQuizCollectionName, id), {
      ...update,
      updatedAt: serverTimestamp(),
    });
  }
}

export { FireStoreRepository };
