import type { SubmissionQuizEntity } from "model/SubmissionQuizEntity";

export class SubmissionQuizEntityConverter {
  static fromFirestore(id: string, data: any): SubmissionQuizEntity {
    return { id, ...data };
  }
}
