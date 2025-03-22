import { appSettingsStore, fileStore, unsupportedFilesStore } from '$stores';
import type { UploadedFile } from '$types';
import { EXT_TO_DEFAULT_QUALITY, SUPPORTED_ARCHIVE_MIMES } from '$constants';
import getFilesFromArchive from './getFilesFromArchive';

const getSupportedFiles = async (files: File[]) => {
	const filesToUpload: File[] = [];
	const filesToNotUpload: string[] = [];

	const filesToLoop: File[] = files;
	let filesToLoopLength = filesToLoop.length;

	for (let i = 0; i < filesToLoopLength; i++) {
		const file = filesToLoop[i];

		if (SUPPORTED_ARCHIVE_MIMES.includes(file.type)) {
			// prefix path with nested structure (if applicable)
			let basePath = '';
			const pathParts = file.name.split('/');
			if (pathParts.length > 1) {
				basePath = pathParts.slice(0, -1).join('/');
			}
			const files = await getFilesFromArchive(file, basePath);

			filesToLoop.push(...files);
			filesToLoopLength = filesToLoop.length;
		} else if (file.type.startsWith('image/')) {
			filesToUpload.push(file);
		} else {
			filesToNotUpload.push(file.name);
		}
	}

	return { filesToUpload, filesToNotUpload };
};

const handleFileUpload = async (files: File[]) => {
	const { filesToUpload, filesToNotUpload } = await getSupportedFiles(files);

	const newFiles: Record<string, UploadedFile> = Object.fromEntries(filesToUpload.map((file) => {
		const outputExt = appSettingsStore.settings.preferredImageExt;
		const id = crypto.randomUUID();

		return [
			id,
			{
				file,
				outputExt,
				quality: EXT_TO_DEFAULT_QUALITY[outputExt],
				id,
			},
		];
	}));

	unsupportedFilesStore.add(filesToNotUpload);
	fileStore.add(newFiles);
};

export default handleFileUpload;
