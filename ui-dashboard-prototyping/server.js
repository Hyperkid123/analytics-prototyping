const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { handleEventEmit } = require('./backend/database')

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
        if(pathname === '/api/event' && req.method === 'POST') {
          // console.log('req.method', req)
          req.setEncoding('utf-8')
          const rb = [];
          req.on('data', (chunks) => {
            rb.push(chunks)
          })
          req.on('end', () => {
            const body = JSON.parse(rb.join(""));
            console.log(body)
            res.writeHead(200,{"Content-Type":"application/json","Access-Control-Allow-Origin": "*"});
            res.end(JSON.stringify({ error: false, 'recieved': body}))

          })
          // handleEventEmit()
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