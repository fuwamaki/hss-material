import { getApps, getApp } from "firebase/app";
import { fetchAndActivate, getBoolean, getRemoteConfig, type RemoteConfig } from "firebase/remote-config";
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
    const isDev = process.env.NODE_ENV === "development";
    remoteConfig.settings = {
      minimumFetchIntervalMillis: isDev ? 5 * 1000 : 60 * 60 * 1000, // 開発中は5秒、本番は1時間
      fetchTimeoutMillis: 60 * 1000, // 例: 60秒
    };
    this.remoteConfig = remoteConfig;
  }

  public static async getBooleanValue(key: string, defaultValue = false): Promise<boolean> {
    await this.initialize();
    if (!this.remoteConfig) return defaultValue;
    this.remoteConfig.defaultConfig = {
      [key]: defaultValue,
    };
    await fetchAndActivate(this.remoteConfig);
    return getBoolean(this.remoteConfig, key);
  }
}

export { RemoteConfigRepository };
