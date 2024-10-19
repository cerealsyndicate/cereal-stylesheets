export default function isStringArray(str) {
  return typeof str === "string" && str.startsWith("...")
}
