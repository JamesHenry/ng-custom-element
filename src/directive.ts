export const directiveSelector = "ngCustomElement";

interface PropsMapping {
  [key: string]: any;
}

interface EventsMapping {
  [key: string]: EventListenerOrEventListenerObject;
}

interface $Watch {
  <T>(
    watcherFn: () => T,
    cb: (newVal: T, oldVal: T) => any,
    isDeep: boolean
  ): void;
}

export const directiveFactory = [
  function directiveFactory() {
    return {
      restrict: "A",
      scope: {
        props: "=",
        events: "="
      },
      link: (
        $scope: { props: PropsMapping; events: EventsMapping; $watch: $Watch },
        $element: any
      ) => {
        /**
         * Apply the initial values for `props` and `events`
         */
        const customElement = $element[0];
        applyProps(customElement, $scope.props);
        addEventListeners(customElement, $scope.events);
        /**
         * Watch for changes to the `props` mapping
         */
        $scope.$watch<PropsMapping>(
          () => $scope.props,
          newVal => {
            console.log("props watch", newVal);
            applyProps(customElement, newVal);
          },
          true
        );
        /**
         * Watch for changes to the `events` mapping
         */
        $scope.$watch<EventsMapping>(
          () => $scope.events,
          (newVal, oldVal) => {
            console.log("events watch", newVal);
            removeEventListeners(customElement, oldVal);
            addEventListeners(customElement, newVal);
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

function applyProps(el: HTMLElement, props: PropsMapping) {
  if (props) {
    Object.keys(props).forEach(propName => {
      (el as any)[propName] = props[propName];
    });
  }
}

function addEventListeners(el: HTMLElement, events: EventsMapping) {
  if (events) {
    Object.keys(events).forEach(eventName => {
      el.addEventListener(eventName, events[eventName]);
    });
  }
}

function removeEventListeners(el: HTMLElement, events: EventsMapping) {
  if (events) {
    Object.keys(events).forEach(eventName => {
      el.removeEventListener(eventName, events[eventName]);
    });
  }
}
