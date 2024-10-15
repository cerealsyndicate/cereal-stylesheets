export default {
  "defineMediaQueries": true,
  "prefix": "mq",
  "queryClassSeparator": "@",
  "values": {
    "sm": "30rem",
    "md": "48rem",
    "lg": "64rem",
    "xl": "80rem",
    "sm-down": {
      "type": "range",
      "queryClass": true,
      "value": "width <= 30rem"
    },
    "dark": {
      "type": "prefers-color-scheme",
      "queryClass": true,
      "value": "dark"
    },
    "light": {
      "type": "prefers-color-scheme",
      "queryClass": true,
      "value": "light"
    },
    "print": "print",
    "touch-hover": {
      "type": "custom",
      "queryClass": true,
      "value": "(hover: hover) and (pointer: coarse)"
    }
  }
}