export interface ExceptionHandlerService {
  (exception: Error, cause?: string): void;
}

export interface SimplifiedParseService {
  (expression: string): SimplifiedCompiledExpression;
}

export interface SimplifiedCompiledExpression {
  (context: any, locals?: any): any;
}

export interface SimplifiedRootScopeService {
  $apply(): any;
  $apply(exp: string): any;
  $apply(exp: (scope: SimplifiedScope) => any): any;

  $watch<T>(
    watchExpression: (scope: SimplifiedScope) => T,
    listener?: (newValue: T, oldValue: T, scope: SimplifiedScope) => any,
    objectEquality?: boolean
  ): () => void;

  $$phase: any;
}

export interface SimplifiedScope extends SimplifiedRootScopeService {}

export interface SimplifiedAttributes {
  [name: string]: any;
}

export interface SimplifiedJQLite {
  prop(propertyName: string): any;
  prop(propertyName: string, value: string | number | boolean): this;

  on(events: string, handler: (eventObject: any, ...args: any[]) => any): this;
}
