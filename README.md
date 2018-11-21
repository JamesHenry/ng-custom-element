<h1 align="center">ng-custom-element</h1>

<p align="center">Legacy AngularJS bindings to modern Custom Elements</p>

<p align="center">
    <a href="https://travis-ci.org/JamesHenry/ng-custom-element"><img src="https://img.shields.io/travis/JamesHenry/ng-custom-element.svg?style=flat-square" alt="Travis"/></a>
    <a href="https://github.com/JamesHenry/ng-custom-element/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/ng-custom-element.svg?style=flat-square" alt="GitHub license" /></a>
    <a href="https://www.npmjs.com/package/ng-custom-element"><img src="https://img.shields.io/npm/v/ng-custom-element.svg?style=flat-square" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/ng-custom-element"><img src="https://img.shields.io/npm/dt/ng-custom-element.svg?style=flat-square" alt="NPM Downloads" /></a>
    <a href="http://commitizen.github.io/cz-cli/"><img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg" alt="Commitizen friendly" /></a>
    <a href="https://github.com/semantic-release/semantic-release"><img src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square" alt="semantic-release" /></a>
</p>

<br>

## Background

Custom elements are great. Angular Elements is a great way of making custom elements from Angular code. Angular Elements is therefore also a great upgrade strategy for AngularJS apps looking to upgrade to Angular.

In AngularJS 1.7.3, some helpers were introduced for binding properties and events to custom elements from surrounding AngularJS code.

For example:

```js
angular.module('app', ['']).controller('ExampleController', function() {
  this.controllerProp = {
    somObj: 'val'
  };
  this.onClick = function clickHandler($event) {
    console.log('was clicked', $event);
  };
});
```

```html
<my-element ng-prop-my_prop="$ctrl.controllerProp" ng-on-click="$ctrl.onClick($event)"></my-element>
```

## ng-prop-\* and ng-on-\* are awesome, but not backwards compatible

The changes introduced to facilitate the helpers for ng-prop-\* and ng-on-\* are not backwards compatible. This library therefore exposes a custom directive called `ng-custom-element` which allows you to emulate how it works!

It has been tested in AngularJS versions as far back as 1.3, but it may even work in versions older than that.

Assuming the exact controller code from above, let's compare the HTML from the AngularJS 1.7.3+ helpers and this library:

**AngularJS 1.7.3+**

```html
<my-element ng-prop-my_prop="$ctrl.controllerProp" ng-on-click="$ctrl.onClick($event)"></my-element>
```

**ng-custom-element (AngularJS 1.3+)**

```html
<my-element ng-custom-element ngce-prop-my_prop="$ctrl.controllerProp" ngce-on-click="$ctrl.onClick($event)"></my-element>
```

Pretty sweet!

## Usage

1. Install the library and add its angular.module as a dependency of your own:

```js
angular.module('yourAwesomeApp', ['ngCustomElement']);
```

2. Apply the attribute directive `ng-custom-element` to any DOM element you want to bind properties or events to

```html
<my-element ng-custom-element></my-element>
```

3. Use `ngce-prop-*` to bind properties (**see the notes on casing below**) to the element:

```html
<my-element ng-custom-element ngce-prop-my_prop="someAngularJSControllerProp"></my-element>
```

4. Use `ngce-event-*` to bind events (**see the notes on casing below**) to the element:

```html
<my-element ng-custom-element ngce-on-click="someAngularJSControllerMethod($event)"></my-element>
```

## Notes on casing

We need to pay special attention to casing.

**From the ngProp docs**: https://docs.angularjs.org/api/ng/directive/ngProp

```
Since HTML attributes are case-insensitive, camelCase properties like innerHTML must be escaped. AngularJS uses the underscore (_) in front of a character to indicate that it is uppercase, so innerHTML must be written as ng-prop-inner_h_t_m_l="expression" (Note that this is just an example, and for binding HTML ngBindHtml should be used).
```

**From the ngOn docs**: https://docs.angularjs.org/api/ng/directive/ngOn

```
Since HTML attributes are case-insensitive, camelCase properties like myEvent must be escaped. AngularJS uses the underscore (_) in front of a character to indicate that it is uppercase, so myEvent must be written as ng-on-my_event="expression".
```
