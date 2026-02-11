import type { SubmissionOriginalSiteEntity } from "model/SubmissionOriginalSiteEntity";

export class SubmissionOriginalSiteEntityConverter {
  static fromFirestore(id: string, data: any): SubmissionOriginalSiteEntity {
    return { id, ...data };
  }
}
