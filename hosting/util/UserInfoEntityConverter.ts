import { UserInfoEntity } from "model/UserInfoEntity";

export class UserInfoEntityConverter {
  static fromFirestore(id: string, data: any): UserInfoEntity {
    return {
      id,
      ...data,
    };
  }
}
