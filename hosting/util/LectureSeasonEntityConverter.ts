import type { LectureSeasonEntity } from "model/LectureSeasonEntity";

export class LectureSeasonEntityConverter {
  static fromFirestore(id: string, data: any): LectureSeasonEntity {
    return { id, ...data };
  }
}
