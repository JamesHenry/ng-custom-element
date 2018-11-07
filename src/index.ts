import { directiveFactory, directiveSelector } from './directive';

/**
 * Register the global AngularJS module
 */
declare const angular: any;
export default angular
  .module('ngCustomElement', [])
  .directive(directiveSelector, directiveFactory).name;
