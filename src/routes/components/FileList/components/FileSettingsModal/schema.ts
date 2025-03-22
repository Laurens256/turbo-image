const validateFormValues = (formValues: Record<string, unknown>) => {
	const errors: Record<string, string[]> = {};

	if (formValues.newName !== undefined && typeof formValues.newName !== 'string') {
		errors.newName = ['Must be a string'];
	}

	if (formValues.quality !== undefined && formValues.quality !== null) {
		if (typeof formValues.quality !== 'number' || isNaN(formValues.quality)) {
			errors.quality = ['Must be a number'];
		} else if (formValues.quality < 0 || formValues.quality > 100) {
			errors.quality = ['Quality must be between 0 and 100'];
		}
	}

	return {
		hasFormError: Object.keys(errors).length > 0,
		formErrors: errors,
	};
};

export { validateFormValues };
