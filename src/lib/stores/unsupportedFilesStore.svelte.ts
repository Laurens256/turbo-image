let unsupportedFiles = $state<string[]>([]);

export default {
	get files() {
		return unsupportedFiles;
	},
	set files(files) {
		unsupportedFiles = files;
	},
	add (files: string[]) {
		unsupportedFiles = [...unsupportedFiles, ...files];
	},
	clear () {
		unsupportedFiles = [];
	},
};
