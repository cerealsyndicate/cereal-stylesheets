import state from "../utils/state.js"

export default function getSettings(key) {
  const data = state.get()
  const settings = data.find((item) => item.settings)?.settings
  return settings[key] || null
}
