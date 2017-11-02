class ProductParameters {
  constructor( $http, Constants ) {
    'ngInject';
    this.$http = $http;
    this.Constants = Constants;
    this.product2params = Constants.productparameters;
  }
  getParams( product ) {
    return this.product2params[ product ]
  }
};
export default ProductParameters;
