export interface NoticeEntity {
  id: string;
  title: string;
  description: string;
  isPublish: boolean;
  orderId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
