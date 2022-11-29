const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { handleEventEmit, getUserEvents, getJourneyEvents, getEventsByDate, getActiveUsers, getUserActivityHeatmap } = require('./backend/database')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      if(pathname.match(/^\/api/)) {
        if(pathname === '/api/event/users' && req.method === 'GET') {
          req.setEncoding('utf-8');
          const email = query.email
          const events = getUserEvents(email)
          res.end(JSON.stringify({events}))
          return
        }
        if(pathname === '/api/event/active/users' && req.method === 'GET') {
          const startTimestamp = query.start
          const endTimestamp = query.end
          const users = getActiveUsers(startTimestamp, endTimestamp)
          res.end(JSON.stringify({users}))
          return
        }
        if(pathname === '/api/event/users/heatmap' && req.method === 'GET') {
          const startTimestamp = query.start
          const endTimestamp = query.end
          const heatmap = getUserActivityHeatmap(startTimestamp, endTimestamp)
          res.end(JSON.stringify({heatmap}))
          return
        }
        if(pathname === '/api/event/journeys' && req.method === 'GET') {
          const journeyName = query.journey
          const journeys = getJourneyEvents(journeyName)
          res.end(JSON.stringify({journeys}))
          return
        }
        if(pathname === '/api/event/activity' && req.method === 'GET') {
          const startTimestamp = query.start
          const endTimestamp = query.end
          const events = getEventsByDate(Number(startTimestamp), Number(endTimestamp))
          res.end(JSON.stringify({events}))
          return
        }
        if(pathname === '/api/event' && req.method === 'POST') {
          // console.log('req.method', req)
          req.setEncoding('utf-8')
          const rb = [];
          req.on('data', (chunks) => {
            rb.push(chunks)
          })
          req.on('end', () => {
            const body = JSON.parse(rb.join(""));
            res.writeHead(200,{"Content-Type":"application/json","Access-Control-Allow-Origin": "*"});
            const uuid = handleEventEmit(body)
            const response = {
               error: false,
               'recieved': body,
               ...(uuid ? {
                init: true,
                uuid
               } : {})
            }
            res.end(JSON.stringify(response))
          })
        }
      } else {
        await handle(req, res, parsedUrl)
      }
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})