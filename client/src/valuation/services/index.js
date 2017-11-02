import productService from './product.service'
import productParameters from './productparameters.service'

export default angular.module( 'valuation.services', [] )
.service( 'ProductService',    productService )
.service( 'ProductParameters', productParameters )
