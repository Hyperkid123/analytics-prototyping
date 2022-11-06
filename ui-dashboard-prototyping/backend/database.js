const fse = require('fs-extra');
const path = require('path')

const DATABASE_FILE = path.resolve(__dirname, './db.json')
const BASE_STRUCTURE = {}

const handleEventEmit = (event) => {
  fse.ensureFileSync(DATABASE_FILE)

  let data = {}
  try {
    data = fse.readJsonSync(DATABASE_FILE)    
  } catch (error) {
    data = {}
  }
  if(!data.events) {
    data.events = []
  }

  data.events.push(event)
  fse.writeJsonSync(DATABASE_FILE, data, {
    spaces: 2
  })
}

module.exports.handleEventEmit = handleEventEmit
