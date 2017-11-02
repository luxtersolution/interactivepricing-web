"use strict";
const path          = require('path')
const express       = require('express')
const pug           = require('pug')
const bodyParser    = require('body-parser')
const morgan        = require('morgan')

const config        = require('../config')
const validator     = require('express-validator')

const app = express()
console.log( process.env.NODE_ENV );
app.set( 'x-powered-by', false ); app.set( 'view engine', 'pug' ); app.set( 'views', path.join( __dirname, config.directories.publicDir + "/views" ) );
app.use( bodyParser.urlencoded({ extended: false }) ); app.use( bodyParser.json() );
app.use(validator()); // use express-validator after you use the body parser middleware
app.use( express.static( path.join( __dirname, config.directories.publicDir + "/build" ) ) );

app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode < 400
  }, stream: process.stderr
}));

app.use(morgan('dev', {
  skip: function (req, res) {
    return res.statusCode >= 400
  }, stream: process.stdout
}));

app.locals.basedir = path.join( __dirname, config.directories.publicDir + "/views" );

app.use('/', require( './sections/valuation' ).init());

// Error handling
app.use(function(err, req, res, next) {
  if ( err ) {
    console.error(err.stack);
    res.status(500).send( err.message || "Something's broken!" );
  } else {
    res.status(500).send( "Something's broken!" );
  }
});
app.use(function(req, res, next) {
  res.status(404).send( 'Sorry cant find that!');
});

module.exports = app
