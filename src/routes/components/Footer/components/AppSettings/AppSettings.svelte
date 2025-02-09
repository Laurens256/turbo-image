<script lang="ts">
	import { appSettingsStore, supportedFormatsStore } from '$stores';
	import { Dialog, Input } from '$components';
	import type { AppSettings } from '$types';
	import { mimeUtil } from '$utils';
	import { schema } from './schema';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
	};
	let { isOpen, onClose }: Props = $props();

	let formValues: AppSettings = $state($state.snapshot(appSettingsStore.settings));

	const { hasFormError, formErrors } = $derived.by(() => {
		const { error } = schema.safeParse(formValues);
		if (error) {
			return {
				hasFormError: true,
				formErrors: error.flatten().fieldErrors,
			};
		}

		return {
			hasFormError: false,
			formErrors: {},
		};
	});

	const handleFormReset = () => {
		const newValue = appSettingsStore.reset();
		formValues = newValue;
	};

	const handleClose = () => {
		if (hasFormError) {
			formValues = appSettingsStore.settings;
		} else {
			appSettingsStore.update(formValues);
		}
		onClose();
	};
</script>

<Dialog title="Settings" onClose={handleClose} isOpen={isOpen}>
	<form class="form" onsubmit={(e) => e.preventDefault()}>
		<Input
			label="Batch size (MB)"
			tooltip="A higher batch size will convert more images at once, but will use more resources.
				Set to zero to disable batching."
			type="number"
			inputmode="numeric"
			id="batch_size_mb"
			errors={formErrors.batchSizeMB}
			bind:value={formValues.batchSizeMB}
		/>

		<section class="extensionsSection">
			<p>Default output extension</p>
			<div class="extensionsContainer">
				{#each supportedFormatsStore.imageOutputs as mime}
					<div class="extensionContainer">
						<input
							type="radio"
							class="visuallyHidden"
							id={mime}
							name="preferred_extension"
							value={mime}
							bind:group={formValues.preferredImageMime}
						/>
						<label
							for={mime}
							class="extension"
							class:active={mime === formValues.preferredImageMime}
						>
							{mimeUtil.getImageExtensionByMimetype(mime)}
						</label>
					</div>
				{/each}
			</div>
		</section>

		<button class="resetButton" onclick={handleFormReset} type="button">
			Reset to default values
		</button>
	</form>
</Dialog>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
		}
	}

	.resetButton {
		width: fit-content;
		margin-inline: auto;
		margin-top: 2rem;
	}
</style>
