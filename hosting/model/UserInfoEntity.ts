import { TypingSkillLevel } from "enum/TypingSkillLevel";

export interface UserInfoEntity {
  id: string;
  uid: string;
  email: string;
  seasonId: string;
  seasonName: string;
  lastName: string;
  firstName: string;
  lastNameKana: string;
  firstNameKana: string;
  typingSkillLevel: TypingSkillLevel;
  webSkill: string;
  programmingExp: string;
  aiServices?: string[] | null;
  aiUsage?: string | null;
  projectExpect: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
