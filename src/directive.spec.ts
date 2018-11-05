import "angular";
import "angular-mocks";
import "./index";

declare const angular: any;
declare const inject: any;

describe("ngCustomElement directive", () => {
  beforeEach(angular.mock.module("ngCustomElement"));

  it("should forward property bindings on to the element", inject((
    $compile: any,
    $rootScope: any
  ) => {
    const $scope = $rootScope.$new();

    const node = $compile(`
      <p ng-custom-element ngce-prop-prop1="somePropConfig.prop1" ngce-prop-prop2="somePropConfig.prop2">content</p>
    `)($scope);

    $scope.$apply(`somePropConfig = { prop1: "val", prop2: "val2" }`);

    expect(node[0].prop1).toEqual("val");
    expect(node[0].prop2).toEqual("val2");

    node.remove();
  }));

  it("should forward event bindings on to the element", inject((
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
});
