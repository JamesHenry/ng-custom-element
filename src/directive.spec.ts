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
      <p ng-custom-element props="somePropConfig">content</p>
    `)($scope);

    $scope.$apply(`somePropConfig = { prop1: "val", prop2: "val2" }`);

    expect(node[0].prop1).toEqual("val");
    expect(node[0].prop2).toEqual("val2");

    node.remove();
  }));
});
