<script lang="ts">
	import { Dialog } from '$components';
	import { unsupportedFilesStore } from '$stores';

	let files = $derived(unsupportedFilesStore.files);
	let isMultipleFiles = $derived(files.length > 1);
	let filesPlural = $derived(`file${isMultipleFiles ? 's' : ''}`);

	const onClose = () => {
		unsupportedFilesStore.clear();
	};
</script>

<Dialog title={`Unsupported ${filesPlural}`} {onClose} isOpen={files.length > 0}>
	<p class="smallText">
		{`The following ${filesPlural} ${isMultipleFiles ? 'were' : 'was'} not uploaded because ${isMultipleFiles ? 'their' : 'its'} type is not supported:`}
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
