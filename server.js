'use strict'
// Application Dependencies
const express = require('express');
const pg = require('pg');
const methodOverride = require('method-override');
const superagent = require('superagent');
const cors = require('cors');
const bodyParser = require('body-parser')

// Environment variables
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Express middleware

// Utilize ExpressJS functionality to parse the body of the request
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({extended: true}));
// Specify a directory for static resources
app.use(express.static('public'))
// define our method-override reference
app.use(methodOverride('_method'))
// Set the view engine for server-side templating
app.set('view engine','ejs')
// Use app cors
app.use(cors())

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL);

// app routes here
// -- WRITE YOUR ROUTES HERE --

app.get('/', getQoutes)
app.post('/', saveQoutes)
app.get('/favorite-quotes', renderFavQoutes)
app.get('/favorite-quotes/:quote_id', renderDetails)
app.put('/favorite-quotes/:quote_id', updateQoute)
app.delete('/favorite-quotes/:quote_id', deleteteQoute)


// callback functions
// -- WRITE YOUR CALLBACK FUNCTIONS FOR THE ROUTES HERE --
function renderDetails(req,res) {
    const id =req.params.quote_id;
    const safeValues = [id];
    const sqlQuery = 'SELECT * FROM simscharachters WHERE id=$1;'

client.query(sqlQuery,safeValues).then(result => {
    const details = result.rows;
    res.render('details', {details: details} )
}


).catch( (error,response)=>{
    errorHandler(error,response)
        }
    
        )

  
}

function updateQoute(req,res) {
    const id = req.params.quote_id;
    const qoute = req.body.qoute;
    const safeValues =[qoute,id]
    const sqlQuery = 'UPDATE simscharachters SET quote=$1 WHERE id=$2;'
    client.query(sqlQuery,safeValues).then(()=> {
        res.redirect(`/favorite-quotes/${id}`)
    }).catch( (error,response)=>{
        errorHandler(error,response)
})}

function deleteteQoute(req,res) {
    const id = req.params.quote_id;
    const safeValues =[id]
    const sqlQuery = 'DELETE FROM simscharachters WHERE id=$1;'
    client.query(sqlQuery,safeValues).then(()=> {
        res.redirect(`/favorite-quotes/${id}`)
    }).catch( (error,response)=>{
        errorHandler(error,response))

}


function getQoutes(req,res) {
    const url = 'https://thesimpsonsquoteapi.glitch.me/quotes?count=10'
    superagent.get(url).set('User-Agent', '1.0').then(data=>{
        // console.log(data.body)
        const qoutesTen = data.body.map(
            
            element => {
                console.log(element);
                new Newcharacter(element)}
        );
        console.log(qoutesTen)
        res.render('index', {qoutesTen: qoutesTen})
    }).catch( (error,response)=>{
errorHandler(error,response)
    }

    )
}

function saveQoutes(req,res) {
    const {character,quote,image,characterDirection} = req.body;
    console.log(character,quote,image,characterDirection)
    const safeValues = [character,quote,image,characterDirection];
    const sqlQuery = `INSERT INTO simscharachters (character,quote,image,characterdirection) VALUES($1, $2, $3, $4);`

client.query(sqlQuery).then(()=>{

}).catch( (error,response)=>{
    errorHandler(error,response)
        }
    
        )

}

function renderFavQoutes(req,res) {
    const sqlQuery = `SELECT * FROM simscharachters;`
    client.query(sqlQuery).then(
        (result)=> {
           const favQoutes= result.rows;
           res.render('favorite-quotes', {favQoutes: favQoutes})
        }
    ).catch( (error,response)=>{
        errorHandler(error,response)
            }
        
            )
}

// helper functions

function errorHandler(error,response) {
    response.render('error')
}
// function Newcharacter(element) {
//     this.character = element.character? element.character: 'N/A' ;
//     this.quote = element.quote? element.quote: 'N/A' ;
//     this.image = element.image? element.image: 'N/A' ;
//     this.characterDirection = element.characterDirection? element.characterDirection: 'N/A' ;
// }

function Newcharacter(element) {
    this.character = element.character;
    this.quote = element.quote;
    this.image = element.image;
    this.characterDirection = element.characterDirection;
}

// app start point
client.connect().then(() =>
    app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))
);
