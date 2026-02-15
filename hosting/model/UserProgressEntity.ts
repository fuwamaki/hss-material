import { PcOsType } from "enum/PcOsType";

export interface UserProgressEntity {
  id: string;
  studentId: string;
  seasonId: string | null;
  pcOsType: PcOsType | null;
  canInstallVSCode: boolean;
  canUseGeminiCodeAssistant: boolean;
  setup: {
    isInstallSampleCode: boolean;
    isOpenTerminal: boolean;
    isInstallNode: boolean;
    isNpmInstallDone: boolean;
    isRunSampleCode: boolean;
  };
  vscode: {
    isInstall: boolean;
    isInstallGeminiCodeAssistant: boolean;
    isLinkGeminiCodeAssistant: boolean;
  };
  commonIssue: {
    isStopwatch: boolean;
    isAddSamplePage: boolean;
    isOthello: boolean;
    isCalculator: boolean;
    isReadCode: boolean;
    isFixBug: boolean;
    isQuiz: boolean;
    isQuizFeature: boolean;
    isQuizDesign: boolean;
    isQuizSubmit: boolean;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}
