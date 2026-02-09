interface UserInfoEntity {
  id: string;
  uid: string;
  email: string;
  name?: string | null;
  furigana?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
