const validateFormValues = (formValues: Record<string, unknown>) => {
	const errors: Record<string, string[]> = {};

	if (typeof formValues.batchSizeMB !== 'number' || isNaN(formValues.batchSizeMB)) {
		errors.batchSizeMB = ['Must be a valid number'];
	} else if (formValues.batchSizeMB < 0) {
		errors.batchSizeMB = ['Can\'t be negative. Set to 0 to disable batching'];
	} else if (formValues.batchSizeMB > 100) {
		errors.batchSizeMB = ['Can\'t be more than 100MB'];
	}

	return {
		hasFormError: Object.keys(errors).length > 0,
		formErrors: errors,
	};
};

export {
	validateFormValues,
};
