export function getHexagoneColor (soil) {
  switch (soil.name) {
    case "Sea":
        return "#3366ff"
    case "Beach":
        return "#ffffcc"
    case "Plain":
        return "#ccff66"
    case "Forest":
        return "#006600"
    case "Snow":
        return "#ffffff"
    case "Mountain":
        return "#996633"
    default:
      return "#FFFFFF"
  }
}