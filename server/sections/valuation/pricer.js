const grpc_lib  = require('grpc')
const interactivePricingMessages = require('../../proto/interactivepricing/service_pb')
const interactivePricingServices = require('../../proto/interactivepricing/service_grpc_pb')
const julian    = require('julian')
const moment    = require('moment')
const any_lib   = require('google-protobuf/google/protobuf/any_pb')
const interactive_pricing_service = new interactivePricingServices.ValuerClient( `${process.env.extserv_host}:${process.env.extserv_port}`, grpc_lib.credentials.createInsecure())
const prefix    = 'type.googleapis.com/'
const debug     = require('debug')("web")

function makeDate( strDate ) {
  var tmp = new Date(strDate+"Z");
  var tmp2 = Math.ceil(julian(tmp));
  return tmp2;
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function trimResult( resultString ) {
  var result = (resultString.toString()).match(/[-]?[0-9]*\.?[0-9]{1,2}/);
  return result[0];
}

class Pricer {
  constructor( instrument_type ) {
    this.instrument_type = instrument_type;
    var instrument = null;
    if ("FxSpot" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxSpot();
    }
    else if ("FxForward" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxForward();
    }
    else if ("FxSwap" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxSwap();
    }
    else if ("FxEuropeanVanillaOption" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxEuropeanVanillaOption();
    }
    else if ("FxEuropeanDigitalOption" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxEuropeanDigitalOption();
    }
    else if ("FxSingleBarrierOption" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxSingleBarrierOption();
    }
    else if ("FxNoTouch" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxNoTouch();
    }
    else if ("FxOneTouch" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxOneTouch();
    }
    else if ("FxDoubleBarrierOption" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxDoubleBarrierOption();
    }
    else if ("FxDoubleNoTouch" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxDoubleNoTouch();
    }
    else if ("FxDoubleOneTouch" == instrument_type) {
      instrument = new interactivePricingMessages.InstrumentFxDoubleOneTouch();
    }
    else {
      throw new Error( "Can not construct such instrument: "+ instrument_type );
    }
    this.instrument = instrument;
  }

  setProperties( args ) {
    if ( this.instrument_type == "FxSpot" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');

      this.instrument.setUnderlying(args.underlying);
      this.instrument.setSettlementDate(makeDate(settlementDateStr));
      this.instrument.setBaseNotional(args.baseNotional);
      this.instrument.setTermNotional(args.termNotional);
    }
    else if ( this.instrument_type == "FxForward" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setSettlementDate(makeDate(settlementDateStr));
      this.instrument.setBaseNotional(args.baseNotional);
      this.instrument.setTermNotional(args.termNotional);
    }
    else if ( this.instrument_type == "FxSwap" ) {
      let initialSettlementDateStr = moment( args.initialSettlementDate ).format('YYYY-MM-DD');
      let finalSettlementDateStr   = moment( args.finalSettlementDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setInitialSettlementDate( makeDate( initialSettlementDateStr ) );
      this.instrument.setFinalSettlementDate( makeDate( finalSettlementDateStr ) );
      this.instrument.setBaseNotional( args.baseNotional );
      this.instrument.setTermNotional( args.termNotional );
      this.instrument.setSpread( args.spread );
    }
    else if ( this.instrument_type == "FxEuropeanVanillaOption" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      let expiryDateStr   = moment( args.expiryDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(makeDate( expiryDateStr ));
      this.instrument.setSettlementDate(makeDate( settlementDateStr ));
      this.instrument.setSettlementType( args.settlementType );
      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setOptionType( args.optionType );
      this.instrument.setStrike( args.strike );
    }
    else if ( this.instrument_type == "FxEuropeanDigitalOption" ) {
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(makeDate( args.expiryDate ));
      this.instrument.setSettlementDate(makeDate( args.settlementDate ));
      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setOptionType( args.optionType );
      this.instrument.setStrike( args.strike );
    }
    else if ( this.instrument_type == "FxSingleBarrierOption" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      let expiryDateStr   = moment( args.expiryDate ).format('YYYY-MM-DD');

      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(     makeDate( expiryDateStr )     );
      this.instrument.setSettlementDate( makeDate( settlementDateStr ) );
      this.instrument.setSettlementType( args.settlementType );
      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setOptionType( args.optionType );
      this.instrument.setStrike( args.strike );
      this.instrument.setBarrierType( args.barrierType );
      this.instrument.setBarrierDirection( args.barrierDirection );
      this.instrument.setBarrier( args.barrier );
      this.instrument.setRebate( args.rebate );
      this.instrument.setRebateCurrency( args.rebateCurrency );
      this.instrument.setRebateTime( args.rebateTime );
    }
    else if ( this.instrument_type == "FxNoTouch" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      let expiryDateStr     = moment( args.expiryDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(     makeDate( expiryDateStr )     );
      this.instrument.setSettlementDate( makeDate( settlementDateStr ) );
      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setBarrier( args.barrier );
      this.instrument.setBarrierDirection( args.barrierDirection );
    }
    else if ( this.instrument_type == "FxOneTouch" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      let expiryDateStr     = moment( args.expiryDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(     makeDate( expiryDateStr )     );
      this.instrument.setSettlementDate( makeDate( settlementDateStr ) );

      this.instrument.setPaymentTime( args.paymentTime );
      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setBarrier( args.barrier );
      this.instrument.setBarrierDirection( args.barrierDirection );
    }
    else if ( this.instrument_type == "FxDoubleBarrierOption" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      let expiryDateStr     = moment( args.expiryDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(     makeDate( expiryDateStr )     );
      this.instrument.setSettlementDate( makeDate( settlementDateStr ) );

      this.instrument.setSettlementType( args.settlementType );
      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setOptionType( args.optionType );
      this.instrument.setStrike( args.strike );
      this.instrument.setBarrierType( args.barrierType );
      this.instrument.setBarrierLow( args.barrierLow );
      this.instrument.setBarrierHigh( args.barrierHigh );
      this.instrument.setRebate( args.rebate );
      this.instrument.setRebateCurrency( args.rebateCurrency );
      this.instrument.setRebateTime( args.rebateTime );
    }
    else if ( this.instrument_type == "FxDoubleNoTouch" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      let expiryDateStr     = moment( args.expiryDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(     makeDate( expiryDateStr )     );
      this.instrument.setSettlementDate( makeDate( settlementDateStr ) );

      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setBarrierLow( args.barrierLow );
      this.instrument.setBarrierHigh( args.barrierHigh );
    }
    else if ( this.instrument_type == "FxDoubleOneTouch" ) {
      let settlementDateStr = moment( args.settlementDate ).format('YYYY-MM-DD');
      let expiryDateStr     = moment( args.expiryDate ).format('YYYY-MM-DD');
      this.instrument.setUnderlying(args.underlying);
      this.instrument.setExpiryDate(     makeDate( expiryDateStr )     );
      this.instrument.setSettlementDate( makeDate( settlementDateStr ) );

      this.instrument.setPaymentTime( args.paymentTime );
      this.instrument.setNotional( args.notional );
      this.instrument.setNotionalCurrency( args.notionalCurrency );
      this.instrument.setBarrierLow( args.barrierLow );
      this.instrument.setBarrierHigh( args.barrierHigh );
    }
  }

  validate( req ) {
    let object = this;
    return new Promise( function (resolve, reject) {
      if ( !object.instrument_type && !object.instrument ) {
        reject( new Error('Instrument not defined') )
      }
      else {
        if ( object.instrument_type == "FxSpot" ) { // Sample validation usage
          req.checkBody('settlementDate', 'Invalid SettlementDate').isISO8601()
          req.checkBody('underlying').isIn(['AUDUSD', 'GBPUSD', 'EURUSD', 'USDSGD', 'USDJPY']);
          req.checkBody('settlementDate').isISO8601();
          req.checkBody('baseNotional').isInt();
          req.checkBody('termNotional').isInt();
        }
        resolve(req.getValidationResult());
      }
    });
  }

  calculate( args ) {
    try {
      this.setProperties( args );
    }
    catch (err) {
      debug( "Error in params:", err );
      return Promise.reject( { error: { code: err.message }, type: "grpc" } );
    }

    debug( `Instr: ${args.instrument} @ ${process.env.extserv_host}:${process.env.extserv_port}` );
    var any_instrument = new proto.google.protobuf.Any();
    any_instrument.setTypeUrl( prefix + "interactivepricing.Instrument" + this.instrument_type );
    any_instrument.setValue( this.instrument.serializeBinary() );
  
    var context = new interactivePricingMessages.ValuationContext();
    context.setValuationDate(makeDate("2016/06/25"));
    context.setVolatility(0.07);
    context.setFxSpot(1.13);
    context.setDomesticRate(0.05);
    context.setForeignRate(0.025);
 
    var value_request = new interactivePricingMessages.ValuationRequest();
    value_request.setInstrument(any_instrument);
    var measures = [];
    if ( this.instrument instanceof interactivePricingMessages.InstrumentFxSpot ||
         this.instrument instanceof interactivePricingMessages.InstrumentFxForward ||
         this.instrument instanceof interactivePricingMessages.InstrumentFxSwap )
      measures = ['npv', 'delta'];
    else
      measures = ['npv', 'delta', 'gamma', 'vega', 'volga', 'vanna'];
 
    value_request.setRiskMeasuresList(measures)
    value_request.setContext(context);

    return new Promise(function (resolve, reject) {
      interactive_pricing_service.value( value_request, function(err, response) {
        if(err != null) {
          debug('GRPC Error occurred: ', err);
          reject( { error: err, type: "grpc" } );
        }
        else {
          var measures = value_request.getRiskMeasuresList();
          var values = response.getRiskMeasuresList();
          let result = {};
          for ( var i = 0; i < measures.length; i++) {
            result[measures[i]] = trimResult(values[i]);
          }
          debug('Value OK', result);
          resolve( result );
        }
      });
    });
  }
}

module.exports = Pricer;
