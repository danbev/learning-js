### TypeScript
Adds a language that that gets compiled to JavaScript and the main feature is
that it adds types which the compiler can check the usage of.

After the typescript compiler generates an AST for a program it will typecheck
the code before it emits the javascript.
```
TypeScript source -> TypeScript AST
TypeScript AST -> TypeChecker
TypeScript AST -> JavaScript Source
```

To create a node project that uses TypeScript:
```console
$ npm install -g typescript
```
Create the typescript configuration file:
```console
$ tsc --init
message TS6071: Successfully created a tsconfig.json file.
```

Compile:
```console
$ tsc
```
The output will be placed in `dist` which is configured in tsconfig.json.
You can also watch source files for changes and have them compiled using
the `-w` flag.

```console
$ node dist/index.js
Hello Fletch!
```

#### TypeSystem
On can explicitely annotate types using the form `value: type`, for example
```js
const name: string = 'Fletch';
const age: number = 42;
```
But TypeScript can also infer types when the annotation is left out.
