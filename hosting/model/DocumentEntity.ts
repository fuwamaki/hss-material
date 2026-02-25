export interface DocumentEntity {
  id: string;
  typeId: number;
  orderId: number;
  title: string;
  body: string;
  isWork: boolean;
  createdAt: Date;
  updatedAt: Date;
}
