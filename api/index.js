const bodyParser = require('body-parser')
const app = require('express')()
const db = require("./database.js")


app.use(bodyParser.json())

 app.all('/getJSON', (req, res) => {
   console.log('getJSON called');
  var sql = "SELECT [Row ID], [Incident Datetime], [Incident Description], [Analysis Neighborhood], [Latitude], [Longitude] from incidents where 1 = 1"
  var params = []
  console.log(req.body.AnalysisNeighborhood)
  if(req.body.AnalysisNeighborhood !== ''){
    sql = sql + ` and "Analysis Neighborhood" IN (${new Array(req.body.AnalysisNeighborhood.length).fill('?').join(',')})`;
    console.log(sql)
    params = params.concat(req.body.AnalysisNeighborhood)
    console.log(params)
  }
  

  sql = sql + " LIMIT 1000"
  db.all(sql, params, (err, rows) =>{

    console.log('db.all called');
    console.log(rows.length)
    if (err) {
      res.status(400).json({"error":err.message});
      return;
    }
    res.json({
        "message":"success",
        "data":rows
    })
  });
 })


module.exports = app
