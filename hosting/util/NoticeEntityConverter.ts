import type { NoticeEntity } from "model/NoticeEntity";

export class NoticeEntityConverter {
  static fromFirestore(id: string, data: any): NoticeEntity {
    const safe = data ?? {};
    return {
      id,
      ...safe,
      seasonId: safe.seasonId ?? "",
    };
  }
}
