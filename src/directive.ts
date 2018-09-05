export const directiveSelector = "ngCustomElement";

export const directiveFactory = [
  function directiveFactory() {
    return {
      restrict: "A",
      scope: {
        props: "=",
        events: "="
      },
      link: ($scope: any, $element: any) => {
        /**
         * Apply the initial values for `props` and `events`
         */
        const customElement = $element[0];
        applyProps(customElement, $scope.props);
        addEventListeners(customElement, $scope.events);
        /**
         * Watch for changes to the `props` mapping
         */
        $scope.$watch(
          () => $scope.props,
          () => {
            console.log("prop watch", $scope.props);
            applyProps(customElement, $scope.props);
          },
          true
        );
        /**
         * Clean up the event listeners when the element is destroyed
         */
        $element.on("$destroy", function() {
          console.log("destroy");
          removeEventListeners(customElement, $scope.events);
        });
      }
    };
  }
];

function applyProps(el: HTMLElement, props: { [key: string]: any }) {
  if (props) {
    Object.keys(props).forEach(propName => {
      (el as any)[propName] = props[propName];
    });
  }
}

function addEventListeners(
  el: HTMLElement,
  events: { [key: string]: EventListenerOrEventListenerObject }
) {
  if (events) {
    Object.keys(events).forEach(eventName => {
      el.addEventListener(eventName, events[eventName]);
    });
  }
}

function removeEventListeners(
  el: HTMLElement,
  events: { [key: string]: EventListenerOrEventListenerObject }
) {
  if (events) {
    Object.keys(events).forEach(eventName => {
      el.removeEventListener(eventName, events[eventName]);
    });
  }
}
