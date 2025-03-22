<script lang="ts">
	import { stringUtil } from '$utils';
	import { Dialog } from '$components';
	import { fileStore, downloadStore } from '$stores';

	const handleClose = () => {
		downloadStore.reset();
	};

	const handleClearFiles = () => {
		fileStore.clear();
		handleClose();
	};
</script>

<Dialog
	isOpen={downloadStore.downloadState === 'done' || downloadStore.downloadState === 'error'}
	title="Downloaded ({downloadStore.successCount} / {downloadStore.totalCount})
		{stringUtil.pluralize({ count: downloadStore.totalCount, singular: 'file', includeCount: false })}"
	onClose={handleClose}
>
	<div class="inner">
		{#if !downloadStore.failedCount}
			<p>Successfully converted all files</p>
		{:else}
			<small>
				An error occurred in the following
				{stringUtil.pluralize({ count: downloadStore.failedCount, singular: 'file', includeCount: false })}.
				{stringUtil.pluralize({
					count: downloadStore.failedCount,
					singular: 'Its',
					plural: 'Their',
					includeCount: false,
				})}
				file type may not be supported.
			</small>

			<ul class="errorList">
				{#each downloadStore.failedIds as id}
					<li>{fileStore.getFile(id)?.file.name || 'Unknown'}</li>
				{/each}
			</ul>
		{/if}

		<small class="duration">Duration: {downloadStore.durationSeconds}s</small>

		<div class="buttonsContainer">
			<button onclick={handleClearFiles}>
				Clear files
			</button>
			<button onclick={handleClose}>
				Close
			</button>
		</div>
	</div>
</Dialog>

<style>
	.inner {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
  .duration {
    color: var(--text-secondary);
  }

	.errorList {
    list-style-type: disc;
    list-style-position: inside;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-block: 1rem;
    max-height: 25rem;
    overflow-y: auto;
    font-size: 0.9rem;
	}

	.buttonsContainer {
		display: flex;
		justify-content: center;
		gap: 0.5rem;
		margin-top: 1.5rem;
		flex-wrap: wrap;

		& button {
			flex: 1 1 0;
			min-width: min(10rem, 100%);
		}
	}
</style>
