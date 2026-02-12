import { FirebaseConfig } from "./FirebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import type { UserInfoEntity } from "model/UserInfoEntity";
import type { NoticeEntity } from "model/NoticeEntity";
import type { ChatMessageEntity } from "model/ChatMessageEntity";
import type { SubmissionOriginalPlayEntity } from "model/SubmissionOriginalPlayEntity";
import type { SubmissionOriginalSiteEntity } from "model/SubmissionOriginalSiteEntity";
import type { SubmissionQuizEntity } from "model/SubmissionQuizEntity";
import type { DocumentEntity } from "model/DocumentEntity";
import type { LectureSeasonEntity } from "model/LectureSeasonEntity";
import { UserInfoEntityConverter } from "util/UserInfoEntityConverter";
import { NoticeEntityConverter } from "util/NoticeEntityConverter";
import { ChatMessageEntityConverter } from "util/ChatMessageEntityConverter";
import { SubmissionOriginalPlayEntityConverter } from "util/SubmissionOriginalPlayEntityConverter";
import { SubmissionOriginalSiteEntityConverter } from "util/SubmissionOriginalSiteEntityConverter";
import { SubmissionQuizEntityConverter } from "util/SubmissionQuizEntityConverter";
import { DocumentEntityConverter } from "util/DocumentEntityConverter";
import { LectureSeasonEntityConverter } from "util/LectureSeasonEntityConverter";

class FireStoreAdminRepository {
  private static readonly UserInfoCollectionName = "user-info-collection";
  private static readonly NoticeCollectionName = "notice-collection";
  private static readonly ChatMessageCollectionName = "chat-message-collection";
  private static readonly SubmissionOriginalPlayCollectionName = "submission-original-play-collection";
  private static readonly SubmissionOriginalSiteCollectionName = "submission-original-site-collection";
  private static readonly SubmissionQuizCollectionName = "submission-quiz-collection";
  private static readonly DocumentCollectionName = "document-collection";
  private static readonly LectureSeasonCollectionName = "lecture-season-collection";

  /*
   * UserInfo
   */
  public static async getAllUserInfo(): Promise<UserInfoEntity[]> {
    const snapshot = await getDocs(collection(FirebaseConfig.db, this.UserInfoCollectionName));
    return snapshot.docs.map((docSnap) => UserInfoEntityConverter.fromFirestore(docSnap.id, docSnap.data()));
  }

  /*
   * Notice
   */
  public static async getAllNotice(): Promise<NoticeEntity[]> {
    const snapshot = await getDocs(collection(FirebaseConfig.db, this.NoticeCollectionName));
    return snapshot.docs.map((docSnap) => NoticeEntityConverter.fromFirestore(docSnap.id, docSnap.data()));
  }

  public static async addNotice(
    title: string,
    description: string,
    isPublish: boolean,
    orderId: number,
  ): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.NoticeCollectionName), {
      title,
      description,
      isPublish,
      orderId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  public static async updateNotice(id: string, update: Partial<NoticeEntity>): Promise<void> {
    await updateDoc(doc(FirebaseConfig.db, this.NoticeCollectionName, id), {
      ...update,
      updatedAt: serverTimestamp(),
    });
  }

  public static async deleteNotice(id: string): Promise<void> {
    await deleteDoc(doc(FirebaseConfig.db, this.NoticeCollectionName, id));
  }

  /*
   * LectureSeason
   */
  public static async getAllLectureSeason(): Promise<LectureSeasonEntity[]> {
    const q = query(collection(FirebaseConfig.db, this.LectureSeasonCollectionName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => LectureSeasonEntityConverter.fromFirestore(docSnap.id, docSnap.data()));
  }

  public static async addLectureSeason(name: string, isActive: boolean): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.LectureSeasonCollectionName), {
      name,
      isActive,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  public static async updateLectureSeason(id: string, update: Partial<LectureSeasonEntity>): Promise<void> {
    await updateDoc(doc(FirebaseConfig.db, this.LectureSeasonCollectionName, id), {
      ...update,
      updatedAt: serverTimestamp(),
    });
  }

  public static async deleteLectureSeason(id: string): Promise<void> {
    await deleteDoc(doc(FirebaseConfig.db, this.LectureSeasonCollectionName, id));
  }

  /*
   * ChatMessage
   */
  public static async getChatMessagesByStudentId(studentId: string): Promise<ChatMessageEntity[]> {
    const q = query(
      collection(FirebaseConfig.db, this.ChatMessageCollectionName),
      where("studentId", "==", studentId),
      orderBy("createdAt", "asc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ChatMessageEntityConverter.fromFirestore(docSnap.id, docSnap.data()));
  }

  public static async sendTeacherChatMessage(studentId: string, message: string): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.ChatMessageCollectionName), {
      studentId,
      senderRole: "admin",
      message,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  /*
   * Submission
   */
  public static async getAllSubmissionOriginalPlay(): Promise<SubmissionOriginalPlayEntity[]> {
    const snapshot = await getDocs(collection(FirebaseConfig.db, this.SubmissionOriginalPlayCollectionName));
    return snapshot.docs.map((docSnap) =>
      SubmissionOriginalPlayEntityConverter.fromFirestore(docSnap.id, docSnap.data()),
    );
  }

  public static async getAllSubmissionOriginalSite(): Promise<SubmissionOriginalSiteEntity[]> {
    const snapshot = await getDocs(collection(FirebaseConfig.db, this.SubmissionOriginalSiteCollectionName));
    return snapshot.docs.map((docSnap) =>
      SubmissionOriginalSiteEntityConverter.fromFirestore(docSnap.id, docSnap.data()),
    );
  }

  public static async getAllSubmissionQuiz(): Promise<SubmissionQuizEntity[]> {
    const snapshot = await getDocs(collection(FirebaseConfig.db, this.SubmissionQuizCollectionName));
    return snapshot.docs.map((docSnap) => SubmissionQuizEntityConverter.fromFirestore(docSnap.id, docSnap.data()));
  }

  /*
   * Document
   */
  public static async getAllDocument(): Promise<DocumentEntity[]> {
    const snapshot = await getDocs(collection(FirebaseConfig.db, this.DocumentCollectionName));
    return snapshot.docs.map((docSnap) => DocumentEntityConverter.fromFirestore(docSnap.id, docSnap.data()));
  }

  public static async addDocument(title: string, body: string): Promise<string> {
    const ref = await addDoc(collection(FirebaseConfig.db, this.DocumentCollectionName), {
      title,
      body,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }

  public static async updateDocument(id: string, update: Partial<DocumentEntity>): Promise<void> {
    await updateDoc(doc(FirebaseConfig.db, this.DocumentCollectionName, id), {
      ...update,
      updatedAt: serverTimestamp(),
    });
  }

  public static async deleteDocument(id: string): Promise<void> {
    await deleteDoc(doc(FirebaseConfig.db, this.DocumentCollectionName, id));
  }
}

export { FireStoreAdminRepository };
