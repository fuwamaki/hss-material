import type { SubmissionOriginalPlayEntity } from "model/SubmissionOriginalPlayEntity";

export class SubmissionOriginalPlayEntityConverter {
  static fromFirestore(id: string, data: any): SubmissionOriginalPlayEntity {
    return { id, ...data };
  }
}
