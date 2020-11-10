/* eslint-disable no-console */
const bodyParser = require('body-parser')
const app = require('express')()
const db = require('./database.js')

app.use(bodyParser.json())

// Declare function so I can use in 2 routes
const getJSON = (req, res) => {
  console.log('getJSON called')
  let sql =
    'SELECT [Row ID], [Incident Datetime], [Incident Description], [Analysis Neighborhood], [Latitude], [Longitude] from incidents where 1 = 1'
  let params = []
  console.log(req.body.AnalysisNeighborhood)
  if (
    req.body.AnalysisNeighborhood !== undefined &&
    req.body.AnalysisNeighborhood.length
  ) {
    sql =
      sql +
      ` and "Analysis Neighborhood" IN (${new Array(
        req.body.AnalysisNeighborhood.length
      )
        .fill('?')
        .join(',')})`
    console.log(sql)
    params = params.concat(req.body.AnalysisNeighborhood)
    console.log(params)
  }

  sql = sql + ' LIMIT 1000'
  db.all(sql, params, (err, rows) => {
    console.log(sql)
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    console.log(`Returning ${rows.length} records`)
    res.json({
      message: 'success',
      data: rows,
    })
  })
}

app.all('/getJSON', getJSON)
app.all('/getCrimes', getJSON)

module.exports = app
