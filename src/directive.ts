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
        let transcludedElement: any;

        $scope.$watch(
          () => $scope.props,
          () => {
            console.log('prop watch', $scope.props)
            if (transcludedElement && $scope.props) {
              Object.keys($scope.props).forEach(propName => {
                transcludedElement[propName] = $scope.props[propName];
              });
            }
          },
          true
        );

        $transclude((clone: any) => {
          console.log("run transclude");
          transcludedElement = clone[1];

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

        $scope.$on("$destroy", function() {
          console.log("destroy");

          if (transcludedElement && $scope.events) {
            Object.keys($scope.events).forEach(eventName => {
              transcludedElement.removeEventListener(
                eventName,
                $scope.events[eventName]
              );
            });
          }
        });
      }
    };
  }
];
