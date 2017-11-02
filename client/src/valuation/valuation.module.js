// load common css
import '../assets/css/layout.scss';
import 'normalize.css';

// load page specific css
import '../assets/css/valuation.scss'

// load required vendor js
import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import 'angular-ui-bootstrap';
import '../assets/js/angular-breadcrumb.min.js';

// load page specific js
console.log('in valuation.js');

import { config, run } from "./valuation.config.js"
import Constants from "./valuation.constants.js"
import "./components/"
import "./pricer/"
//import pricerCtrl from "./components/pricer.controller.js"
//import "./utils/index.js"

export default angular.module('valuation', [
        'ui.router','ui.bootstrap', 'ncy-angular-breadcrumb', 'valuation.components', 'valuation.pricer'
        ])
        .constant( 'Constants', Constants )
        .config( config )
        .run( run );
