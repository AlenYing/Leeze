import XLSX from 'xlsx'
import path from 'path'

function XLXGenerator () {
  this.init = function () {
    this.table = XLSX.readFile(path.join(__static, '/template/receiptAll.xlsx'))
    this.sheet = this.table.Sheets[this.table.SheetNames[0]]
    var wscols = [
      {wpx: 90},
      {wpx: 80},
      {wpx: 80},
      {wpx: 100},
      {wpx: 300}
    ]
    this.sheet['!cols'] = wscols
    this.formatCell(this.sheet['A1'], '000', true, 'center')
    this.formatCell(this.sheet['A2'], '000', true, 'top')
    this.formatCell(this.sheet['B2'], '000', true, 'top')
    this.formatCell(this.sheet['C2'], '000', true, 'top')
    this.formatCell(this.sheet['D2'], '000', true, 'top')
    this.formatCell(this.sheet['E2'], '000', true, 'top')
  }

  this.generateXLSX = function (datas, name) {
    var wsrows = [
      {hpt: 50}, // row 2 sets to the height of 16 in pixels
      {hpt: 30} // row 2 sets to the height of 16 in pixels
    ]
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i]
      this.add_cell_to_sheet(this.sheet, 'A' + (i + 3), data.date)
      this.add_cell_to_sheet(this.sheet, 'B' + (i + 3), data.receiptIndex)
      this.add_cell_to_sheet(this.sheet, 'C' + (i + 3), data.name)
      this.add_cell_to_sheet(this.sheet, 'D' + (i + 3), data.amount)
      this.add_cell_to_sheet(this.sheet, 'E' + (i + 3), data.comment)
      wsrows.push({hpt: 30})
    }
    this.sheet['!rows'] = wsrows
    XLSX.writeFileSync(this.table, name)
  }

  this.formatCell = function (cell, color, isBold, hAlign) {
    cell.s = {
      'fill': {
        'patternType': 'solid',
        'fgColor': {
          rgb: 'ffffff'
        }
      },
      'font': {
        'color': {
          rgb: color
        },
        'bold': isBold
      },
      'alignment': {
        'vertical': 'center',
        'horizontal': hAlign
      },
      'border': {
        'top': {
          'style': 'thin',
          'color': '202020'
        },
        'right': {
          'style': 'thin',
          'color': '202020'
        },
        'left': {
          'style': 'thin',
          'color': '202020'
        },
        'bottom': {
          'style': 'thin',
          'color': '202020'
        }
      }
    }
  }

  this.add_cell_to_sheet = function (worksheet, address, value) {
    /* cell object */
    var cell = {t: '?', v: value}

    /* assign type */
    if (typeof value === 'string') cell.t = 's' // string
    else if (typeof value === 'number') cell.t = 'n' // number
    else if (value === true || value === false) cell.t = 'b' // boolean
    else if (value instanceof Date) cell.t = 'd'
    else throw new Error('cannot store value')

    this.formatCell(cell, '000', false, 'top')

    /* add to worksheet, overwriting a cell if it exists */
    worksheet[address] = cell

    /* find the cell range */
    var range = XLSX.utils.decode_range(worksheet['!ref'])
    var addr = XLSX.utils.decode_cell(address)

    /* extend the range to include the new cell */
    if (range.s.c > addr.c) range.s.c = addr.c
    if (range.s.r > addr.r) range.s.r = addr.r
    if (range.e.c < addr.c) range.e.c = addr.c
    if (range.e.r < addr.r) range.e.r = addr.r

    /* update range */
    worksheet['!ref'] = XLSX.utils.encode_range(range)
  }
  this.init()
}

var xlsxGenerator = new XLXGenerator()

export default xlsxGenerator
