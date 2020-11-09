const fs = require('fs')
const bodyParser = require('body-parser')
const app = require('express')()
const csv = require('csv-parser')

const data = []
fs.createReadStream(
  './api/data/Police_Department_Incident_Reports__2018_to_Present.csv'
)
  .pipe(csv())
  .on('data', (row) => {
    data.push(row)
  })
  .on('end', () => {
    // eslint-disable-next-line no-console
    console.log(`CSV file successfully processed (${data.length}) rows`)
    console.log(data[0])
  })

app.use(bodyParser.json())
app.all('/getJSON', (req, res) => {
  res.json({ data: 'data' })
})
app.all('/getCrimes', (req, res) => {
  const r = []
  for (let i = 0; i < 100; i++) {
    r.push({
      lat: data[i].Latitude,
      lng: data[i].Longitude,
    })
  }
  res.json(r)
})
module.exports = app
