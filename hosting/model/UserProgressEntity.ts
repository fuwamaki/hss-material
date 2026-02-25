import { PcOsType } from "enum/PcOsType";

export interface UserProgressEntity {
  id: string;
  studentId: string;
  seasonId: string | null;
  pcOsType: PcOsType | null;
  canInstallVSCode: boolean;
  canUseGeminiCodeAssistant: boolean;
  completedWorkList: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}
