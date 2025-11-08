# SvelteKit Example

### Entry point
The entry point to the application is `src/routes/+page.svelte`. This like the
main page which can include other pages called children. Currently there
is one page named +page.svelte in the routes directory. The '+' prefix is used
by SvelteKit to denote special files.

### Components
Components are like self-contained widgets that can be reused throughout the
application. There is one name Thing.svelte in src/lib. To use a component it
can be imported:
```svelte
<script lang="ts">
  import Thing from '$lib/Thing.svelte';
</script>
```

### Dev server
```console
$ npm run dev -- --open
```

### Building
```console
$ npm run build
```

### Configuruation

#### svelte.config.js:
There is a `svelte.config.js` which is like a CMake or a Make file.

```js
import adapter from '@sveltejs/adapter-auto';
```
This is like choosing a build target and what the adapter does is it converts
the SvelteKit app into a format that can be deployed to a specific platform like
node.js for example. The `adapter-auto` will automatically choose the best adapter
based on the environment.


```js
const config = {
	preprocess: vitePreprocess(),
    ...
```
This takes care of converting TypeScript and other preprocessors into plain
JavaScript compatiable with the target browser. It also processes PostCSS,
SCSS, SASS and other CSS preprocessors specified in <style> blocks.
It also generates source maps which are useful for debugging.
When we have a svelte component:
```svelte
<script>
  let { name } = $props();
</script>

<h1>Welcome {name} </h1>

<style lang="sccs">
  h1 {
    color: purple;
  }
</style>
```
The vitePreprocess sees lang="ts" and lang="scss" and passes the typescript
through the TypeScript compiler and the SCSS through the SCSS compiler.

It uses Vite under the hood which is a fast build tool that leverages modern
browser features like ES modules and native imports to speed up the development.


#### vite.config.js:
Vite (fast in French) is like a build system, like CMake or Make, and also a
development server with hot reloading, and also a module bundler.
