<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

(Top level main frame from +layout.svelte)

<!-- Header (nav bars, sidebars) area -->

<!-- Render all child pages in this directory (like +page.svelte) -->
<!-- This is the main page content area -->
{@render children()}


<!-- Footer area -->
