<script lang="ts">
	import { OutputSelect } from '$components';
	import { fileStore } from '$stores';
	import { DownloadButton } from './components';
	import { arrayUtil } from '$utils';

	const files = $derived(Object.values(fileStore.files));
	const { outputExt } = $derived(arrayUtil.extractCommonValues(files, ['outputExt']));
</script>

<div class="wrapper">
	<section class={['root', files.length <= 1 && 'noOutputSelect']}>
		{#if files.length > 1}
			<OutputSelect
				onChange={(outputExt) => fileStore.updateAllSettings({ outputExt })}
				currentValue={outputExt}
				containerClass="outputSelectContainer"
				prefix="Convert all ({files.length}) to"
			/>
		{/if}
		<DownloadButton />
	</section>
</div>

<style>
	.wrapper {
    background-color: var(--background-primary);
    position: sticky;
    bottom: 0;
	}
  .root {
		--convert-button-min-height: 3.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
		border: var(--border);
		background-color: var(--highlight-button);
    padding-left: 1rem;
		border-bottom-left-radius: var(--border-radius);
		border-bottom-right-radius: var(--border-radius);

		&.noOutputSelect {
			justify-content: flex-end;
		}

		@media screen and (max-width: 40rem) {
			flex-direction: column;
			padding: 0;
		}
  }

	.root {
		& > :global(.outputSelectContainer) {
			display: flex;
			align-items: center;
			gap: 0.5rem;

			@media screen and (max-width: 40rem) {
				min-height: var(--convert-button-min-height);
			}
 	 	}
	}
</style>
