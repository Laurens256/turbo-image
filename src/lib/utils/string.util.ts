type PluralizeProps = {
	count: number;
	singular: string;
	plural?: string;
	includeCount?: boolean;
};
const pluralize = ({ count, singular, plural = `${singular}s`, includeCount = true }: PluralizeProps) => {
	const word = count === 1 ? singular : plural;
	return includeCount ? `${count} ${word}` : word;
};

const getFilenameWithoutExtension = (filename: string) => {
	const lastDotIndex = filename.lastIndexOf('.');
	return lastDotIndex === -1 ? filename : filename.slice(0, lastDotIndex);
};

export default {
	pluralize,
	getFilenameWithoutExtension,
};
