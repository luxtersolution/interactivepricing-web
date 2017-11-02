import '../services/'
import pricer from './pricer.component'

console.log( "in Pricer Component" );

export default angular.module( 'valuation.pricer', [ 'valuation.services' ] )
.component( 'pricer', pricer )

