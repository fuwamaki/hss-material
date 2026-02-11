export interface ChatMessageEntity {
  id: string;
  studentId: string;
  senderRole: "admin" | "student";
  message: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
