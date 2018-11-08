import 'angular';
import 'angular-mocks';
import './index';

declare const angular: any;
declare const inject: any;
declare const window: any;

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
  // https://github.com/angular/angular.js/blob/4e372d93144b4dab7dcaa029fbbc5d7f3f1ceb8c/test/ng/ngPropSpec.js
  describe('ngceProp*', () => {
    const msie: number | undefined = window.document.documentMode;

    it('should bind boolean properties (input disabled)', inject((
      $rootScope: any,
      $compile: any
    ) => {
      var element = $compile(
        '<button ng-custom-element ngce-prop-disabled="isDisabled">Button</button>'
      )($rootScope);
      $rootScope.$digest();
      expect(element.prop('disabled')).toBe(false);
      $rootScope.isDisabled = true;
      $rootScope.$digest();
      expect(element.prop('disabled')).toBe(true);
      $rootScope.isDisabled = false;
      $rootScope.$digest();
      expect(element.prop('disabled')).toBe(false);
    }));

    it('should bind boolean properties (input checked)', inject((
      $rootScope: any,
      $compile: any
    ) => {
      var element = $compile(
        '<input type="checkbox" ng-custom-element ngce-prop-checked="isChecked" />'
      )($rootScope);
      expect(element.prop('checked')).toBe(false);
      $rootScope.isChecked = true;
      $rootScope.$digest();
      expect(element.prop('checked')).toBe(true);
      $rootScope.isChecked = false;
      $rootScope.$digest();
      expect(element.prop('checked')).toBe(false);
    }));

    it('should bind string properties (title)', inject((
      $rootScope: any,
      $compile: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-prop-title="title"></span>'
      )($rootScope);
      $rootScope.title = 123;
      $rootScope.$digest();
      expect(element.prop('title')).toBe('123');
      $rootScope.title = 'foobar';
      $rootScope.$digest();
      expect(element.prop('title')).toBe('foobar');
    }));

    it('should bind variable type properties', inject((
      $rootScope: any,
      $compile: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-prop-asdf="asdf"></span>'
      )($rootScope);
      $rootScope.asdf = 123;
      $rootScope.$digest();
      expect(element.prop('asdf')).toBe(123);
      $rootScope.asdf = 'foobar';
      $rootScope.$digest();
      expect(element.prop('asdf')).toBe('foobar');
      $rootScope.asdf = true;
      $rootScope.$digest();
      expect(element.prop('asdf')).toBe(true);
    }));

    it('should support mixed case using underscore-separated names', inject((
      $rootScope: any,
      $compile: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-prop-a_bcd_e="value"></span>'
      )($rootScope);
      $rootScope.value = 123;
      $rootScope.$digest();
      expect(element.prop('aBcdE')).toBe(123);
    }));

    it('should work with different prefixes', inject((
      $rootScope: any,
      $compile: any
    ) => {
      $rootScope.name = 'Misko';
      var element = $compile(
        '<span ng-custom-element ngce:prop:test="name" ngce-Prop-test2="name" ngce_Prop_test3="name"></span>'
      )($rootScope);
      expect(element.prop('test')).toBe('Misko');
      expect(element.prop('test2')).toBe('Misko');
      expect(element.prop('test3')).toBe('Misko');
    }));

    it('should work with the "href" property', inject((
      $rootScope: any,
      $compile: any
    ) => {
      $rootScope.value = 'test';
      var element = $compile(
        '<a ng-custom-element ngce-prop-href="\'test/\' + value"></a>'
      )($rootScope);
      $rootScope.$digest();
      expect(element.prop('href')).toMatch(/\/test\/test$/);
    }));

    it('should work if they are prefixed with x- or data- and different prefixes', inject((
      $rootScope: any,
      $compile: any
    ) => {
      $rootScope.name = 'Misko';
      var element = $compile(
        '<span ng-custom-element data-ngce-prop-test2="name" x-ngce-prop-test3="name" data-ngce:prop-test4="name" ' +
          'x_ngce-prop-test5="name" data:ngce-prop-test6="name"></span>'
      )($rootScope);
      expect(element.prop('test2')).toBe('Misko');
      expect(element.prop('test3')).toBe('Misko');
      expect(element.prop('test4')).toBe('Misko');
      expect(element.prop('test5')).toBe('Misko');
      expect(element.prop('test6')).toBe('Misko');
    }));

    it('should work independently of attributes with the same name', inject((
      $rootScope: any,
      $compile: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-prop-asdf="asdf" asdf="foo"></span>'
      )($rootScope);
      $rootScope.asdf = 123;
      $rootScope.$digest();
      expect(element.prop('asdf')).toBe(123);
      expect(element.attr('asdf')).toBe('foo');
    }));

    it('should work independently of (ng-)attributes with the same name', inject((
      $rootScope: any,
      $compile: any
    ) => {
      var element = $compile(
        '<span ng-custom-element ngce-prop-asdf="asdf" ng-attr-asdf="{{ \'foo\' }}"></span>'
      )($rootScope);
      $rootScope.asdf = 123;
      $rootScope.$digest();
      expect(element.prop('asdf')).toBe(123);
      expect(element.attr('asdf')).toBe('foo');
    }));

    it('should use the full ngce-prop-* attribute name in $attr mappings', () => {
      let attrs: any;
      angular.mock.module(($compileProvider: any) => {
        $compileProvider.directive('attrExposer', () => ({
          link: (_$scope: any, _$element: any, $attrs: any) => (attrs = $attrs)
        }));
      });
      inject(($compile: any, $rootScope: any) => {
        $compile(
          '<div attr-exposer ng-custom-element ngce-prop-title="12" ngce-prop-super-title="34" ngce-prop-my-camel_title="56"></div>'
        )($rootScope);

        expect(attrs.title).toBeUndefined();
        expect(attrs.$attr.title).toBeUndefined();
        expect(attrs.ngcePropTitle).toBe('12');
        expect(attrs.$attr.ngcePropTitle).toBe('ngce-prop-title');

        expect(attrs.superTitle).toBeUndefined();
        expect(attrs.$attr.superTitle).toBeUndefined();
        expect(attrs.ngcePropSuperTitle).toBe('34');
        expect(attrs.$attr.ngcePropSuperTitle).toBe('ngce-prop-super-title');

        expect(attrs.myCamelTitle).toBeUndefined();
        expect(attrs.$attr.myCamelTitle).toBeUndefined();
        expect(attrs.ngcePropMyCamelTitle).toBe('56');
        expect(attrs.$attr.ngcePropMyCamelTitle).toBe(
          'ngce-prop-my-camel_title'
        );
      });
    });

    it('should not conflict with (ng-attr-)attribute mappings of the same name', () => {
      let attrs: any;
      angular.mock.module(($compileProvider: any) => {
        $compileProvider.directive('attrExposer', () => ({
          link: (_$scope: any, _$element: any, $attrs: any) => (attrs = $attrs)
        }));
      });
      inject(($compile: any, $rootScope: any) => {
        $compile(
          '<div attr-exposer ng-custom-element ngce-prop-title="42" ng-attr-title="{{ \'foo\' }}" title="bar"></div>'
        )($rootScope);
        expect(attrs.title).toBe('foo');
        expect(attrs.$attr.title).toBe('title');
        expect(attrs.$attr.ngcePropTitle).toBe('ngce-prop-title');
      });
    });

    it('should disallow property binding to onclick', inject((
      $compile: any,
      $rootScope: any
    ) => {
      // All event prop bindings are disallowed.
      expect(() =>
        $compile(
          '<button ng-custom-element ngce-prop-onclick="onClickJs"></button>'
        )($rootScope)
      ).toThrowError(
        'Property bindings for HTML DOM event properties are disallowed.'
      );

      expect(() =>
        $compile(
          '<button ng-custom-element ngce-prop-ONCLICK="onClickJs"></button>'
        )($rootScope)
      ).toThrowError(
        'Property bindings for HTML DOM event properties are disallowed.'
      );
    }));

    it('should process property bindings in pre-linking phase at priority 100', function() {
      angular.mock.module(($compileProvider: any, $provide: any) => {
        $provide.factory('log', () => {
          const messages: string[] = [];
          const log = (msg: string) => messages.push(msg);
          log.toString = () => messages.join('; ');
          return log;
        });

        $compileProvider.directive('propLog', (log: any, $rootScope: any) => ({
          compile: ($element: any) => {
            log('compile=' + $element.prop('myName'));

            return {
              pre: (_$scope: any, $element: any) => {
                log('preLinkP0=' + $element.prop('myName'));
                $rootScope.name = 'pre0';
              },
              post: (_$scope: any, $element: any) => {
                log('postLink=' + $element.prop('myName'));
                $rootScope.name = 'post0';
              }
            };
          }
        }));

        $compileProvider.directive(
          'propLogHighPriority',
          (log: any, $rootScope: any) => ({
            priority: 101,
            link: {
              pre: (_$scope: any, $element: any) => {
                log('preLinkP101=' + $element.prop('myName'));
                $rootScope.name = 'pre101';
              }
            }
          })
        );
      });
      inject(($rootScope: any, $compile: any, log: any) => {
        var element = $compile(
          '<div prop-log-high-priority prop-log ng-custom-element ngce-prop-my_name="name"></div>'
        )($rootScope);
        $rootScope.name = 'angular';
        $rootScope.$digest();
        log('digest=' + element.prop('myName'));
        expect(log.toString()).toEqual(
          'compile=undefined; preLinkP101=undefined; preLinkP0=pre101; postLink=pre101; digest=angular'
        );
      });
    });

    it('should clean up watchers when the element is destroyed', inject((
      $compile: any,
      $rootScope: any
    ) => {
      var element = $compile(
        '<div><p><span ng-custom-element ngce-prop-test="name"></span></p></div>'
      )($rootScope);
      var p = element.find('p');

      $rootScope.$digest();
      expect($rootScope.$countWatchers()).toBe(1);

      p.remove();
      expect($rootScope.$countWatchers()).toBe(0);
    }));
  });

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
