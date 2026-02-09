export enum TypingSkillLevel {
  BlindTouch = 1, // ブラインドタッチができる
  KeyboardLooking = 2, // キーボードを見ながら、タイピングできる
  KeyboardAndChart = 3, // キーボードとローマ字表を見ながら、タイピングできる
  NotSure = 4, // タイピングが何のことか分からない
}

export interface UserInfoEntity {
  id: string;
  uid: string;
  email: string;
  lastName?: string | null;
  firstName?: string | null;
  lastNameKana?: string | null;
  firstNameKana?: string | null;
  typingSkillLevel?: TypingSkillLevel | null;
  webSkill?: string | null;
  programmingExp?: string | null;
  aiServices?: string[] | null;
  aiUsage?: string | null;
  projectExpect?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
