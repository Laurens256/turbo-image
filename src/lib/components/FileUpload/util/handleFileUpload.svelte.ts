import { appSettingsStore, fileStore, unsupportedFilesStore } from '$stores';
import type { ArchiveMime, ImageMime, UploadedFile } from '$types';
import { EXT_TO_DEFAULT_QUALITY } from '$constants';
import { supportedFormatsStore } from '$stores';
import getFilesFromArchive from './getFilesFromArchive';

const getSupportedFiles = async (files: File[]) => {
	const filesToUpload: File[] = [];
	const fileNamesToNotUpload: string[] = [];

	const filesToLoop: File[] = files;
	let filesToLoopLength = filesToLoop.length;

	for (let i = 0; i < filesToLoopLength; i++) {
		const file = filesToLoop[i];

		if (supportedFormatsStore.imageInputs.includes(file.type as ImageMime)) {
			filesToUpload.push(file);
		} else if (supportedFormatsStore.archiveInputs.includes(file.type as ArchiveMime)) {
			// prefix path with nested structure (if applicable)
			let basePath = '';
			const pathParts = file.name.split('/');
			if (pathParts.length > 1) {
				basePath = pathParts.slice(0, -1).join('/');
			}
			const files = await getFilesFromArchive(file, basePath);

			filesToLoop.push(...files);
			filesToLoopLength = filesToLoop.length;
		} else {
			fileNamesToNotUpload.push(file.name || 'image');
		}
	}

	return { filesToUpload, fileNamesToNotUpload };
};

const handleFileUpload = async (files: File[]) => {
	const { filesToUpload, fileNamesToNotUpload } = await getSupportedFiles(files);

	const newFiles: Record<string, UploadedFile> = Object.fromEntries(filesToUpload.map((file) => {
		const outputMime = appSettingsStore.settings.preferredImageMime;

		return [
			crypto.randomUUID(),
			{
				file,
				outputMime,
				quality: EXT_TO_DEFAULT_QUALITY[outputMime],
			},
		];
	}));

	unsupportedFilesStore.add(fileNamesToNotUpload);
	fileStore.add(newFiles);
};

export default handleFileUpload;
