import { TypingSkillLevel } from "enum/TypingSkillLevel";

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
