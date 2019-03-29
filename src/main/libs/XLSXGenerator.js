import XLSX from 'xlsx'
import path from 'path'

function XLXGenerator () {
  this.init = function () {
    // console.log(path.join(__static, '/template/receiptAll.xlsx'))
    this.table = XLSX.read(path.join(__static, '/template/receiptAll.xlsx'))
    this.sheet = this.table.Sheets[this.table.SheetNames[0]]
    console.log(this.table)
    console.log(this.sheet)
  }

  this.generateXLSX = function (datas, name) {
    for (let i = 0; i < datas.length; i++) {
      let data = datas[i]
      this.add_cell_to_sheet(this.sheet, 'A' + (i + 3), data.date)
      this.add_cell_to_sheet(this.sheet, 'B' + (i + 3), data.receiptIndex)
      this.add_cell_to_sheet(this.sheet, 'C' + (i + 3), data.name)
      this.add_cell_to_sheet(this.sheet, 'D' + (i + 3), data.amount)
      this.add_cell_to_sheet(this.sheet, 'E' + (i + 3), data.comment)
    }
    // console.log(this.sheet)
    XLSX.writeFileSync(this.table, name)
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
    console.log(addr.c, addr.r)

    /* update range */
    worksheet['!ref'] = XLSX.utils.encode_range(range)
    console.log(range.s.c, range.s.r, range.e.c, range.e.r)
  }
  this.init()
}

var xlsxGenerator = new XLXGenerator()

export default xlsxGenerator
