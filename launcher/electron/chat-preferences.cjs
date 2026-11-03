// Resolve the Temporary Chat preference from the two generations of the stored key.
// The last public release always opened Temporary Chat and persisted no chat-mode key, so a stored
// configuration or launcher state that carries neither key predates the setting and stays Temporary Chat.
// Every later writer persists a key; a brand-new install has no stored file and takes the saved-chat default.
function resolveTemporaryChats(current, legacy) {
  if (typeof current === "boolean") return current;
  if (current === undefined && legacy === undefined) return true;
  return legacy === false;
}

// Read both generations of the preference before any launcher state synchronization.
function migrateChatPreferences(config) {
  if (!config) return config;
  for (const key of ["useTemporaryChats", "useSavedChats"]) {
    if (config[key] !== undefined && typeof config[key] !== "boolean") {
      throw new Error(`Invalid ${key} in runtime configuration`);
    }
  }
  const migrated = {
    ...config,
    useTemporaryChats: resolveTemporaryChats(config.useTemporaryChats, config.useSavedChats),
  };
  delete migrated.useSavedChats;
  return migrated;
}

module.exports = { migrateChatPreferences, resolveTemporaryChats };
