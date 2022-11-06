const fse = require('fs-extra');
const path = require('path')

const DATABASE_FILE = path.resolve(__dirname, './db.json')

const handleEventEmit = (event) => {
  fse.ensureFileSync(DATABASE_FILE)

  const data = fse.readJsonSync(DATABASE_FILE)
  if(!data.events) {
    data.events = []
  }

  data.events.push(event)
  fse.writeJsonSync(DATABASE_FILE, data, {
    spaces: 2
  })
}

module.exports.handleEventEmit = handleEventEmit
