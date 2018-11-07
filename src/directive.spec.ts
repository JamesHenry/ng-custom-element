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
  // https://github.com/angular/angular.js/blob/4e372d93144b4dab7dcaa029fbbc5d7f3f1ceb8c/test/ng/ngPropSpec.js
  describe('ngceProp*', () => {
    var msie: any;
    var window: any;

    function valueFn(value: any) {
      return function valueRef() {
        return value;
      };
    }

    function provideLog($provide: any) {
      $provide.factory('log', function() {
        var messages: any = [];

        function log(msg: any) {
          messages.push(msg);
          return msg;
        }

        log.toString = function() {
          return messages.join('; ');
        };

        log.toArray = function() {
          return messages;
        };

        log.reset = function() {
          messages = [];
        };

        log.empty = function() {
          var currentMessages = messages;
          messages = [];
          return currentMessages;
        };

        log.fn = function(msg: any) {
          return function() {
            log(msg);
          };
        };

        log.$$log = true;

        return log;
      });
    }

    describe('ngCustomElement directive: ngce-prop-*', function() {
      beforeEach(angular.mock.module('ngCustomElement'));

      it('should bind boolean properties (input disabled)', inject(function(
        $rootScope: any,
        $compile: any
      ) {
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

      it('should bind boolean properties (input checked)', inject(function(
        $rootScope: any,
        $compile: any
      ) {
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

      it('should bind string properties (title)', inject(function(
        $rootScope: any,
        $compile: any
      ) {
        var element = $compile(
          '<span ng-custom-element ngce-prop-title="title" />'
        )($rootScope);
        $rootScope.title = 123;
        $rootScope.$digest();
        expect(element.prop('title')).toBe('123');
        $rootScope.title = 'foobar';
        $rootScope.$digest();
        expect(element.prop('title')).toBe('foobar');
      }));

      it('should bind variable type properties', inject(function(
        $rootScope: any,
        $compile: any
      ) {
        var element = $compile(
          '<span ng-custom-element ngce-prop-asdf="asdf" />'
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

      it('should support mixed case using underscore-separated names', inject(function(
        $rootScope: any,
        $compile: any
      ) {
        var element = $compile(
          '<span ng-custom-element ngce-prop-a_bcd_e="value" />'
        )($rootScope);
        $rootScope.value = 123;
        $rootScope.$digest();
        expect(element.prop('aBcdE')).toBe(123);
      }));

      it('should work with different prefixes', inject(function(
        $rootScope: any,
        $compile: any
      ) {
        $rootScope.name = 'Misko';
        var element = $compile(
          '<span ng-custom-element ngce:prop:test="name" ngce-Prop-test2="name" ngce_Prop_test3="name"></span>'
        )($rootScope);
        expect(element.prop('test')).toBe('Misko');
        expect(element.prop('test2')).toBe('Misko');
        expect(element.prop('test3')).toBe('Misko');
      }));

      it('should work with the "href" property', inject(function(
        $rootScope: any,
        $compile: any
      ) {
        $rootScope.value = 'test';
        var element = $compile(
          '<a ng-custom-element ngce-prop-href="\'test/\' + value"></a>'
        )($rootScope);
        $rootScope.$digest();
        expect(element.prop('href')).toMatch(/\/test\/test$/);
      }));

      it('should work if they are prefixed with x- or data- and different prefixes', inject(function(
        $rootScope: any,
        $compile: any
      ) {
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

      it('should work independently of attributes with the same name', inject(function(
        $rootScope: any,
        $compile: any
      ) {
        var element = $compile(
          '<span ng-custom-element ngce-prop-asdf="asdf" asdf="foo" />'
        )($rootScope);
        $rootScope.asdf = 123;
        $rootScope.$digest();
        expect(element.prop('asdf')).toBe(123);
        expect(element.attr('asdf')).toBe('foo');
      }));

      xit('should work independently of (ng-)attributes with the same name', inject(function(
        $rootScope: any,
        $compile: any
      ) {
        var element = $compile(
          '<span ng-custom-element ngce-prop-asdf="asdf" ng-attr-asdf="foo" />'
        )($rootScope);
        $rootScope.asdf = 123;
        $rootScope.$digest();
        expect(element.prop('asdf')).toBe(123);
        expect(element.attr('asdf')).toBe('foo');
      }));

      it('should use the full ngce-prop-* attribute name in $attr mappings', function() {
        var attrs: any;
        angular.mock.module(function($compileProvider: any) {
          $compileProvider.directive(
            'attrExposer',
            valueFn({
              link: function(_$scope: any, _$element: any, $attrs: any) {
                attrs = $attrs;
              }
            })
          );
        });
        inject(function($compile: any, $rootScope: any) {
          $compile(
            '<div attr-exposer ng-custom-element ngce-prop-title="12" ngce-prop-super-title="34" ngce-prop-my-camel_title="56">'
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

      xit('should not conflict with (ng-attr-)attribute mappings of the same name', function() {
        var attrs: any;
        angular.mock.module(function($compileProvider: any) {
          $compileProvider.directive(
            'attrExposer',
            valueFn({
              link: function(_$scope: any, _$element: any, $attrs: any) {
                attrs = $attrs;
              }
            })
          );
        });
        inject(function($compile: any, $rootScope: any) {
          $compile(
            '<div attr-exposer ng-custom-element ngce-prop-title="42" ngce-attr-title="foo" title="bar">'
          )($rootScope);
          expect(attrs.title).toBe('foo');
          expect(attrs.$attr.title).toBe('title');
          expect(attrs.$attr.ngcePropTitle).toBe('ngce-prop-title');
        });
      });

      xit('should disallow property binding to onclick', inject(function(
        $compile: any,
        $rootScope: any
      ) {
        // All event prop bindings are disallowed.
        expect(function() {
          $compile(
            '<button ng-custom-element ngce-prop-onclick="onClickJs"></script>'
          );
        }).toThrowErrorMatchingInlineSnapshot();
        // .toThrowMinErr(
        //   '$compile',
        //   'nodomevents',
        //   'Property bindings for HTML DOM event properties are disallowed'
        // );
        expect(function() {
          $compile(
            '<button ng-custom-element ngce-prop-ONCLICK="onClickJs"></script>'
          );
        }).toThrowErrorMatchingInlineSnapshot();
        // .toThrowMinErr(
        //   '$compile',
        //   'nodomevents',
        //   'Property bindings for HTML DOM event properties are disallowed'
        // );
      }));

      xit('should process property bindings in pre-linking phase at priority 100', function() {
        angular.mock.module(provideLog);
        angular.mock.module(function($compileProvider: any) {
          $compileProvider.directive('propLog', function(
            log: any,
            $rootScope: any
          ) {
            return {
              compile: function($element: any, $attrs: any) {
                log('compile=' + $element.prop('myName'));

                return {
                  pre: function($scope: any, $element: any, $attrs: any) {
                    log('preLinkP0=' + $element.prop('myName'));
                    $rootScope.name = 'pre0';
                  },
                  post: function($scope: any, $element: any, $attrs: any) {
                    log('postLink=' + $element.prop('myName'));
                    $rootScope.name = 'post0';
                  }
                };
              }
            };
          });
        });
        angular.mock.module(function($compileProvider: any) {
          $compileProvider.directive('propLogHighPriority', function(
            log: any,
            $rootScope: any
          ) {
            return {
              priority: 101,
              compile: function() {
                return {
                  pre: function($scope: any, $element: any, $attrs: any) {
                    log('preLinkP101=' + $element.prop('myName'));
                    $rootScope.name = 'pre101';
                  }
                };
              }
            };
          });
        });
        inject(function($rootScope: any, $compile: any, log: any) {
          var element = $compile(
            '<div prop-log-high-priority prop-log ng-custom-element ngce-prop-my_name="name"></div>'
          )($rootScope);
          $rootScope.name = 'angular';
          $rootScope.$apply();
          log('digest=' + element.prop('myName'));
          expect(log).toEqual(
            'compile=undefined; preLinkP101=undefined; preLinkP0=pre101; postLink=pre101; digest=angular'
          );
        });
      });

      ['img', 'audio', 'video'].forEach(function(tag) {
        // Support: IE 9 only
        // IE9 rejects the `video` / `audio` tags with "Error: Not implemented"
        if (msie !== 9 || tag === 'img') {
          describe(tag + '[src] context requirement', function() {
            it('should NOT require trusted values for whitelisted URIs', inject(function(
              $rootScope: any,
              $compile: any
            ) {
              var element = $compile(
                '<' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '>'
              )($rootScope);
              $rootScope.testUrl = 'http://example.com/image.mp4'; // `http` is whitelisted
              $rootScope.$digest();
              expect(element.prop('src')).toEqual(
                'http://example.com/image.mp4'
              );
            }));

            xit('should accept trusted values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              // As a MEDIA_URL URL
              var element = $compile(
                '<' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '>'
              )($rootScope);
              // Some browsers complain if you try to write `javascript:` into an `img[src]`
              // So for the test use something different
              $rootScope.testUrl = $sce.trustAsMediaUrl('untrusted:foo()');
              $rootScope.$digest();
              expect(element.prop('src')).toEqual('untrusted:foo()');

              // As a URL
              element = $compile(
                '<' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsUrl('untrusted:foo()');
              $rootScope.$digest();
              expect(element.prop('src')).toEqual('untrusted:foo()');

              // As a RESOURCE URL
              element = $compile(
                '<' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsResourceUrl('untrusted:foo()');
              $rootScope.$digest();
              expect(element.prop('src')).toEqual('untrusted:foo()');
            }));

            xit('should sanitize non-whitelisted values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              // As a MEDIA_URL URL
              var element = $compile(
                '<' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '>'
              )($rootScope);
              // Some browsers complain if you try to write `javascript:` into an `img[src]`
              // So for the test use something different
              $rootScope.testUrl = 'untrusted:foo()';
              $rootScope.$digest();
              expect(element.prop('src')).toEqual('unsafe:untrusted:foo()');
            }));

            xit('should sanitize wrongly typed values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              // As a MEDIA_URL URL
              var element = $compile(
                '<' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '>'
              )($rootScope);
              // Some browsers complain if you try to write `javascript:` into an `img[src]`
              // So for the test use something different
              $rootScope.testUrl = $sce.trustAsCss('untrusted:foo()');
              $rootScope.$digest();
              expect(element.prop('src')).toEqual('unsafe:untrusted:foo()');
            }));
          });
        }
      });

      // Support: IE 9 only
      // IE 9 rejects the `source` / `track` tags with
      // "Unable to get value of the property 'childNodes': object is null or undefined"
      if (msie !== 9) {
        ['source', 'track'].forEach(function(tag) {
          describe(tag + '[src]', function() {
            it('should NOT require trusted values for whitelisted URIs', inject(function(
              $rootScope: any,
              $compile: any
            ) {
              var element = $compile(
                '<video><' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '></video>'
              )($rootScope);
              $rootScope.testUrl = 'http://example.com/image.mp4'; // `http` is whitelisted
              $rootScope.$digest();
              expect(element.find(tag).prop('src')).toEqual(
                'http://example.com/image.mp4'
              );
            }));

            xit('should accept trusted values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              // As a MEDIA_URL URL
              var element = $compile(
                '<video><' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '></video>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsMediaUrl('javascript:foo()');
              $rootScope.$digest();
              expect(element.find(tag).prop('src')).toEqual('javascript:foo()');

              // As a URL
              element = $compile(
                '<video><' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '></video>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsUrl('javascript:foo()');
              $rootScope.$digest();
              expect(element.find(tag).prop('src')).toEqual('javascript:foo()');

              // As a RESOURCE URL
              element = $compile(
                '<video><' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '></video>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsResourceUrl('javascript:foo()');
              $rootScope.$digest();
              expect(element.find(tag).prop('src')).toEqual('javascript:foo()');
            }));

            xit('should sanitize non-whitelisted values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              var element = $compile(
                '<video><' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '></video>'
              )($rootScope);
              $rootScope.testUrl = 'untrusted:foo()';
              $rootScope.$digest();
              expect(element.find(tag).prop('src')).toEqual(
                'unsafe:untrusted:foo()'
              );
            }));

            xit('should sanitize wrongly typed values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              var element = $compile(
                '<video><' +
                  tag +
                  ' ng-custom-element ngce-prop-src="testUrl"></' +
                  tag +
                  '></video>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsCss('untrusted:foo()');
              $rootScope.$digest();
              expect(element.find(tag).prop('src')).toEqual(
                'unsafe:untrusted:foo()'
              );
            }));
          });
        });
      }

      xdescribe('img[src] sanitization', function() {
        it('should accept trusted values', inject(function(
          $rootScope: any,
          $compile: any,
          $sce: any
        ) {
          var element = $compile(
            '<img ng-custom-element ngce-prop-src="testUrl"></img>'
          )($rootScope);
          // Some browsers complain if you try to write `javascript:` into an `img[src]`
          // So for the test use something different
          $rootScope.testUrl = $sce.trustAsMediaUrl(
            'someuntrustedthing:foo();'
          );
          $rootScope.$digest();
          expect(element.prop('src')).toEqual('someuntrustedthing:foo();');
        }));

        it('should use $$sanitizeUri', function() {
          var $$sanitizeUri = jasmine
            .createSpy('$$sanitizeUri')
            .and.returnValue('someSanitizedUrl');
          angular.mock.module(function($provide: any) {
            $provide.value('$$sanitizeUri', $$sanitizeUri);
          });
          inject(function($compile: any, $rootScope: any) {
            var element = $compile('<img ng-prop-src="testUrl"></img>')(
              $rootScope
            );
            $rootScope.testUrl = 'someUrl';

            $rootScope.$apply();
            expect(element.prop('src')).toMatch(
              /^http:\/\/.*\/someSanitizedUrl$/
            );
            expect($$sanitizeUri).toHaveBeenCalledWith(
              $rootScope.testUrl,
              true
            );
          });
        });

        it('should not use $$sanitizeUri with trusted values', function() {
          var $$sanitizeUri = jasmine
            .createSpy('$$sanitizeUri')
            .and.throwError('Should not have been called');
          angular.mock.module(function($provide: any) {
            $provide.value('$$sanitizeUri', $$sanitizeUri);
          });
          inject(function($compile: any, $rootScope: any, $sce: any) {
            var element = $compile('<img ng-prop-src="testUrl"></img>')(
              $rootScope
            );
            // Assigning javascript:foo to src makes at least IE9-11 complain, so use another
            // protocol name.
            $rootScope.testUrl = $sce.trustAsMediaUrl('untrusted:foo();');
            $rootScope.$apply();
            expect(element.prop('src')).toBe('untrusted:foo();');
          });
        });
      });

      ['img', 'source'].forEach(function(srcsetElement) {
        // Support: IE 9 only
        // IE9 ignores source[srcset] property assignments
        if (msie !== 9 || srcsetElement === 'img') {
          xdescribe(srcsetElement + '[srcset] sanitization', function() {
            it('should not error if srcset is blank', inject(function(
              $compile: any,
              $rootScope: any
            ) {
              var element = $compile(
                '<' +
                  srcsetElement +
                  ' ng-prop-srcset="testUrl"></' +
                  srcsetElement +
                  '>'
              )($rootScope);
              // Set srcset to a value
              $rootScope.testUrl = 'http://example.com/';
              $rootScope.$digest();
              expect(element.prop('srcset')).toBe('http://example.com/');

              // Now set it to blank
              $rootScope.testUrl = '';
              $rootScope.$digest();
              expect(element.prop('srcset')).toBe('');
            }));

            it('should NOT require trusted values for whitelisted values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              var element = $compile(
                '<' +
                  srcsetElement +
                  ' ng-prop-srcset="testUrl"></' +
                  srcsetElement +
                  '>'
              )($rootScope);
              $rootScope.testUrl = 'http://example.com/image.png'; // `http` is whitelisted
              $rootScope.$digest();
              expect(element.prop('srcset')).toEqual(
                'http://example.com/image.png'
              );
            }));

            it('should accept trusted values, if they are also whitelisted', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              var element = $compile(
                '<' +
                  srcsetElement +
                  ' ng-prop-srcset="testUrl"></' +
                  srcsetElement +
                  '>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsUrl('http://example.com');
              $rootScope.$digest();
              expect(element.prop('srcset')).toEqual('http://example.com');
            }));

            it('should NOT work with trusted values', inject(function(
              $rootScope: any,
              $compile: any,
              $sce: any
            ) {
              // A limitation of the approach used for srcset is that you cannot use `trustAsUrl`.
              // Use trustAsHtml and ng-bind-html to work around this.
              var element = $compile(
                '<' +
                  srcsetElement +
                  ' ng-prop-srcset="testUrl"></' +
                  srcsetElement +
                  '>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsUrl('javascript:something');
              $rootScope.$digest();
              expect(element.prop('srcset')).toEqual(
                'unsafe:javascript:something'
              );

              element = $compile(
                '<' +
                  srcsetElement +
                  ' ng-prop-srcset="testUrl + \',\' + testUrl"></' +
                  srcsetElement +
                  '>'
              )($rootScope);
              $rootScope.testUrl = $sce.trustAsUrl('javascript:something');
              $rootScope.$digest();
              expect(element.prop('srcset')).toEqual(
                'unsafe:javascript:something ,unsafe:javascript:something'
              );
            }));

            it('should use $$sanitizeUri', function() {
              var $$sanitizeUri = jasmine
                .createSpy('$$sanitizeUri')
                .and.returnValue('someSanitizedUrl');
              angular.mock.module(function($provide: any) {
                $provide.value('$$sanitizeUri', $$sanitizeUri);
              });
              inject(function($compile: any, $rootScope: any) {
                var element = $compile(
                  '<' +
                    srcsetElement +
                    ' ng-prop-srcset="testUrl"></' +
                    srcsetElement +
                    '>'
                )($rootScope);
                $rootScope.testUrl = 'someUrl';
                $rootScope.$apply();
                expect(element.prop('srcset')).toBe('someSanitizedUrl');
                expect($$sanitizeUri).toHaveBeenCalledWith(
                  $rootScope.testUrl,
                  true
                );

                element = $compile(
                  '<' +
                    srcsetElement +
                    ' ng-prop-srcset="testUrl + \',\' + testUrl"></' +
                    srcsetElement +
                    '>'
                )($rootScope);
                $rootScope.testUrl = 'javascript:yay';
                $rootScope.$apply();
                expect(element.prop('srcset')).toEqual(
                  'someSanitizedUrl ,someSanitizedUrl'
                );

                element = $compile(
                  '<' +
                    srcsetElement +
                    ' ng-prop-srcset="\'java\' + testUrl"></' +
                    srcsetElement +
                    '>'
                )($rootScope);
                $rootScope.testUrl = 'script:yay, javascript:nay';
                $rootScope.$apply();
                expect(element.prop('srcset')).toEqual(
                  'someSanitizedUrl ,someSanitizedUrl'
                );
              });
            });

            it('should sanitize all uris in srcset', inject(function(
              $rootScope: any,
              $compile: any
            ) {
              var element = $compile(
                '<' +
                  srcsetElement +
                  ' ng-prop-srcset="testUrl"></' +
                  srcsetElement +
                  '>'
              )($rootScope);
              var testSet = {
                'http://example.com/image.png': 'http://example.com/image.png',
                ' http://example.com/image.png': 'http://example.com/image.png',
                'http://example.com/image.png ': 'http://example.com/image.png',
                'http://example.com/image.png 128w':
                  'http://example.com/image.png 128w',
                'http://example.com/image.png 2x':
                  'http://example.com/image.png 2x',
                'http://example.com/image.png 1.5x':
                  'http://example.com/image.png 1.5x',
                'http://example.com/image1.png 1x,http://example.com/image2.png 2x':
                  'http://example.com/image1.png 1x,http://example.com/image2.png 2x',
                'http://example.com/image1.png 1x ,http://example.com/image2.png 2x':
                  'http://example.com/image1.png 1x ,http://example.com/image2.png 2x',
                'http://example.com/image1.png 1x, http://example.com/image2.png 2x':
                  'http://example.com/image1.png 1x,http://example.com/image2.png 2x',
                'http://example.com/image1.png 1x , http://example.com/image2.png 2x':
                  'http://example.com/image1.png 1x ,http://example.com/image2.png 2x',
                'http://example.com/image1.png 48w,http://example.com/image2.png 64w':
                  'http://example.com/image1.png 48w,http://example.com/image2.png 64w',
                //Test regex to make sure doesn't mistake parts of url for width descriptors
                'http://example.com/image1.png?w=48w,http://example.com/image2.png 64w':
                  'http://example.com/image1.png?w=48w,http://example.com/image2.png 64w',
                'http://example.com/image1.png 1x,http://example.com/image2.png 64w':
                  'http://example.com/image1.png 1x,http://example.com/image2.png 64w',
                'http://example.com/image1.png,http://example.com/image2.png':
                  'http://example.com/image1.png ,http://example.com/image2.png',
                'http://example.com/image1.png ,http://example.com/image2.png':
                  'http://example.com/image1.png ,http://example.com/image2.png',
                'http://example.com/image1.png, http://example.com/image2.png':
                  'http://example.com/image1.png ,http://example.com/image2.png',
                'http://example.com/image1.png , http://example.com/image2.png':
                  'http://example.com/image1.png ,http://example.com/image2.png',
                'http://example.com/image1.png 1x, http://example.com/image2.png 2x, http://example.com/image3.png 3x':
                  'http://example.com/image1.png 1x,http://example.com/image2.png 2x,http://example.com/image3.png 3x',
                'javascript:doEvilStuff() 2x':
                  'unsafe:javascript:doEvilStuff() 2x',
                'http://example.com/image1.png 1x,javascript:doEvilStuff() 2x':
                  'http://example.com/image1.png 1x,unsafe:javascript:doEvilStuff() 2x',
                'http://example.com/image1.jpg?x=a,b 1x,http://example.com/ima,ge2.jpg 2x':
                  'http://example.com/image1.jpg?x=a,b 1x,http://example.com/ima,ge2.jpg 2x',
                //Test regex to make sure doesn't mistake parts of url for pixel density descriptors
                'http://example.com/image1.jpg?x=a2x,b 1x,http://example.com/ima,ge2.jpg 2x':
                  'http://example.com/image1.jpg?x=a2x,b 1x,http://example.com/ima,ge2.jpg 2x'
              };

              //   forEach(testSet, function(ref, url) {
              //     $rootScope.testUrl = url;
              //     $rootScope.$digest();
              //     expect(element.prop('srcset')).toEqual(ref);
              //   });
            }));
          });
        }
      });

      describe('a[href] sanitization', function() {
        it('should NOT require trusted values for whitelisted values', inject(function(
          $rootScope: any,
          $compile: any
        ) {
          $rootScope.testUrl = 'http://example.com/image.png'; // `http` is whitelisted
          var element = $compile(
            '<a ng-custom-element ngce-prop-href="testUrl"></a>'
          )($rootScope);
          $rootScope.$digest();
          expect(element.prop('href')).toEqual('http://example.com/image.png');

          element = $compile(
            '<a ng-custom-element ngce-prop-href="testUrl"></a>'
          )($rootScope);
          $rootScope.$digest();
          expect(element.prop('href')).toEqual('http://example.com/image.png');
        }));

        it('should accept trusted values for non-whitelisted values', inject(function(
          $rootScope: any,
          $compile: any,
          $sce: any
        ) {
          $rootScope.testUrl = $sce.trustAsUrl('javascript:foo()'); // `javascript` is not whitelisted
          var element = $compile(
            '<a ng-custom-element ngce-prop-href="testUrl"></a>'
          )($rootScope);
          $rootScope.$digest();
          expect(element.prop('href')).toEqual('javascript:foo()');

          element = $compile(
            '<a ng-custom-element ngce-prop-href="testUrl"></a>'
          )($rootScope);
          $rootScope.$digest();
          expect(element.prop('href')).toEqual('javascript:foo()');
        }));

        xit('should sanitize non-whitelisted values', inject(function(
          $rootScope: any,
          $compile: any
        ) {
          $rootScope.testUrl = 'javascript:foo()'; // `javascript` is not whitelisted
          var element = $compile(
            '<a ng-custom-element ngce-prop-href="testUrl"></a>'
          )($rootScope);
          $rootScope.$digest();
          expect(element.prop('href')).toEqual('unsafe:javascript:foo()');

          element = $compile(
            '<a ng-custom-element ngce-prop-href="testUrl"></a>'
          )($rootScope);
          $rootScope.$digest();
          expect(element.prop('href')).toEqual('unsafe:javascript:foo()');
        }));

        it('should not sanitize href on elements other than anchor', inject(function(
          $compile: any,
          $rootScope: any
        ) {
          var element = $compile(
            '<div ng-custom-element ngce-prop-href="testUrl"></div>'
          )($rootScope);
          $rootScope.testUrl = 'javascript:doEvilStuff()';
          $rootScope.$apply();

          expect(element.prop('href')).toBe('javascript:doEvilStuff()');
        }));

        it('should not sanitize properties other then those configured', inject(function(
          $compile: any,
          $rootScope: any
        ) {
          var element = $compile(
            '<a ng-custom-element ngce-prop-title="testUrl"></a>'
          )($rootScope);
          $rootScope.testUrl = 'javascript:doEvilStuff()';
          $rootScope.$apply();

          expect(element.prop('title')).toBe('javascript:doEvilStuff()');
        }));

        xit('should use $$sanitizeUri', function() {
          var $$sanitizeUri = jasmine
            .createSpy('$$sanitizeUri')
            .and.returnValue('someSanitizedUrl');
          angular.mock.module(function($provide: any) {
            $provide.value('$$sanitizeUri', $$sanitizeUri);
          });
          inject(function($compile: any, $rootScope: any) {
            var element = $compile(
              '<a ng-custom-element ngce-prop-href="testUrl"></a>'
            )($rootScope);
            $rootScope.testUrl = 'someUrl';
            $rootScope.$apply();
            expect(element.prop('href')).toMatch(
              /^http:\/\/.*\/someSanitizedUrl$/
            );
            expect($$sanitizeUri).toHaveBeenCalledWith(
              $rootScope.testUrl,
              false
            );

            $$sanitizeUri.calls.reset();

            element = $compile(
              '<a ng-custom-element ngce-prop-href="testUrl"></a>'
            )($rootScope);
            $rootScope.$apply();
            expect(element.prop('href')).toMatch(
              /^http:\/\/.*\/someSanitizedUrl$/
            );
            expect($$sanitizeUri).toHaveBeenCalledWith(
              $rootScope.testUrl,
              false
            );
          });
        });

        it('should not have endless digests when given arrays in concatenable context', inject(function(
          $compile: any,
          $rootScope: any
        ) {
          var element = $compile(
            '<foo ng-custom-element ngce-prop-href="testUrl"></foo><foo ng-custom-element ngce-prop-href="::testUrl"></foo>' +
              '<foo ng-custom-element ngce-prop-href="\'http://example.com/\' + testUrl"></foo><foo ng-custom-element ngce-prop-href="::\'http://example.com/\' + testUrl"></foo>'
          )($rootScope);
          $rootScope.testUrl = [1];
          $rootScope.$digest();

          $rootScope.testUrl = [];
          $rootScope.$digest();

          $rootScope.testUrl = { a: 'b' };
          $rootScope.$digest();

          $rootScope.testUrl = {};
          $rootScope.$digest();
        }));
      });

      describe('iframe[src]', function() {
        it('should pass through src properties for the same domain', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<iframe ng-custom-element ngce-prop-src="testUrl"></iframe>'
          )($rootScope);
          $rootScope.testUrl = 'different_page';
          $rootScope.$apply();
          expect(element.prop('src')).toMatch(/\/different_page$/);
        }));

        xit('should clear out src properties for a different domain', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<iframe ng-custom-element ngce-prop-src="testUrl"></iframe>'
          )($rootScope);
          $rootScope.testUrl = 'http://a.different.domain.example.com';
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: http://a.different.domain.example.com'
          //   );
        }));

        xit('should clear out JS src properties', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<iframe ng-custom-element ngce-prop-src="testUrl"></iframe>'
          )($rootScope);
          $rootScope.testUrl = 'javascript:alert(1);';
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: javascript:alert(1);'
          //   );
        }));

        xit('should clear out non-resource_url src properties', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<iframe ng-custom-element ngce-prop-src="testUrl"></iframe>'
          )($rootScope);
          $rootScope.testUrl = $sce.trustAsUrl('javascript:doTrustedStuff()');
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: javascript:doTrustedStuff()'
          //   );
        }));

        it('should pass through $sce.trustAs() values in src properties', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<iframe ng-custom-element ngce-prop-src="testUrl"></iframe>'
          )($rootScope);
          $rootScope.testUrl = $sce.trustAsResourceUrl(
            'javascript:doTrustedStuff()'
          );
          $rootScope.$apply();

          expect(element.prop('src')).toEqual('javascript:doTrustedStuff()');
        }));
      });

      describe('base[href]', function() {
        xit('should be a RESOURCE_URL context', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<base ng-custom-element ngce-prop-href="testUrl"/>'
          )($rootScope);

          $rootScope.testUrl = $sce.trustAsResourceUrl('https://example.com/');
          $rootScope.$apply();
          expect(element.prop('href')).toContain('https://example.com/');

          $rootScope.testUrl = 'https://not.example.com/';
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: https://not.example.com/'
          //   );
        }));
      });

      describe('form[action]', function() {
        it('should pass through action property for the same domain', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<form ng-custom-element ngce-prop-action="testUrl"></form>'
          )($rootScope);
          $rootScope.testUrl = 'different_page';
          $rootScope.$apply();
          expect(element.prop('action')).toMatch(/\/different_page$/);
        }));

        xit('should clear out action property for a different domain', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<form ng-custom-element ngce-prop-action="testUrl"></form>'
          )($rootScope);
          $rootScope.testUrl = 'http://a.different.domain.example.com';
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: http://a.different.domain.example.com'
          //   );
        }));

        xit('should clear out JS action property', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<form ng-custom-element ngce-prop-action="testUrl"></form>'
          )($rootScope);
          $rootScope.testUrl = 'javascript:alert(1);';
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: javascript:alert(1);'
          //   );
        }));

        xit('should clear out non-resource_url action property', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<form ng-custom-element ngce-prop-action="testUrl"></form>'
          )($rootScope);
          $rootScope.testUrl = $sce.trustAsUrl('javascript:doTrustedStuff()');
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: javascript:doTrustedStuff()'
          //   );
        }));

        it('should pass through $sce.trustAsResourceUrl() values in action property', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<form ng-custom-element ngce-prop-action="testUrl"></form>'
          )($rootScope);
          $rootScope.testUrl = $sce.trustAsResourceUrl(
            'javascript:doTrustedStuff()'
          );
          $rootScope.$apply();

          expect(element.prop('action')).toEqual('javascript:doTrustedStuff()');
        }));
      });

      describe('link[href]', function() {
        xit('should reject invalid RESOURCE_URLs', inject(function(
          $compile: any,
          $rootScope: any
        ) {
          var element = $compile(
            '<link ng-custom-element ngce-prop-href="testUrl" rel="stylesheet" />'
          )($rootScope);
          $rootScope.testUrl = 'https://evil.example.org/css.css';
          //   expect(function() {
          //     $rootScope.$apply();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'insecurl',
          //     'Blocked loading resource from url not allowed by $sceDelegate policy.' +
          //       '  URL: https://evil.example.org/css.css'
          //   );
        }));

        it('should accept valid RESOURCE_URLs', inject(function(
          $compile: any,
          $rootScope: any,
          $sce: any
        ) {
          var element = $compile(
            '<link ng-custom-element ngce-prop-href="testUrl" rel="stylesheet" />'
          )($rootScope);

          $rootScope.testUrl = './css1.css';
          $rootScope.$apply();
          expect(element.prop('href')).toContain('css1.css');

          $rootScope.testUrl = $sce.trustAsResourceUrl(
            'https://elsewhere.example.org/css2.css'
          );
          $rootScope.$apply();
          expect(element.prop('href')).toContain(
            'https://elsewhere.example.org/css2.css'
          );
        }));
      });

      describe('*[innerHTML]', function() {
        describe('SCE disabled', function() {
          beforeEach(function() {
            angular.mock.module(function($sceProvider: any) {
              $sceProvider.enabled(false);
            });
          });

          it('should set html', inject(function(
            $rootScope: any,
            $compile: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="html"></div>'
            )($rootScope);
            $rootScope.html = '<div onclick="">hello</div>';
            $rootScope.$digest();
            expect(angular.lowercase(element.html())).toEqual(
              '<div onclick="">hello</div>'
            );
          }));

          it('should update html', inject(function(
            $rootScope: any,
            $compile: any,
            $sce: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="html"></div>'
            )($rootScope);
            $rootScope.html = 'hello';
            $rootScope.$digest();
            expect(angular.lowercase(element.html())).toEqual('hello');
            $rootScope.html = 'goodbye';
            $rootScope.$digest();
            expect(angular.lowercase(element.html())).toEqual('goodbye');
          }));

          xit('should one-time bind if the expression starts with two colons', inject(function(
            $rootScope: any,
            $compile: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="::html"></div>'
            )($rootScope);
            $rootScope.html = '<div onclick="">hello</div>';
            expect($rootScope.$$watchers.length).toEqual(1);
            $rootScope.$digest();
            expect(element.text()).toEqual('hello');
            expect($rootScope.$$watchers.length).toEqual(0);
            $rootScope.html = '<div onclick="">hello</div>';
            $rootScope.$digest();
            expect(element.text()).toEqual('hello');
          }));
        });

        describe('SCE enabled', function() {
          xit('should NOT set html for untrusted values', inject(function(
            $rootScope: any,
            $compile: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="html"></div>'
            )($rootScope);
            $rootScope.html = '<div onclick="">hello</div>';
            // expect(function() {
            //   $rootScope.$digest();
            // }).toThrowMinErr(
            //   '$sce',
            //   'unsafe',
            //   'Attempting to use an unsafe value in a safe context.'
            // );
          }));

          xit('should NOT set html for wrongly typed values', inject(function(
            $rootScope: any,
            $compile: any,
            $sce: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="html"></div>'
            )($rootScope);
            $rootScope.html = $sce.trustAsCss('<div onclick="">hello</div>');
            // expect(function() {
            //   $rootScope.$digest();
            // }).toThrowMinErr(
            //   '$sce',
            //   'unsafe',
            //   'Attempting to use an unsafe value in a safe context.'
            // );
          }));

          it('should set html for trusted values', inject(function(
            $rootScope: any,
            $compile: any,
            $sce: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="html"></div>'
            )($rootScope);
            $rootScope.html = $sce.trustAsHtml('<div onclick="">hello</div>');
            $rootScope.$digest();
            expect(angular.lowercase(element.html())).toEqual(
              '<div onclick="">hello</div>'
            );
          }));

          it('should update html', inject(function(
            $rootScope: any,
            $compile: any,
            $sce: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="html"></div>'
            )($rootScope);
            $rootScope.html = $sce.trustAsHtml('hello');
            $rootScope.$digest();
            expect(angular.lowercase(element.html())).toEqual('hello');
            $rootScope.html = $sce.trustAsHtml('goodbye');
            $rootScope.$digest();
            expect(angular.lowercase(element.html())).toEqual('goodbye');
          }));

          xit('should not cause infinite recursion for trustAsHtml object watches', inject(function(
            $rootScope: any,
            $compile: any,
            $sce: any
          ) {
            // Ref: https://github.com/angular/angular.js/issues/3932
            // If the binding is a function that creates a new value on every call via trustAs, we'll
            // trigger an infinite digest if we don't take care of it.
            var element = $compile(
              '<div ng-custom-element ngce-prop-inner_h_t_m_l="getHtml()"></div>'
            )($rootScope);
            $rootScope.getHtml = function() {
              return $sce.trustAsHtml('<div onclick="">hello</div>');
            };
            $rootScope.$digest();
            expect(angular.lowercase(element.html())).toEqual(
              '<div onclick="">hello</div>'
            );
          }));

          xit('should handle custom $sce objects', function() {
            function MySafeHtml(this: any, val: any) {
              this.val = val;
            }

            angular.mock.module(function($provide: any) {
              $provide.decorator('$sce', function($delegate: any) {
                $delegate.trustAsHtml = function(html: any) {
                  return new (MySafeHtml as any)(html);
                };
                $delegate.getTrusted = function(type: any, mySafeHtml: any) {
                  return mySafeHtml && mySafeHtml.val;
                };
                $delegate.valueOf = function(v: any) {
                  return v instanceof MySafeHtml ? v.val : v;
                };
                return $delegate;
              });
            });

            inject(function($rootScope: any, $compile: any, $sce: any) {
              // Ref: https://github.com/angular/angular.js/issues/14526
              // Previous code used toString for change detection, which fails for custom objects
              // that don't override toString.
              var element = $compile(
                '<div ng-custom-element ngce-prop-inner_h_t_m_l="getHtml()"></div>'
              )($rootScope);
              var html = 'hello';
              $rootScope.getHtml = function() {
                return $sce.trustAsHtml(html);
              };
              $rootScope.$digest();
              expect(angular.lowercase(element.html())).toEqual('hello');
              html = 'goodbye';
              $rootScope.$digest();
              expect(angular.lowercase(element.html())).toEqual('goodbye');
            });
          });

          xdescribe('when $sanitize is available', function() {
            beforeEach(function() {
              angular.mock.module('ngSanitize');
            });

            it('should sanitize untrusted html', inject(function(
              $rootScope: any,
              $compile: any
            ) {
              var element = $compile(
                '<div ng-custom-element ngce-prop-inner_h_t_m_l="html"></div>'
              )($rootScope);
              $rootScope.html = '<div onclick="">hello</div>';
              $rootScope.$digest();
              expect(angular.lowercase(element.html())).toEqual(
                '<div>hello</div>'
              );
            }));
          });
        });
      });

      describe('*[style]', function() {
        // Support: IE9
        // Some browsers throw when assignging to HTMLElement.style
        function canAssignStyleProp() {
          try {
            (window as any).document.createElement('div').style =
              'margin-left: 10px';
            return true;
          } catch (e) {
            return false;
          }
        }

        xit('should NOT set style for untrusted values', inject(function(
          $rootScope: any,
          $compile: any
        ) {
          var element = $compile(
            '<div ng-custom-element ngce-prop-style="style"></div>'
          )($rootScope);
          $rootScope.style = 'margin-left: 10px';
          //   expect(function() {
          //     $rootScope.$digest();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'unsafe',
          //     'Attempting to use an unsafe value in a safe context.'
          //   );
        }));

        xit('should NOT set style for wrongly typed values', inject(function(
          $rootScope: any,
          $compile: any,
          $sce: any
        ) {
          var element = $compile(
            '<div ng-custom-element ngce-prop-style="style"></div>'
          )($rootScope);
          $rootScope.style = $sce.trustAsHtml('margin-left: 10px');
          //   expect(function() {
          //     $rootScope.$digest();
          //   }).toThrowMinErr(
          //     '$sce',
          //     'unsafe',
          //     'Attempting to use an unsafe value in a safe context.'
          //   );
        }));

        if (canAssignStyleProp()) {
          it('should set style for trusted values', inject(function(
            $rootScope: any,
            $compile: any,
            $sce: any
          ) {
            var element = $compile(
              '<div ng-custom-element ngce-prop-style="style"></div>'
            )($rootScope);
            $rootScope.style = $sce.trustAsCss('margin-left: 10px');
            $rootScope.$digest();

            // Support: IE
            // IE allows assignments but does not register the styles
            // Sometimes the value is '0px', sometimes ''
            if (msie) {
              expect(parseInt(element.css('margin-left'), 10) || 0).toBe(0);
            } else {
              expect(element.css('margin-left')).toEqual('10px');
            }
          }));
        }
      });
    });
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
