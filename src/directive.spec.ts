import "angular";
import "angular-mocks";
import "./index";

declare const inject: any;

describe("ngCustomElement directive", () => {
  it("should forward property bindings on to the transcluded element", inject((
    $compile: any,
    $rootScope: any,
    $timeout: any
  ) => {
    const $scope = $rootScope.$new();

    const node = $compile(`
        <div>
            <ng-custom-element props="somePropConfig">
                <p>content</p>
            </ng-custom-element>
        </div>
    `)($scope);

    $scope.$apply(`somePropConfig = { prop1: "val", prop2: "val2" }`);

    $timeout(() => {
      const contents = node.contents();
      expect(contents[1].children[0].prop1).toEqual("val");
      expect(contents[1].children[0].prop2).toEqual("val2");
    });
  }));
});
