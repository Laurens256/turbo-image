<script lang="ts">
	import { supportedFormatsStore, appSettingsStore } from '$stores';
	import { Nav } from '$components';

	const { children } = $props();

	$effect.pre(() => {
		// make sure this is .pre so we can use appSettings in rendered content
		supportedFormatsStore.testImageOutputs();
		appSettingsStore.setAppSettingsFromStorage();
	});
</script>

{#if supportedFormatsStore.imageOutputs.length === 0}
	<div class="__fullscreen_error_container__">
		<h1>No supported image output types found.</h1>
		<p>
			Please try using a different browser or update your current browser to the latest version.
		</p>
	</div>
{:else}
	<div class="root">
		<Nav />
		<div class="scrollContainer">
			<div class="inner">
				{@render children()}
			</div>
		</div>
	</div>
{/if}

<style>
	.root {
		--nav-width: 4.5rem;
		display: flex;
		height: 100%;
		justify-content: space-between;

		@media screen and (max-width: 35rem) {
			--nav-width: auto;
			flex-direction: column-reverse;
		}
	}
	.scrollContainer {
		overflow-y: auto;
		width: 100%;
	}
	.inner {
		width: min(95%, 60rem);
		margin-inline: auto;
		padding-bottom: 1.5rem;
	}
</style>
