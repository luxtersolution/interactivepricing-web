"use strict";

const router    = require('express').Router()
const path      = require('path')
const fs        = require('fs')
const cfg       = require('../../../config')

const Pricer    = require('./pricer')
const views_path = 'valuation/'
const debug         = require('debug')("web")

function init() {
  router.get( '/valuation/partials/products/:partial', (req, res) => {
    debug( "Fetching product", req.params.partial)
    res.render( views_path + 'products/'+req.params.partial, {} )
  })

  router.get( '/valuation/partials/pricer/:partial', (req, res) => {
    debug( "Fetching pricer", req.params.partial)
    res.render( views_path + 'pricers/'+req.params.partial, {})
  })

  router.post( '/valuation/calculate', (req, res) => {

    debug( "Requested calc:", req.body );
    let pricer;
    try {
      pricer = new Pricer( req.body.instrument );
    }
    catch( error ) {
      return res.status(error.statusCode || 400).json( { message: error.message, status: error.statusCode, type: 'validation' } );
    }

    pricer.validate( req ).then( (validation_result) => {
      if (!validation_result.isEmpty()) {
        res.status(400).json( { errors: validation_result.mapped(), type:'validation' } );
      }
      else {
        pricer.calculate( req.body )
        .then( result => {
          res.json( result );
        })
        .catch( error => {
          res.status(error.statusCode || 400).json( error );
        });
      }
    }).catch( error => {
      res.status(error.statusCode || 400).json( error );
    });

  });

  router.get('/*', (req, res) => {
    res.render( views_path + '/index', {})
  })

  return router;
}

module.exports = init
