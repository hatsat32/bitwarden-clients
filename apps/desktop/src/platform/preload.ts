import { ipcRenderer } from "electron";

import { DeviceType } from "@bitwarden/common/enums/device-type.enum";

import { isDev, isWindowsStore } from "../utils";

export default {
  versions: {
    app: (): Promise<string> => ipcRenderer.invoke("appVersion"),
  },
  deviceType: deviceType(),
  isDev: isDev(),
  isWindowsStore: isWindowsStore(),
  reloadProcess: () => ipcRenderer.send("reload-process"),

  openContextMenu: (
    menu: {
      label?: string;
      type?: "normal" | "separator" | "submenu" | "checkbox" | "radio";
    }[]
  ): Promise<number> => ipcRenderer.invoke("openContextMenu", { menu }),
};

function deviceType(): DeviceType {
  switch (process.platform) {
    case "win32":
      return DeviceType.WindowsDesktop;
    case "darwin":
      return DeviceType.MacOsDesktop;
    default:
      return DeviceType.LinuxDesktop;
  }
}
