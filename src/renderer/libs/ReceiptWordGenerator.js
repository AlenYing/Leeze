
import JSZip from 'jszip'
import Docxtemplater from 'docxtemplater'
import path from 'path'
import fs from 'fs'

function ReceiptWordGenerate () {
  this.init = function () {
    var templateDocxUrl = path.join(__static, '/template/template2.docx')
    var content = fs.readFileSync(templateDocxUrl, 'binary')
    var zip = new JSZip(content)
    this.doc = new Docxtemplater()
    this.doc.loadZip(zip)
  }
  this.generate = function (fileName, data) {
    data.receiptIndex = this.fillZero(data.receiptIndex)
    this.doc.setData(data)
    try {
      this.doc.render()
    } catch (error) {
      throw error
    }
    var buf = this.doc.getZip().generate({type: 'nodebuffer'})
    fs.writeFileSync(fileName, buf)
    console.log('save finished')
  }
  this.fillZero = function (num) {
    return ('00000000' + num).substr(0, 9)
  }
  this.init()
}
export default new ReceiptWordGenerate()
