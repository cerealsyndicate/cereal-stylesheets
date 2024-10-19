export default function isTypeOf(str) {
  if (Array.isArray(str)) {
    return "array"
  } else {
    return typeof str
  }
}
