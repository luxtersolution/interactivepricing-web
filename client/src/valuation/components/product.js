export default {
  bindings: { product: '<' },
  template: '<div ng-include="$ctrl.getTemplate()"></div>',
  controller: function() {
    this.getTemplate = function () {
      return `/valuation/partials/products/${this.product}`;
    };
  }
}
