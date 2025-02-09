let erroredFiles = $state<string[]>([]);

export default {
	get files () {
		return erroredFiles;
	},
	set files (newErroredFiles) {
		erroredFiles = newErroredFiles;
	},
	add (newErroredFiles: string[]) {
		erroredFiles.push(...newErroredFiles);
	},
	clear () {
		erroredFiles = [];
	},
};
