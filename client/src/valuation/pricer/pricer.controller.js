class PricerController {
  constructor( $log, $http, $templateCache, Constants ) {
    'ngInject';
    this.$log = $log;
    this.$http = $http;
    this.$templateCache = $templateCache;
    this.ProductParameters = Constants.productparameters;
    this.$http = $http;
    //console.log("PP1:", this.ProductParameters );
  }
  $onInit() {
    this.inputs = {};
    this.validation_errors = undefined
    this.inputs.instrument = this.product;
    // Hardcoded defaults
    this.underlyings = ['AUDUSD', 'GBPUSD', 'EURUSD', 'USDSGD', 'USDJPY'];
    this.inputs.underlying = this.underlyings[0];
    this.updateCurrencies();
    this.inputs.today = new Date();
    this.inputs.notional = 10000.01;
    this.inputs.baseNotional = 10000.01;
    this.inputs.termNotional = 11775.01;
    this.inputs.settlementDate = new Date('2016/06/27');

    this.inputs.initialSettlementDate = new Date('2016/06/27');
    this.inputs.finalSettlementDate = new Date('2017/06/27');
    this.inputs.spread = 1000;

    this.inputs.expiryDate = new Date('2017/06/23');
    this.inputs.settlementType = 'delivery';
    this.inputs.optionType = 'call';
    this.inputs.strike = 1.15;

    this.inputs.barrierType = 'knockin';
    this.inputs.barrierDirection = 'down';
    this.inputs.barrier = 1.1000;
    this.inputs.rebate = 0;
    this.inputs.rebateTime = 'payathit';

    this.inputs.paymentTime = 'payatexpiry';

    this.inputs.barrierLow = 1.1000;
    this.inputs.barrierHigh = 1.3000;

    this.inputs.expiry = new Date('2016/06/23').toISOString;

    this.inputs.settlement = "delivery";
    this.inputs.payoff = 'call';
  };

  getTemplate() {
    return `/valuation/partials/pricer/${this.product}`;
  };

  updateCurrencies() {
    this.currencies = [ this.inputs.underlying.substr(0,3), this.inputs.underlying.substr(3,3) ];
    this.inputs.notionalCurrency = this.currencies[0];
    this.inputs.rebateCurrency = this.currencies[0];
  }

  calculate() {
    // reset errors/results
    this.validation_errors = undefined
    this.result = undefined
    // Set loading indicator
    this.loading = true;

    console.log( 'Instrument:', this.product );
    let sendData = {}; 
    sendData = {instrument: this.product};
    let self = this;
    this.ProductParameters[ this.product ].forEach( function( param ) {
      sendData[param] = self.inputs[param];
    })

    this.$http({method: 'POST',
           url: '/valuation/calculate',
           data: sendData
      })
      .then( function(response) {
        console.log('Success:', response.data );
        self.result = response.data;
      })
      .catch( function(response) {
        console.error('Gists error', response.data );
        if ( response.data.message ) {
          self.validation_errors = response.data;
        }
        else if( response.data.type == 'grpc' ) {
          self.validation_errors = ['GRPC Error:'+response.data.error.code];
        }
        else {
          self.validation_errors = response.data.errors;
        }
      })
      .finally(function() {
        console.log("finally finished gists");
        // Reset loading indicator
        self.loading = false;
      });
  };
}
export default PricerController
