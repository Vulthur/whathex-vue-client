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


// function get_NE_cell(self, y, x) {
//     if x % 2 == 0:
//         if y == 0:
//             return None
//         if x < len(self.cells[y-1]) - 1:
//             return self.cells[y-1][x+1]
//     else:
//         if x < len(self.cells[y]) - 1:
//             return self.cells[y][x+1]
//     return None
// }

// function get_NW_cell(self, y, x) {
//     if x == 0:
//         return None
//     if x % 2 == 0:
//         if y == 0:
//             return None
//         if x < len(self.cells[y-1]) - 1:
//             return self.cells[y-1][x-1]
//     else:
//         return self.cells[y][x-1]
//     return None
// }

// function get_SE_cell(self, y, x) {
//     if y >= len(self.cells):
//         return None
//     if x % 2 == 0:
//         if x < len(self.cells[y]) - 1:
//             return self.cells[y][x+1]
//     else:
//         if y < len(self.cells) - 1 and x < len(self.cells[y+1]) - 1:
//             return self.cells[y+1][x+1]
//     return None
// }

// function get_SW_cell(self, y, x) {
//     if y >= len(self.cells) or x == 0:
//         return None
//     if x%2 == 0:
//         return self.cells[y][x-1]
//     else:
//         if y < len(self.cells)-1:
//             if x < len(self.cells[y+1]) + 1:
//                 return self.cells[y+1][x-1]
//     return None
// }