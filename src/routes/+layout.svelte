<script lang="ts">
	import { supportedFormatsStore, appSettingsStore } from '$stores';
	import { onMount } from 'svelte';

	const { children } = $props();
	let isClientLoaded = $state(false);

	$effect.pre(() => {
		supportedFormatsStore.testImageOutputs();
		supportedFormatsStore.testImageInputs();
		appSettingsStore.setAppSettingsFromStorage();
		isClientLoaded = true;
	});
</script>

<svelte:head>
	<title>TurboImage</title>
</svelte:head>

{#if supportedFormatsStore.imageOutputs.length === 0 && isClientLoaded}
	<div class="__fullscreen_error_container__">
		<h1>No supported image output types found.</h1>
		<p>
			Please try using a different browser or update your current browser to the latest version.
		</p>
	</div>
{:else}
	<div class="container">
		{@render children()}
	</div>
{/if}

<style>
	.container {
		width: min(95%, 60rem);
		margin-inline: auto;
	}
</style>
