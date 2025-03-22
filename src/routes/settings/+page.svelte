<script lang="ts">
	import { appSettingsStore, supportedFormatsStore } from '$stores';
	import { Input } from '$components';
	import type { AppSettings } from '$types';
	import { validateFormValues } from './schema';
	import { beforeNavigate } from '$app/navigation';

	let formValues: AppSettings = $state(appSettingsStore.settings);

	const { hasFormError, formErrors } = $derived(validateFormValues(formValues));

	const handleFormReset = () => {
		formValues = appSettingsStore.reset();
	};

	beforeNavigate(() => {
		if (!hasFormError) appSettingsStore.update(formValues);
	});
</script>

<main>
	<form class="form" onsubmit={(e) => e.preventDefault()}>
		<h1>Settings</h1>
		<Input
			label="Batch size (MB)"
			tooltip="A higher batch size will process more images at once, but will use more resources.
				Set to zero to disable batching."
			type="number"
			inputmode="numeric"
			id="batch_size_mb"
			defaultValue=""
			errors={formErrors.batchSizeMB}
			bind:value={formValues.batchSizeMB}
		/>

		<section class="extensionsSection">
			<p>Default output extension</p>
			<div class="extensionsContainer">
				{#each supportedFormatsStore.imageOutputs as ext}
					<div class="extensionContainer">
						<input
							type="radio"
							class="visuallyHidden"
							id={ext}
							name="preferred_extension"
							value={ext}
							bind:group={formValues.preferredImageExt}
						/>
						<label
							for={ext}
							class="extension"
							class:active={ext === formValues.preferredImageExt}
						>
							{ext}
						</label>
					</div>
				{/each}
			</div>
		</section>

		<button class="resetButton" onclick={handleFormReset} type="button">
			Reset to default values
		</button>
	</form>
</main>

<style>
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
		padding-top: min(8vh, 7.5rem);
    width: min(100%, 40rem);
		margin-inline: auto;
  }

  .extensionsSection {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .extensionsContainer {
    --edges-radius: 0.5rem;
    display: flex;
    width: 100%;
  }

  .extensionContainer {
    flex-grow: 1;

    &:first-of-type .extension {
      border-top-left-radius: var(--edges-radius);
      border-bottom-left-radius: var(--edges-radius);
    }
    &:last-of-type .extension {
      border-top-right-radius: var(--edges-radius);
      border-bottom-right-radius: var(--edges-radius);
    }
  }
  input:focus-visible + .extension {
    outline: solid 2px var(--highlight-purple);
    outline-offset: 2px;
    z-index: 1;
  }
  input:where(:hover, :focus-visible) + .extension:not(.active) {
    background-color: var(--background-button-hover);
  }
  .extension {
    position: relative;
    cursor: pointer;
    background-color: var(--background-button);
    display: block;
    text-align: center;
    padding-block: 0.5rem;
    border-radius: 0;

    &.active {
      background-color: var(--highlight-purple);
      cursor: default;
      color: var(--white);
    }
  }

  .resetButton {
    width: fit-content;
    margin-inline: auto;
    margin-top: 2rem;
  }
</style>
