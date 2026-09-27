function requireAutostartState(result, desired) {
  if (result.supported && result.enabled !== Boolean(desired)) {
    throw new Error(`Windows did not ${desired ? "enable" : "disable"} launcher autostart`);
  }
  return result;
}

function setAutostart(app, enabled) {
  if (!app.isPackaged || process.platform !== "win32") return { supported: false, enabled: false };
  app.setLoginItemSettings({ openAtLogin: Boolean(enabled), openAsHidden: Boolean(enabled), args: ["--hidden"] });
  return requireAutostartState({
    supported: true,
    enabled: app.getLoginItemSettings({ args: ["--hidden"] }).openAtLogin === true,
  }, enabled);
}

function getAutostart(app) {
  if (!app.isPackaged || process.platform !== "win32") return { supported: false, enabled: false };
  return { supported: true, enabled: app.getLoginItemSettings({ args: ["--hidden"] }).openAtLogin === true };
}

module.exports = { getAutostart, requireAutostartState, setAutostart };
