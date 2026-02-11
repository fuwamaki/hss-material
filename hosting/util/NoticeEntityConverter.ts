import type { NoticeEntity } from "model/NoticeEntity";

export class NoticeEntityConverter {
  static fromFirestore(id: string, data: any): NoticeEntity {
    return { id, ...data };
  }
}
