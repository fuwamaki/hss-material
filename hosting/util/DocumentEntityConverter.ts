import type { DocumentEntity } from "model/DocumentEntity";

export class DocumentEntityConverter {
  static fromFirestore(id: string, data: any): DocumentEntity {
    return { id, ...data };
  }
}
