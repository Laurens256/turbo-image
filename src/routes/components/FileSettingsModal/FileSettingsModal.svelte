<script lang="ts">
	import type { UploadedFile } from '$types';
	import { Dialog, Input, OutputSelect } from '$components';
	import { EXT_TO_DEFAULT_QUALITY, LOSSY_IMAGE_MIMES } from '$constants';
	import { fileStore } from '$stores';
	import { schema } from './schema';

	type Props = {
		fileId: string;
		uploadedFile: UploadedFile;
		onClose: () => void;
	};
	let {
		fileId,
		uploadedFile,
		onClose,
	}: Props = $props();

	let formValues: UploadedFile = $state($state.snapshot(uploadedFile));
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

	let canSetQuality = $derived(LOSSY_IMAGE_MIMES.includes(formValues.outputMime));

	const handleClose = () => {
		if (!hasFormError) {
			fileStore.updateSettings(fileId, formValues);
		}
		onClose();
	};

	const originalFilenameWithoutExt = uploadedFile.file.name.split('.').slice(0, -1).join('.');

	const defaultFileQualityString = $derived(String(EXT_TO_DEFAULT_QUALITY[formValues.outputMime] || '-'));
</script>

<Dialog title="Image settings" onClose={handleClose} isOpen>
	<form class="form">
		<Input
			label="File name"
			type="text"
			bind:value={formValues.newName}
			errors={formErrors.newName}
			tooltip="Leave empty to keep the original file name"
			placeholder={originalFilenameWithoutExt}
			id="file_name"
		/>

		<div class="outputSelect">
			<OutputSelect
				currentValue={formValues.outputMime}
				onChange={(mime) => formValues.outputMime = mime}
			/>
		</div>

		<Input
			label={`Quality (${canSetQuality ? '0-100' : 'disabled'})`}
			type="number"
			bind:value={formValues.quality}
			tooltip={canSetQuality
				? 'A higher value means better quality but larger file size'
				: 'This file type does not support lossy compression'}
			errors={formErrors.quality}
			inputmode="numeric"
			disabled={!canSetQuality}
			id="quality_setting"
			placeholder={defaultFileQualityString}
		/>
	</form>
</Dialog>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.outputSelect {
		width: min-content;
	}
</style>
