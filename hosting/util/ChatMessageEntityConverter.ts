import type { ChatMessageEntity } from "model/ChatMessageEntity";

export class ChatMessageEntityConverter {
  static fromFirestore(id: string, data: any): ChatMessageEntity {
    return { id, ...data };
  }
}
