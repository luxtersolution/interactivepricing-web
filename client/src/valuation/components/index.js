import productSearch from './productsearch';
import product from './product';
import error from './error';
import '../services/';

export default angular.module( 'valuation.components', [ 'valuation.services' ] )
.component( 'productsearch', productSearch )
.component( 'product', product )
.component( 'error', error )
