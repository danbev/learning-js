### Source maps
Source maps are useful in situations where source code get transpiled (source
code in one language/version to another to source code in a different language/
version). For example, Babel transpiles ES6+ code to ES5 allowing a developer to
use language features in ES6+ but run them in browsers/servers that understand
ES5. So this is an example of transpilation in the same language. Emscripten
transpiles C/C++ into JavaScript which is an example of transpiling from C/C++
source code into JavaScript source code.

Running source code through a transpiler can make the output source code
difficult for humans to read. The whole idea of the transpiler might be to
optimize the source code for space, removing whitespace for example. This where
source maps can help. A source map helps map/link the output source code file
back to the original source code file. For example, even if you run a minified
version of your source code using a debugger, using a source map, it can still
so the correct lines in the original source code.

### Adding a source map
This can be done by adding a line like the following to a JavaScript file:
```javascript
//# sourceMappingURL=/path/to/source_file.js.map
```
