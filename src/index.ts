type AnyFunc = (...args: any) => any;
type BeforeFunc = (...args: any[]) => void;
type AfterFunc = (arg: any) => void;

type Parameter<T extends AfterFunc> = T extends (arg: infer P) => void
  ? P
  : never;

type FuncWithSameArguments<F extends AnyFunc, R> = (
  ...args: Parameters<F>
) => R;

interface WrappingFunctions<B, A> {
  before?: B;
  after?: A;
}

export function wrapThis<B extends BeforeFunc, A extends AfterFunc>({
  before,
  after
}: WrappingFunctions<B, A>) {
  type R = Parameter<A>;

  return function (
    target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<FuncWithSameArguments<B, R>>
  ): void {
    const decoratedFunction = descriptor.value;
    if (decoratedFunction === undefined) {
      return;
    }

    descriptor.value = function (...args: Parameters<B>): R {
      if (before !== undefined) {
        before(...args);
      }
      const result = decoratedFunction.apply(this, args);
      if (after !== undefined) {
        after(result);
      }
      return result;
    };
  };
}

export function before<B extends BeforeFunc>(before: B) {
  return wrapThis({ before });
}

export function after<A extends AfterFunc>(after: A) {
  return wrapThis({ after });
}
