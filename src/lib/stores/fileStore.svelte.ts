import { type UploadedFile } from '$types';

type UploadedFiles = Record<string, UploadedFile>;

let uploadedFiles = $state<Record<string, UploadedFile>>({});

export default {
	get files() {
		return uploadedFiles;
	},
	getFile(id: string) {
		return uploadedFiles[id] as UploadedFile | undefined;
	},
	add (files: UploadedFiles) {
		uploadedFiles = { ...uploadedFiles, ...files };
	},
	remove (id: string) {
		delete uploadedFiles[id];
	},
	clear () {
		uploadedFiles = {};
	},
	updateSettings (id: string, settings: Partial<UploadedFile>) {
		const entry = uploadedFiles[id];

		if (!uploadedFiles[id]) {
			return;
		}

		uploadedFiles[id] = {
			...entry,
			...settings,
		};
	},
	updateAllSettings (settings: Partial<UploadedFile>) {
		for (const id in uploadedFiles) {
			this.updateSettings(id, settings);
		}
	},
};
