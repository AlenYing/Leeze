import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

var db = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), '/database.db')
})

db.getAutoincrementId = function () {
  let p = new Promise(function (resolve, reject) {
    db.update(
      { _id: '__autoid__' },
      { $inc: { seq: 1 } },
      { upsert: true, returnUpdatedDocs: true },
      function (err, affected, autoid) {
        if (err) {
          reject(err)
        } else {
          resolve(autoid.seq)
        }
      }
    )
  })
  return p
}

export default db
