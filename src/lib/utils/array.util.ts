const extractCommonValues = <T>(items: T[], keys: (keyof T)[]): Partial<T> => {
	if (items.length === 0) return {};

	const commonValues: Partial<T> = {};

	for (const key of keys) {
		const firstValue = items[0][key];
		if (items.every((item) => item[key] === firstValue)) {
			commonValues[key] = firstValue;
		}
	}

	return commonValues;
};

export default {
	extractCommonValues,
};
