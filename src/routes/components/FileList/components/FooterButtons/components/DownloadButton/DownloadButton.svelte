<script lang="ts">
	import { IconArrowRight } from '@tabler/icons-svelte';
	import { downloadUtil } from '$utils';
	import { fileStore } from '$stores';
	import { downloadStore } from '$stores';

	let downloadState = $derived(downloadStore.downloadState);
	const { completedCount, totalCount } = $derived(downloadStore);

	const handleDownload = async () => {
		const files = Object.values(fileStore.files);
		await downloadUtil.downloadFiles(files);
	};

	const isDisabled = $derived(downloadState === 'loading');
</script>

<button
	class="downloadButton"
	disabled={isDisabled}
	onclick={handleDownload}
>
	{#if downloadState === 'idle'}
		Download
	{:else if downloadState === 'loading'}
		Downloading ({completedCount} / {totalCount})
	{:else if downloadState === 'done'}
		Downloaded ({completedCount} / {totalCount})
	{:else}
		Download failed
	{/if}

	{#if !isDisabled}
		<IconArrowRight size={20} />
	{/if}
</button>

<style>
  .downloadButton {
    height: 100%;
    min-height: var(--convert-button-min-height);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    background-color: var(--highlight-purple);
    border: none;
    border-radius: 0;
    border-bottom-right-radius: inherit;
    padding-inline: 1.5rem;
    color: var(--white);

    @media screen and (max-width: 40rem) {
			width: 100%;
			border-radius: inherit;
    }

    & > :global(svg) {
      transition: transform ease-in-out 0.1s;
    }
    &:where(:hover, :focus-visible) > :global(svg) {
      transform: translateX(0.5rem);
    }
  }
</style>
