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
  reflectionImpression?: string | null;
  reflectionGood?: string | null;
  reflectionImprove?: string | null;
  isReflectionAnswered?: boolean | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export const isUserInfoAnswered = (userInfo: UserInfoEntity | null): boolean => {
  if (!userInfo) return false;
  return !!(
    userInfo.lastName &&
    userInfo.firstName &&
    userInfo.lastNameKana &&
    userInfo.firstNameKana &&
    userInfo.typingSkillLevel !== undefined &&
    userInfo.webSkill &&
    userInfo.programmingExp &&
    userInfo.projectExpect
  );
};
