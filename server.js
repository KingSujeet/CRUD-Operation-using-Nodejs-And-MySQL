const express = require('express');
const http = require('http')
const mysql = require('mysql')
const app = express()
const bodyParser = require('body-parser')
const dateFormat = require('dateformat')

app.use(bodyParser.urlencoded({ extended: true}))

var now = new Date()

app.set('view engine', 'ejs')

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'))
app.use('/js', express.static(__dirname + '/node_modules/tether/dist/js'))
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist/js'))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'))

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mydb"
})

const siteTitle = "Simple Application"
const baseURL = "http://localhost:4000/"

app.get('/', function(req, res){
    con.query("SELECT * FROM e_events ORDER BY e_start_date DESC",(err, result)=>{
        res.render('pages/index', {
            siteTitle : siteTitle,
            pageTitle: "Event list",
            items: result
       })
    })

})

app.get('/event/add', function(req, res){

           res.render('pages/add-event.ejs', {
            siteTitle : siteTitle,
            pageTitle: "Add new event",
            items: ''
       })

})

app.post('/event/add', function(req, res){

   var query = "INSERT INTO `e_events` (e_name,e_start_date,e_end_date,e_desc,e_location) VALUES (";
   query += " '"+req.body.e_name+"',";
   query += " '"+dateFormat(req.body.e_start_date,"yyyy-mm-dd")+"',";
   query += " '"+dateFormat(req.body.e_end_date,"yyyy-mm-dd")+"',";
   query += " '"+req.body.e_desc+"',";
   query += " '"+req.body.e_location+"')";

   con.query(query, (err,result)=>{
            if(err!=null)
            console.log(err)
            res.redirect(baseURL)

   })

})


var server = app.listen(4000, function(){
    console.log('server started on 4000.....')
})

