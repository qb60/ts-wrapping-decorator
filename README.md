## Typescript wrapping decorator (concept, not tested properly)
You can wrap a method in a class with a function which is called before the wrapped method with all its arguments and a function which is called after the wrapped method with its result as an argument. All parameters are typechecked, if some of them don't match a compilation error will be generated.

### Installation:
```
npm install github:qb60/ts-wrapping-decorator
```
or add to package.json
```json
"dependencies": {
    "ts-wrapping-decorator": "github:qb60/ts-wrapping-decorator"
}
```

and add to your tsconfig.json:
```json
"compilerOptions": {
    "experimentalDecorators": true,
  },
```
for enabling decorators.

### Example:
```typescript
import {before, after, wrapThis} from "ts-wrapping-decorator";

function beforeFunc(str: string, num: number) {
    console.log('In: ', str, num);
}

function afterFunc(result: string) {
    console.log('Out: ', result);
}

class Foo {
    someField: string;
    constructor(value: string) {
        this.someField = value;
    }

    @before(beforeFunc)
    @after(afterFunc)
    // @wrapThis({ beforeFunc, afterFunc }) // does the same as before/after
    foo(str: string, num: number) {
        return `${this.someField} - ${str} - ${num}`;
    }
}

const g = new Foo('haha');
console.log(g.foo('foo', 19));
console.log(g.foo('bar', 32));

// In:  foo 19
// Out:  haha - foo - 19
// haha - foo - 19
// In:  bar 32
// Out:  haha - bar - 32
// haha - bar - 32

```
