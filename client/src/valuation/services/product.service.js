class ProductService {
  constructor( $http, Constants ) { // TODO: Maybe it's better to fetch the list of products from server?
    'ngInject';
    this.$http = $http;
    this.Constants = Constants;
  }

  getProducts() {
    return Object.keys(this.Constants.productparameters);
  }
}

export default ProductService;
