export interface NoticeEntity {
  id: string;
  seasonId: string;
  title: string;
  description: string;
  isPublish: boolean;
  orderId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
