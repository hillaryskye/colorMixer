var routes = require('routes')(),
        fs = require('fs'),
      view = require('mustache'),
      mime = require('mime'),
        db = require('monk')('localhost/colors'),
    colors = db.get('colors'),
        qs = require('qs'),
      view = require('./view')


      routes.addRoute('/colors', (req, res, url) => {
        console.log(url.route)
        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'text/html')
          colors.find({}, function (err, docs) {
            if (err) res.end('oops from root')
            var template = view.render('colors/index', { colors: docs})
            res.end(template)
          })
        }

        if (req.method === 'POST') {
          var data = ''

          req.on('data', function (chunk) {
            data += chunk
          })

          req.on('end', function () {
            var color = qs.parse(data)
            colors.insert(color, function (err, doc) {
              if (err) res.end('oops from insert')
              res.writeHead(302, {'Location': '/colors'})
              res.end()
            })
          })
        }
      })

      routes.addRoute('/public/*', function (req, res, url) {
        res.setHeader('Content-Type', mime.lookup(req.url))
        fs.readFile('.' + req.url, function (err, file) {
          if (err) {
            res.setHeader('Content-Type', 'text/html')
            res.end('404 from public')
          }
          res.end(file)
        })
      })

module.exports = routes
