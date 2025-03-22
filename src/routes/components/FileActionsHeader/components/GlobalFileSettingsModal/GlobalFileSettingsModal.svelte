<script lang="ts">
	import { fileStore } from '$stores';
	import { Dialog, Input, OutputSelect } from '$components';
	import type { FormValues } from './types';
	import { validateFormValues } from './schema';
	import { arrayUtil } from '$utils';

	type Props = {
		isOpen: boolean;
		onClose: () => void;
	};

	$effect(() => {
		if (isOpen) {
			formValues = arrayUtil.extractCommonValues(
				Object.values(fileStore.files),
				['quality', 'outputExt'],
			);
		}
	});

	let formValues: FormValues = $state({});
	const { hasFormError, formErrors } = $derived(validateFormValues(formValues));

	const { isOpen, onClose }: Props = $props();

	const handleClose = () => {
		onClose();
		if (!hasFormError) {
			fileStore.updateAllSettings(formValues);
		}
	};
</script>

<Dialog
	title="Settings"
	onClose={handleClose}
	{isOpen}
>
	<form class="form">
		<small class="smallText">These settings will be applied to all your currently uploaded files</small>

		<OutputSelect
			currentValue={formValues.outputExt}
			onChange={(ext) => formValues.outputExt = ext}
			prefix="Ouput:"
		/>

		<Input
			label="Image quality (0-100)"
			type="number"
			bind:value={formValues.quality}
			errors={formErrors.quality}
			tooltip="This value will only be used if the output type supports lossy compression"
			id="file_name"
		/>
	</form>
</Dialog>

<style>
	.form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.smallText {
		color: var(--text-secondary);
	}
</style>
