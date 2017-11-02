export default {
  template: //'<pre>Product: {{selected | json}}</pre>'+
      `<input 
          ng-model="selected"
          uib-typeahead="product for product in $ctrl.products | filter:$viewValue | limitTo:4"
          class="form-control"
          typeahead-on-select="$ctrl.showProduct($item, $model, $label)"/>
      <div class="newspaper">
        <p class="text-center" ng-repeat="product in $ctrl.products  | filter:selected:strict">
          <a ui-sref="products.product({productId:product})">{{product}}</a>
        </p>
      </div>
      <ui-view></ui-view>`,
  controller: function( Constants, $state ) {
    'ngInject';
    this.products = Object.keys( Constants.productparameters );
    this.showProduct = function( $item, $model, $label ) {
      $state.go('products.product', { productId: $item } )
    }
  }
}
