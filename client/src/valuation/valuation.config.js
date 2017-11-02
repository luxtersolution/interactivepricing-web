'use strict';

function config( $stateProvider, $urlRouterProvider, $breadcrumbProvider, $locationProvider ) {
  'ngInject';
  $locationProvider.html5Mode(true);
  $breadcrumbProvider.setOptions({
    template: `<ol class="breadcrumb">
        <li ng-repeat="step in steps" class="breadcrumb-item" ng-class="{active: $last}" ng-switch="$last || !!step.abstract">
          <a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a>
          <span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span>
        </li>
      </ol>
    `
  });

  //$urlRouterProvider.when("",  "/products");
  //$urlRouterProvider.when("/", "/products");
  $urlRouterProvider.otherwise("/products");

 let about = {
    name: 'about',
    url: '/about',
    template: "This is a web client for interactivepricing.com engine.",
    atRoot: true,
  }
  // Abstract state to make child states use common view
 let products = {
    name: 'products',
    abstract: true, 
  }
 let productsList = {
    name: 'products.productslist',
    url: '/',
    component: 'productsearch',
    ncyBreadcrumb: {
      label: 'Products' // angular-breadcrumb's configuration
    }
  }
 let productState = {
    name: 'products.product', 
    url: '/:productId/', 
    component: 'product',
    resolve: {
      product: function($transition$) {
        'ngInject';
        return $transition$.params().productId;
      }
    },
    ncyBreadcrumb: {
      label: "{{ $resolve.product }} ",
      parent: 'products.productslist'
    }
  }
 let pricerState = {
    name: 'products.pricer', 
    url: '/:productId/pricer',
    component: 'pricer',
    resolve: {
      product: function($transition$) {
        'ngInject';
        return $transition$.params().productId;
      }
    },
    ncyBreadcrumb: {
      label: "pricer {{ $resolve.product }}",
      parent: 'products.product({productId: $resolve.product })'
    }
  }

  $stateProvider.state({ 
    name: 'error', 
    url: '/error', 
    params: { error: null, trans: null },
    component: 'error',
    resolve: {
      error: function( $transition$ ){
        'ngInject';
        return $transition$.params().error },
      trans: function( $transition$ ){
        'ngInject';
        return { from: $transition$.params().trans.$from().name, to: $transition$.params().trans.$to().name } }
    }
  });

  $stateProvider.state(about);
  $stateProvider.state(products);
  $stateProvider.state(productsList);
  $stateProvider.state(productState);
  $stateProvider.state(pricerState);
}


function run( $transitions, $rootScope ){
  'ngInject';
  $transitions.onStart({}, function( transition ) {
   let to = transition.to();
   let params = transition.params();
    console.log(" To, Params:", to, params  )
    if ( to.name == 'products.productslist' || to.name == 'about' ) $rootScope.atRoot = true;
    else $rootScope.atRoot = false;
  }); 
}

export { config, run }
