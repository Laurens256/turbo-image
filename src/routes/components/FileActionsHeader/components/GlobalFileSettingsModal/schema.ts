import type { FormValues } from './types';

const validateFormValues = (formValues: FormValues) => {
	const errors: Partial<Record<keyof FormValues, string[]>> = {};

	if (formValues.quality) {
		if (isNaN(formValues.quality)) {
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
