<script lang="ts">
	import { Dialog } from '$components';
	import { erroredFilesStore } from '$stores';

	const files = $derived(erroredFilesStore.files);
	const filesCount = $derived(files.length);
	let isMultipleFiles = $derived(filesCount > 1);
	let filesPlural = $derived(`file${isMultipleFiles ? 's' : ''}`);

	const onClose = () => {
		erroredFilesStore.clear();
	};
</script>

<Dialog title={`Error in ${filesCount} ${filesPlural}`} {onClose} isOpen={filesCount > 0}>
	<p class="smallText">
		{`The following ${filesPlural} could not be downloaded because of an unexpected error:`}
	</p>
	<ul class="list">
		{#each files as file}
			<li>{file}</li>
		{/each}
	</ul>

	<button class="button" onclick={onClose}>Continue</button>
</Dialog>

<style>
	.smallText {
		font-size: 0.8rem;
		color: var(--text-secondary);
	}

	.list {
		list-style-type: disc;
		list-style-position: inside;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1rem;
		max-height: 25rem;
		overflow-y: auto;
		font-size: 0.9rem;
	}

	.button {
		margin: 1.5rem auto 0 auto;
		display: block;
	}
</style>
