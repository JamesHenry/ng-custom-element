export const directiveSelector = "ngCustomElement";

export const directiveFactory = [
  function directiveFactory() {
    return {
      restrict: "E",
      transclude: true,
      replace: false,
      scope: {
        props: "=",
        events: "="
      },
      template: `
        <div ng-transclude></div>
      `,
      link: (
        $scope: any,
        $element: any,
        _a: any,
        _c: any,
        $transclude: any
      ) => {
        $transclude((clone: any) => {
          const transcludedElement = clone[1];

          if ($scope.props) {
            Object.keys($scope.props).forEach(propName => {
              transcludedElement[propName] = $scope.props[propName];
            });
          }

          if ($scope.events) {
            Object.keys($scope.events).forEach(eventName => {
              transcludedElement.addEventListener(
                eventName,
                $scope.events[eventName]
              );
            });
          }

          $element.empty();
          $element.append(clone);
        });
      }
    };
  }
];
