export interface DocumentEntity {
  id: string;
  typeId: number;
  orderId: number;
  title: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
}
