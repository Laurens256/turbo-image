<script lang="ts">
	import { Dialog, Input, OutputSelect } from '$components';
	import { fileStore } from '$stores';
	import { validateFormValues } from './schema';
	import { EXT_TO_DEFAULT_QUALITY } from '$constants';
	import { LOSSY_IMAGE_EXT } from './constants';
	import { stringUtil } from '$utils';
	import type { FormValues } from './types';

	type Props = {
		fileId: string | null;
		onClose: () => void;
		isOpen: boolean;
	};
	let {
		fileId,
		onClose,
		isOpen,
	}: Props = $props();

	const uploadedFile = $derived(fileId ? fileStore.getFile(fileId) : null);

	let formValues = $state<FormValues>({});
	const { hasFormError, formErrors } = $derived(validateFormValues(formValues));

	const canSetQuality = $derived(formValues.outputExt && LOSSY_IMAGE_EXT.includes(formValues.outputExt));

	const originalFilenameWithoutExt = $derived(uploadedFile
		? stringUtil.getFilenameWithoutExtension(uploadedFile.file.name)
		: '',
	);

	const defaultFileQualityString = $derived(
		formValues.outputExt && EXT_TO_DEFAULT_QUALITY[formValues.outputExt],
	);

	$effect(() => {
		if (uploadedFile) {
			formValues = {
				newName: uploadedFile.newName,
				outputExt: uploadedFile.outputExt,
				quality: uploadedFile.quality,
			};
		}
	});

	const handleClose = () => {
		if (!hasFormError && fileId) {
			fileStore.updateSettings(fileId, formValues);
		}
		onClose();
	};
</script>

<Dialog title="Image settings" onClose={handleClose} {isOpen}>
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

		<OutputSelect
			prefix="Output:"
			currentValue={formValues.outputExt}
			onChange={(ext) => formValues.outputExt = ext}
		/>

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
			placeholder={String(defaultFileQualityString || '-')}
		/>
	</form>
</Dialog>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
</style>
