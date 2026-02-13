import { getApps, getApp } from "firebase/app";
import {
  activate,
  fetchAndActivate,
  getBoolean,
  getRemoteConfig,
  onConfigUpdate,
  type RemoteConfig,
} from "firebase/remote-config";
import { FirebaseConfig } from "./FirebaseConfig";

class RemoteConfigRepository {
  private static remoteConfig: RemoteConfig | null = null;

  public static async initialize() {
    if (this.remoteConfig) return;
    if (getApps().length === 0) {
      await FirebaseConfig.initialize();
    }
    const app = getApp();
    const remoteConfig = getRemoteConfig(app);
    remoteConfig.settings = {
      minimumFetchIntervalMillis: 60 * 60 * 1000,
      fetchTimeoutMillis: 60 * 1000, // 例: 60秒
    };
    this.remoteConfig = remoteConfig;
  }

  public static async getBooleanValue(
    key: string,
    defaultValue = false,
    onChange?: (value: boolean) => void,
  ): Promise<{ value: boolean; unsubscribe?: () => void }> {
    await this.initialize();
    if (!this.remoteConfig) return { value: defaultValue };
    this.remoteConfig.defaultConfig = {
      [key]: defaultValue,
    };
    await fetchAndActivate(this.remoteConfig);
    const value = getBoolean(this.remoteConfig, key);

    let unsubscribe: (() => void) | undefined;
    if (onChange) {
      unsubscribe = onConfigUpdate(this.remoteConfig, {
        next: async (configUpdate) => {
          try {
            if (!configUpdate.getUpdatedKeys().has(key)) return;
            await activate(this.remoteConfig!);
            onChange(getBoolean(this.remoteConfig!, key));
          } catch (error) {
            console.error("Remote Config update error:", error);
          }
        },
        error: (error) => {
          console.error("Remote Config update error:", error);
        },
        complete: function (): void {
          throw new Error("Function not implemented.");
        },
      });
    }

    return { value, unsubscribe };
  }
}

export { RemoteConfigRepository };
