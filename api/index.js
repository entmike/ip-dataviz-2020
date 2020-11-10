/* eslint-disable no-console */
const bodyParser = require('body-parser')
const app = require('express')()
const db = require('./database.js')

app.use(bodyParser.json())

/**
 * Super Lazy SQL API method
 *
 * @param {*} req
 * @param {*} res
 */
const sqlAPI = (req, res) => {
  const sql = req.body.sql
  console.log(sql)
  db.all(sql, (err, rows) => {
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
/**
 * 
 * Example request object
  {
    "fields" : ["Incident ID","Incident Category","Incident Description","Latitude","Longitude"],
    "filters":{
        "Analysis Neighborhood" : {"values":["South of Market","Bayview Hunters Point"],"type":"c"},
        "Incident Date" : {"values":["2018/01/01"], "type":"c"}
    }
  }

  Example with GROUP BY
  {
    "fields" : [Incident Category", "~COUNT(*)"],
    "groupby" : ["Incident Category"],
    "filters":{
        "Analysis Neighborhood" : {"values":["South of Market","Bayview Hunters Point"],"type":"c"},
        "Incident Date" : {"values":["2018/01/01"], "type":"c"}
    }
}
 */
const selectAPI = (req, res) => {
  let fields = '*'
  let groupby = ''
  let limit = ''
  if (req.body.fields !== undefined) {
    fields = []
    req.body.fields.map((f) => {
      if (f[0] !== '~') fields.push(`[${f}]`)
      else fields.push(`${f.substring(1)}`)
    })
    fields = fields.join(', ')
  }
  if (req.body.groupby !== undefined) {
    const groups = []
    req.body.groupby.map((f) => {
      groups.push(`[${f}]`)
    })
    if (groups.length > 0) groupby = `GROUP BY ${groups.join(', ')}`
  }
  let sql = `SELECT ${fields} FROM incidents WHERE 1 = 1`
  for (const filter in req.body.filters) {
    console.log(filter)
    const values = []
    req.body.filters[filter].values.map((v) => {
      if (req.body.filters[filter].type === 'c') values.push(`"${v}"`)
      else values.push(v)
    })
    sql += ` AND "${filter}" IN (${values.join(',')})`
  }
  if (req.body.limit !== undefined) limit = `LIMIT ${req.body.limit}`
  sql = `${sql} ${groupby} ${limit}`
  console.log(sql)
  db.all(sql, (err, rows) => {
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
app.all('/select', selectAPI)
app.all('/sql', sqlAPI)

module.exports = app
