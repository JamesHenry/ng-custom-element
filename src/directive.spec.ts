import 'angular';
import 'angular-mocks';
import './index';

declare const angular: any;
declare const inject: any;

describe('ngCustomElement directive', () => {
  beforeEach(angular.mock.module('ngCustomElement'));

  it('should forward property bindings on to the element', inject((
    $compile: any,
    $rootScope: any
  ) => {
    const $scope = $rootScope.$new();

    const node = $compile(`
      <p ng-custom-element ngce-prop-prop1="somePropConfig.prop1" ngce-prop-prop2="somePropConfig.prop2">content</p>
    `)($scope);

    $scope.$apply(`somePropConfig = { prop1: "val", prop2: "val2" }`);

    expect(node[0].prop1).toEqual('val');
    expect(node[0].prop2).toEqual('val2');

    node.remove();
  }));

  it('should convert property bindings with underscores into camelCase properties on to the element', inject((
    $compile: any,
    $rootScope: any
  ) => {
    const $scope = $rootScope.$new();

    const node = $compile(`
      <p ng-custom-element ngce-prop-different_casing="somePropConfig.prop3">content</p>
    `)($scope);

    $scope.$apply(`somePropConfig = { prop3: "val3" }`);

    expect(node[0].differentCasing).toEqual('val3');

    node.remove();
  }));

  it('should forward event bindings on to the element', inject((
    $compile: any,
    $rootScope: any
  ) => {
    const $scope = $rootScope.$new();

    $scope.clickCount = 0;
    $scope.someEventConfig = {
      onClick: function(_$event: any) {
        $scope.clickCount++;
      }
    };

    const node = $compile(`
      <button ng-custom-element ngce-on-click="someEventConfig.onClick($event)">content</button>
    `)($scope);

    expect($scope.clickCount).toEqual(0);
    node[0].click();
    expect($scope.clickCount).toEqual(1);

    node.remove();
  }));

  // Tests adapted from:
  // https://github.com/angular/angular.js/blob/4e372d93144b4dab7dcaa029fbbc5d7f3f1ceb8c/test/ng/ngOnSpec.js
  describe('ngceOn*', () => {
    it('should add event listener of specified name', inject((
      $compile: any,
      $rootScope: any
    ) => {
      $rootScope.name = 'Misko';
      var element = $compile(
        '<span ng-custom-element ngce-on-foo="name = name + 3"></span>'
      )($rootScope);
      element.triggerHandler('foo');
      expect($rootScope.name).toBe('Misko3');
    }));

    it('should use angular.element(x).on() API to add listener', inject((
      $compile: any,
      $rootScope: any
    ) => {
      spyOn(angular.element.prototype, 'on');
      $compile('<span ng-custom-element ngce-on-foo="name = name + 3"></span>')(
        $rootScope
      );

      expect(angular.element.prototype.on).toHaveBeenCalledWith(
        'foo',
        jasmine.any(Function)
      );
    }));

    it('should allow access to the $event object', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-foo="e = $event"></span>'
      )($rootScope);
      element.triggerHandler('foo');

      expect($rootScope.e.target).toBe(element[0]);
    }));

    it('should call the listener synchronously', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-foo="fooEvent()"></span>'
      )($rootScope);
      $rootScope.fooEvent = jasmine.createSpy('fooEvent');

      element.triggerHandler('foo');

      expect($rootScope.fooEvent).toHaveBeenCalledTimes(1);
    }));

    it('should support multiple events on a single element', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-foo="fooEvent()" ngce-on-bar="barEvent()"></span>'
      )($rootScope);
      $rootScope.fooEvent = jasmine.createSpy('fooEvent');
      $rootScope.barEvent = jasmine.createSpy('barEvent');

      element.triggerHandler('foo');
      expect($rootScope.fooEvent).toHaveBeenCalled();
      expect($rootScope.barEvent).not.toHaveBeenCalled();

      $rootScope.fooEvent.calls.reset();
      $rootScope.barEvent.calls.reset();

      element.triggerHandler('bar');
      expect($rootScope.fooEvent).not.toHaveBeenCalled();
      expect($rootScope.barEvent).toHaveBeenCalled();
    }));

    it('should work with different prefixes', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var cb = ($rootScope.cb = jasmine.createSpy('ngce-on cb'));
      var element = $compile(
        '<span ng-custom-element ngce:on:test="cb(1)" ngce-On-test2="cb(2)" ngce_On_test3="cb(3)"></span>'
      )($rootScope);

      element.triggerHandler('test');
      expect(cb).toHaveBeenCalledWith(1);

      element.triggerHandler('test2');
      expect(cb).toHaveBeenCalledWith(2);

      element.triggerHandler('test3');
      expect(cb).toHaveBeenCalledWith(3);
    }));

    it('should work if they are prefixed with x- or data- and different prefixes', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var cb = ($rootScope.cb = jasmine.createSpy('ngce-on cb'));
      var element = $compile(
        '<span ng-custom-element data-ngce-on-test2="cb(2)" x-ngce-on-test3="cb(3)" data-ngce:on-test4="cb(4)" ' +
          'x_ngce-on-test5="cb(5)" data:ngce-on-test6="cb(6)"></span>'
      )($rootScope);

      element.triggerHandler('test2');
      expect(cb).toHaveBeenCalledWith(2);

      element.triggerHandler('test3');
      expect(cb).toHaveBeenCalledWith(3);

      element.triggerHandler('test4');
      expect(cb).toHaveBeenCalledWith(4);

      element.triggerHandler('test5');
      expect(cb).toHaveBeenCalledWith(5);

      element.triggerHandler('test6');
      expect(cb).toHaveBeenCalledWith(6);
    }));

    it('should work independently of attributes with the same name', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-asdf="cb()" asdf="foo"></span>'
      )($rootScope);
      var cb = ($rootScope.cb = jasmine.createSpy('ngce-on cb'));
      $rootScope.$digest();
      element.triggerHandler('asdf');
      expect(cb).toHaveBeenCalled();
      expect(element.attr('asdf')).toBe('foo');
    }));

    it('should work independently of (ng-)attributes with the same name', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-asdf="cb()" ng-attr-asdf="{{ \'foo\' }}"></span>'
      )($rootScope);
      var cb = ($rootScope.cb = jasmine.createSpy('ngce-on cb'));
      $rootScope.$digest();
      element.triggerHandler('asdf');
      expect(cb).toHaveBeenCalled();
      expect(element.attr('asdf')).toBe('foo');
    }));

    it('should work independently of properties with the same name', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-asdf="cb()" ngce-prop-asdf="123"></span>'
      )($rootScope);
      var cb = ($rootScope.cb = jasmine.createSpy('ngce-on cb'));
      $rootScope.$digest();
      element.triggerHandler('asdf');
      expect(cb).toHaveBeenCalled();
      expect(element.prop('asdf')).toBe(123);
    }));

    it('should use the full ngce-on-* attribute name in $attr mappings', () => {
      let attrs: any;
      angular.mock.module(($compileProvider: any) => {
        $compileProvider.directive('attrExposer', () => ({
          link: ($scope: any, $element: any, $attrs: any) => (attrs = $attrs)
        }));
      });
      inject(($compile: any, $rootScope: any) => {
        $compile(
          '<div attr-exposer ngce-on-title="cb(1)" ngce-on-super-title="cb(2)" ngce-on-my-camel_title="cb(3)"></div>'
        )($rootScope);

        expect(attrs.title).toBeUndefined();
        expect(attrs.$attr.title).toBeUndefined();
        expect(attrs.ngceOnTitle).toBe('cb(1)');
        expect(attrs.$attr.ngceOnTitle).toBe('ngce-on-title');

        expect(attrs.superTitle).toBeUndefined();
        expect(attrs.$attr.superTitle).toBeUndefined();
        expect(attrs.ngceOnSuperTitle).toBe('cb(2)');
        expect(attrs.$attr.ngceOnSuperTitle).toBe('ngce-on-super-title');

        expect(attrs.myCamelTitle).toBeUndefined();
        expect(attrs.$attr.myCamelTitle).toBeUndefined();
        expect(attrs.ngceOnMyCamelTitle).toBe('cb(3)');
        expect(attrs.$attr.ngceOnMyCamelTitle).toBe('ngce-on-my-camel_title');
      });
    });

    it('should not conflict with (ng-attr-)attribute mappings of the same name', () => {
      let attrs: any;
      angular.mock.module(($compileProvider: any) => {
        $compileProvider.directive('attrExposer', () => ({
          link: ($scope: any, $element: any, $attrs: any) => (attrs = $attrs)
        }));
      });
      inject(($compile: any, $rootScope: any) => {
        $compile(
          '<div attr-exposer ngce-on-title="42" ng-attr-title="foo" title="bar"></div>'
        )($rootScope);
        expect(attrs.title).toBe('foo');
        expect(attrs.$attr.title).toBe('title');
        expect(attrs.$attr.ngceOnTitle).toBe('ngce-on-title');
      });
    });

    it('should correctly bind to kebab-cased events', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-foo-bar="cb()"></span>'
      )($rootScope);
      var cb = ($rootScope.cb = jasmine.createSpy('ngce-on cb'));
      $rootScope.$digest();

      element.triggerHandler('foobar');
      element.triggerHandler('fooBar');
      element.triggerHandler('foo_bar');
      element.triggerHandler('foo:bar');
      expect(cb).not.toHaveBeenCalled();

      element.triggerHandler('foo-bar');
      expect(cb).toHaveBeenCalled();
    }));

    it('should correctly bind to camelCased events', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-on-foo_bar="cb()"></span>'
      )($rootScope);
      var cb = ($rootScope.cb = jasmine.createSpy('ngce-on cb'));
      $rootScope.$digest();

      element.triggerHandler('foobar');
      element.triggerHandler('foo-bar');
      element.triggerHandler('foo_bar');
      element.triggerHandler('foo:bar');
      expect(cb).not.toHaveBeenCalled();

      element.triggerHandler('fooBar');
      expect(cb).toHaveBeenCalled();
    }));
  });
});
