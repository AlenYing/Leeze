import Vue from 'vue'
import Vuex from 'vuex'
import db from './datastore'
import receiptWordGenerator from '../libs/ReceiptWordGenerator.js'
import settings from 'electron-settings'
import fs from 'fs'

const { dialog } = require('electron').remote

Vue.use(Vuex)

var multLang = function (obj, lang) {
  return obj[lang]
}

export default new Vuex.Store({
  state: {
    databaseData: [],
    dateData: {},
    theme: {
      color: settings.get('color', 'white'),
      language: settings.get('language', 'cn')
    },
    // theme: {
    //   color: 'white',
    //   language: 'cn'
    // },
    importProgress: 0,
    appAlertData: {
      title: '',
      desc: '',
      level: 0 // 0: normal, 1: warn, 2: error
    }
  },
  getters: {
    normalDatas: state => {
      return state.databaseData.filter(item => !item.deleted)
    },
    trashDatas: state => {
      return state.databaseData.filter(item => item.deleted)
    }
  },
  mutations: {
    updateTheme (state, data) {
      // settings.set('color', data.color)
      // settings.set('language', data.language)
      state.theme.color = data.color
      state.theme.language = data.language
      console.log('STROE | Commit | updateTheme', data)
    },
    initDatabaseData (state, data) {
      let start = new Date().getTime()
      Vue.set(state, 'databaseData', [...data])
      let end = new Date().getTime()
      console.log('STROE | Commit | initDatabaseData', (end - start) / 1000, 's')
    },
    updateDateData (state, data) {
      Vue.set(state, 'dateData', {...data})
      console.log('STROE | Commit | updateDateData')
    },
    setImportProgress (state, data) {
      state.importProgress = data
    },
    setAlert (state, data) {
      Vue.set(state, 'appAlertData', data)
      console.log('STROE | Commit | setAlert')
    }
  },
  actions: {
    initDatabaseData ({commit, state}, data) {
      console.log('STROE | Action | initDatabaseData')
      var start = new Date().getTime()
      db.find({
        receiptIndex: { $exists: true }
      }, function (err, docs) {
        if (err) {}
        var end = new Date().getTime()
        console.log('STROE | Action | initDatabaseData | Finish : ', (end - start) / 1000, 's')
        commit('initDatabaseData', docs)
      })
    },
    initDateData ({commit, state}, data) {
      console.log('STROE | Action | initDateData')
      var start = new Date().getTime()
      db.find({
        dateIndex: { $exists: true }
      }, function (err, docs) {
        console.log(docs)
        if (err) {}
        let count = 0
        let res = {}
        for (let i = 0; i < docs.length; i++) {
          let doc = docs[i]
          count += doc._idSet.length
          let date = doc.dateIndex
          for (let j = 0; j < doc._idSet.length; j++) {
            let id = doc._idSet[j]
            db.findOne({
              _id: id
            }, function (err, doc) {
              if (err) {}
              count--
              if (res[date]) {
                res[date].push(doc.amount)
              } else {
                res[date] = [doc.amount]
              }
              if (count === 0) {
                var end = new Date().getTime()
                console.log('STROE | Action | initDateData | Finish : ', (end - start) / 1000, 's')
                commit('updateDateData', res)
              }
            })
          }
        }
        if (count === 0) {
          commit('updateDateData', {})
        }
      })
    },
    addDateData ({commit, dispatch}, data) {
      console.log('STROE | Action | addToDateData')
      console.log('data._id', data)
      var start = new Date().getTime()
      db.update(
        { dateIndex: data.date },
        { $addToSet: { _idSet: data._id } },
        { upsert: true },
        function () {
          let end = new Date().getTime()
          console.log('STROE | Action | addToDateData Finish: ', (end - start) / 1000, 's')
          dispatch('initDateData')
        }
      )
    },
    removeDateData ({commit, dispatch}, data) {
      console.log('STROE | Action | removeDateData', data)
      var start = new Date().getTime()
      db.update(
        { dateIndex: data.date },
        { $pull: { _idSet: data._id } },
        {},
        function (err) {
          if (err) {}
          let end = new Date().getTime()
          console.log('STROE | Action | removeDateData Finish: ', (end - start) / 1000, 's')
          dispatch('initDateData')
        }
      )
    },
    async addReceiptData ({state, commit, dispatch}, data) {
      console.log('STROE | Action | addReceiptData')
      var start = new Date().getTime()
      let receiptIndex = await db.getAutoincrementId()
      data.receiptIndex = receiptIndex
      data.amount = parseInt(data.amount)
      data.deleted = false
      let fileName = dialog.showSaveDialog({
        title: multLang({'cn': '保存收据位置', 'en': 'Choose A Save Location'}, state.theme.language),
        filters: [
          { name: 'WORD', extensions: ['docx'] }
        ]
      })
      if (!fileName) return
      try {
        receiptWordGenerator.generate(fileName, data)
      } catch (err) {
        commit('setAlert', {
          title: multLang({'cn': '生成收据文档失败', 'en': 'Fail to Generate Receipt'}, state.theme.language),
          desc: err.message,
          level: 2
        })
        return
      }
      db.insert(data, function (err, newDoc) {
        if (err) {}
        var end = new Date().getTime()
        console.log('STROE | Action | addReceiptData | Finish : ', (end - start) / 1000, 's')
        commit('setAlert', {
          title: multLang({'cn': '生成收据成功', 'en': 'Success!'}, state.theme.language),
          desc: multLang({'cn': `收据文件保存至：${fileName}`, 'en': `Save Receipt Word to：${fileName}`}, state.theme.language),
          level: 0
        })
        dispatch('addDateData', newDoc)
        dispatch('initDatabaseData')
      })
    },
    updateReceiptData ({state, commit, dispatch}, data) {
      console.log('STROE | Action | updateReceiptData')
      let start = new Date().getTime()
      let newItem = data.newItem
      let oldItem = data.oldItem
      newItem.amount = parseInt(newItem.amount)
      db.update(
        { _id: oldItem._id },
        newItem,
        {},
        function (err, numReplaced) {
          if (err) {}
          let end = new Date().getTime()
          console.log('STROE | Action | updateReceiptData Finish: ', (end - start) / 1000, 's')
          dispatch('initDatabaseData')
          if (oldItem.date !== newItem.date) {
            dispatch('removeDateData', oldItem)
            dispatch('addDateData', newItem)
          } else if (oldItem.amount !== newItem.amount) {
            dispatch('initDateData')
          }
        }
      )
    },
    deleteReceiptData ({commit, dispatch}, data) {
      console.log('STROE | Action | deleteReceiptData')
      db.update(
        { _id: data._id },
        { $set: {deleted: true} },
        {},
        function (err, numReplaced) {
          if (err) {}
          dispatch('removeDateData', data)
          dispatch('initDatabaseData')
        }
      )
    },
    recoverReceiptData ({commit, dispatch}, data) {
      console.log('STROE | Action | recoverReceiptData')
      db.update(
        { _id: data._id },
        { $set: {deleted: false} },
        {},
        function (err, numReplaced) {
          if (err) {}
          dispatch('addDateData', data)
          dispatch('initDatabaseData')
        }
      )
    },
    clear ({state, commit, dispatch}) {
      console.log('STROE | Action | clear')
      db.remove(
        {},
        {multi: true},
        function (err, numRemoved) {
          console.log('STROE | Action | clear finish', numRemoved)
          if (err) {
            commit('setAlert', {
              title: multLang({'cn': `清空失败`, 'en': `Fail to Clear`}, state.theme.language),
              desc: multLang({'cn': '清空数据库时出现未知错误', 'en': `An Unknown Error Occurred while Emptying the Database`}, state.theme.language),
              level: 2
            })
          }
          commit('setAlert', {
            title: multLang({'cn': `清空成功`, 'en': `Success!`}, state.theme.language),
            desc: multLang({'cn': `数据库和回收站已清空`, 'en': `Database And Trash Have Been Emptied`}, state.theme.language),
            level: 0
          })
          dispatch('initDatabaseData')
          dispatch('initDateData')
        }
      )
    },
    exportDatabase ({state, commit, dispatch}) {
      console.log('STROE | Action | exportDatabase')
      let fileName = dialog.showSaveDialog({
        title: multLang({'cn': '导出数据库位置', 'en': 'Choose A Save Location'}, state.theme.language),
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      })
      if (!fileName) return
      db.find({
        receiptIndex: { $exists: true }
      }, function (err, docs) {
        if (err) {
          commit('setAlert', {
            title: multLang({'cn': '导出失败', 'en': 'Fail to Export'}, state.theme.language),
            desc: multLang({'cn': '数据库提取数据失败', 'en': 'Fail to Extract Data from Database'}, state.theme.language),
            level: 2
          })
        }
        try {
          fs.writeFileSync(fileName, JSON.stringify(docs, null, 4))
        } catch (err) {
          console.log(err)
          commit('setAlert', {
            title: multLang({'cn': '导出失败', 'en': 'Fail to Export'}, state.theme.language),
            desc: multLang({'cn': '数据库文件保存失败', 'en': 'Fail to Save the Database File'}, state.theme.language),
            level: 2
          })
          return
        }
        commit('setAlert', {
          title: multLang({'cn': '导出成功', 'en': 'Success!'}, state.theme.language),
          desc: multLang({'cn': `数据库文件导出成功，共导出${docs.length}条数据`, 'en': `Success to Export Database File, Includes ${docs.length} Items`}, state.theme.language),
          level: 0
        })
      })
    },
    async importDatabase ({state, commit, dispatch}) {
      console.log('STROE | Action | importDatabase')
      var start = new Date().getTime()
      let fileNames = dialog.showOpenDialog({
        title: multLang({'cn': '选择导入的数据库', 'en': 'Choose A Database File'}, state.theme.language),
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      })
      if (!fileNames) {
        return
      }
      try {
        var data = JSON.parse(fs.readFileSync(fileNames[0]))
      } catch (err) {
        commit('setAlert', {
          title: multLang({'cn': '导入错误', 'en': 'Fail to Import'}, state.theme.language),
          desc: multLang({'cn': '数据库文件解析失败', 'en': 'Failed While Parsing the Database File'}, state.theme.language),
          level: 2
        })
        return
      }
      if (!data.length) {
        commit('setAlert', {
          title: multLang({'cn': '导入错误', 'en': 'Fail to Import'}, state.theme.language),
          desc: multLang({'cn': '数据库文件解析JSON为非数组类型', 'en': 'Database File Cannot Be Parsed as An Array Type'}, state.theme.language),
          level: 2
        })
        return
      }
      let count = 0
      let skipCount = 0
      for (let item of data) {
        console.log('STROE | Action | addReceiptData')
        if (typeof item.amount !== 'number' || !item.date) {
          console.log('SKIP: ', item)
          skipCount += 1
          count += 1
          continue
        }
        item.name = item.name !== undefined ? item.name : '空'
        item.payee = item.payee !== undefined ? item.payee : '空'
        item.issuer = item.issuer !== undefined ? item.issuer : '空'
        item.comment = item.comment !== undefined ? item.comment : ''
        item.deleted = item.deleted !== undefined ? item.deleted : false
        let receiptIndex = await db.getAutoincrementId()
        item.receiptIndex = receiptIndex
        item.amount = parseInt(item.amount)
        delete item['_id']
        db.insert(item, function (err, newDoc) {
          if (err) {
            skipCount += 1
            count++
            return
          }
          db.update(
            { dateIndex: newDoc.date },
            { $push: { _idSet: newDoc._id } },
            { upsert: true },
            function () {
              count += 1
              commit('setImportProgress', count / data.length)
              console.log('importing...', count / data.length)
              if (count === data.length) {
                var end = new Date().getTime()
                console.log('import finish:', (end - start) / 1000, 's')
                commit('setAlert', {
                  title: multLang({'cn': '导入成功', 'en': 'Success!'}, state.theme.language),
                  desc: multLang({'cn': `数据库文件导入完成，共导入${count - skipCount}条数据`, 'en': `Success to Import the Database File includes ${count - skipCount} Items`}, state.theme.language),
                  level: 0
                })
                commit('setImportProgress', 0)
                dispatch('initDatabaseData')
                dispatch('initDateData')
              }
            }
          )
        })
      }
    }
  }
})
