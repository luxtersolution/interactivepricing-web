const Constants = {
  productparameters: {
    "FxSpot" : [ 'settlementDate', 'underlying', 'baseNotional', 'termNotional' ],
    "FxForward": [ 'settlementDate', 'underlying', 'baseNotional', 'termNotional' ],
    "FxSwap": [ 'initialSettlementDate', 'finalSettlementDate', 'underlying', 'baseNotional', 'termNotional', 'spread' ],
    "FxEuropeanVanillaOption": [ 'settlementDate', 'expiryDate', 'underlying', 'settlementType', 'notional', 'notionalCurrency', 'optionType', 'strike' ],
    //"FxEuropeanDigitalOption": [ 'settlementDate', 'expiryDate', 'underlying', 'notional', 'notionalCurrency', 'optionType', 'strike' ],
    "FxSingleBarrierOption": [ 'settlementDate', 'expiryDate', 'underlying', 'settlementType', 'notional', 'notionalCurrency', 'optionType', 'strike', 'barrierType', 'barrierDirection', 'barrier', 'rebate', 'rebateCurrency', 'rebateTime' ],
    "FxNoTouch": [ 'settlementDate', 'expiryDate', 'underlying', 'notional', 'notionalCurrency', 'barrierDirection', 'barrier' ],
    "FxOneTouch": [ 'settlementDate', 'expiryDate', 'underlying', 'notional', 'notionalCurrency', 'paymentType', 'barrierDirection', 'barrier' ],
    "FxDoubleBarrierOption": [ 'settlementDate', 'expiryDate', 'underlying','settlementType', 'notional', 'notionalCurrency','optionType', 'strike', 'barrierType', 'barrierLow', 'barrierHigh', 'rebate', 'rebateCurrency', 'rebateTime' ],
    "FxDoubleNoTouch": [ 'settlementDate', 'expiryDate', 'underlying','settlementType', 'notional', 'notionalCurrency', 'barrierLow', 'barrierHigh'],
    "FxDoubleOneTouch": [ 'settlementDate', 'expiryDate', 'underlying','settlementType', 'notional', 'notionalCurrency', 'paymentTime', 'barrierLow', 'barrierHigh']
  }
};

export default Constants;
