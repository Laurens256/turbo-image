<script lang="ts">
	import { FileUpload } from '$components';
	import { fileStore } from '$stores';
	import { IconSettings, IconTrash } from '@tabler/icons-svelte';
	import { GlobalFileSettingsModal } from './components';

	let isFileSettingsOpen = $state(false);

	const toggleFileSettingsModal = () => {
		isFileSettingsOpen = !isFileSettingsOpen;
	};
</script>

<div class="fileListHeader">
	<div class="buttonsContainer">
		<FileUpload containerClass="button">
			<span class="buttonIcon" aria-hidden="true" role="presentation">+</span>
			Add files
		</FileUpload>
		<button
			onclick={fileStore.clear}
			aria-label="clear all images"
			class="button"
		>
			<IconTrash size={22} class="buttonIcon" />
			Clear all
		</button>
	</div>

	<div class="buttonsContainer">
		<button class="button" aria-label="global image settings" onclick={toggleFileSettingsModal}>
			<IconSettings size={22} class="buttonIcon" />
			Settings
		</button>
	</div>
</div>

<GlobalFileSettingsModal isOpen={isFileSettingsOpen} onClose={toggleFileSettingsModal} />

<style>
	.fileListHeader {
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		gap: 0.5rem;

    @media screen and (max-width: 37.5rem) {
      flex-direction: column;
      align-items: flex-start;
			gap: 0.25rem;

      & :global(.button) {
				flex: 1 1 0;
      }
    }

		& :global(.button) {
      display: flex;
      align-items: center;
      gap: 0.5rem;
			border: 2px solid var(--highlight-button);
			justify-content: center;
			white-space: nowrap;

      & > :global(.buttonIcon) {
        color: var(--text-secondary);
        font-size: 1.75rem;
        line-height: 0;

        @media screen and (max-width: 10rem) {
         	display: none;
        }
      }
		}
	}
	.buttonsContainer {
    display: flex;
    align-items: center;
    gap: inherit;
		width: 100%;

    &:not(:first-of-type):last-of-type {
      justify-content: flex-end;
    }

		@media screen and (max-width: 20rem) {
			flex-direction: column;

			& :global(.button) {
				width: 100%;
			}
		}
	}
</style>
