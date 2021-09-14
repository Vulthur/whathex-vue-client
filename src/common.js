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

export function getAccessibleCell(ref_cell) {
    cells = []
    let cell = get_NW_cell(ref_cell.x, ref_cell.y)
    if cell:
        cells.append(cell)
    cell = get_N_cell(ref_cell.x, ref_cell.y)
    if cell:
        cells.append(cell)
    cell = get_NE_cell(ref_cell.x, ref_cell.y)
    if cell:
        cells.append(cell)
    cell = get_SE_cell(ref_cell.x, ref_cell.y)
    if cell:
        cells.append(cell)
    cell = get_S_cell(ref_cell.x, ref_cell.y)
    if cell:
        cells.append(cell)
    cell = get_SW_cell(ref_cell.x, ref_cell.y)
    if cell:
        cells.append(cell)
    
    return cells
}

function get_N_cell(self, y, x) {
    if y == 0 or x >= len(self.cells[y-1]):
        return None
    return self.cells[y-1][x]
}

function get_NE_cell(self, y, x) {
    if x % 2 == 0:
        if y == 0:
            return None
        if x < len(self.cells[y-1]) - 1:
            return self.cells[y-1][x+1]
    else:
        if x < len(self.cells[y]) - 1:
            return self.cells[y][x+1]
    return None
}

function get_NW_cell(self, y, x) {
    if x == 0:
        return None
    if x % 2 == 0:
        if y == 0:
            return None
        if x < len(self.cells[y-1]) - 1:
            return self.cells[y-1][x-1]
    else:
        return self.cells[y][x-1]
    return None
}

function get_S_cell(self, y, x) {
    if y >= len(self.cells)-1 or x >= len(self.cells[y+1]):
        return None
    return self.cells[y+1][x]
}

function get_SE_cell(self, y, x) {
    if y >= len(self.cells):
        return None
    if x % 2 == 0:
        if x < len(self.cells[y]) - 1:
            return self.cells[y][x+1]
    else:
        if y < len(self.cells) - 1 and x < len(self.cells[y+1]) - 1:
            return self.cells[y+1][x+1]
    return None
}

function get_SW_cell(self, y, x) {
    if y >= len(self.cells) or x == 0:
        return None
    if x%2 == 0:
        return self.cells[y][x-1]
    else:
        if y < len(self.cells)-1:
            if x < len(self.cells[y+1]) + 1:
                return self.cells[y+1][x-1]
    return None
}