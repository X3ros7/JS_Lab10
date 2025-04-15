import { InjectionToken } from "@angular/core";

export interface AppConfig {
  apiUrl: string;
}

export const APP_CONFIG: AppConfig = {
  apiUrl: "http://localhost:3100/api/v2",
};

export const CONFIG_TOKEN = new InjectionToken<AppConfig>("CONFIG", {
  providedIn: "root",
  factory: () => APP_CONFIG,
});
