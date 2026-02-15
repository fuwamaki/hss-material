import type { UserProgressEntity } from "model/UserProgressEntity";

export class UserProgressEntityConverter {
  static fromFirestore(id: string, data: any): UserProgressEntity {
    return {
      id,
      ...data,
    };
  }
}
