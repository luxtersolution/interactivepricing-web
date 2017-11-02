import PricerController from './pricer.controller'

export default {
  bindings: { product: '<' },
  template: '<div ng-include="$ctrl.getTemplate()"></div>',
  controller: PricerController,
  contollerAs: 'pricerCtrl'
};
