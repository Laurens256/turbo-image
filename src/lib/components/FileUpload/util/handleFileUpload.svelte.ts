import { appSettingsStore, fileStore, unsupportedFilesStore } from '$stores';
import type { ArchiveMime, ImageMime, UploadedFile } from '$types';
import { EXT_TO_DEFAULT_QUALITY } from '$constants';
import { supportedFormatsStore } from '$stores';
import unzipFile from './unzipFile.svelte';

const getSupportedFiles = async (files: File[]) => {
	const filesToUpload: File[] = [];
	const filesToNotUpload: string[] = [];

	for (const file of files) {
		if (supportedFormatsStore.imageInputs.includes(file.type as ImageMime)) {
			filesToUpload.push(file);
		} else if (supportedFormatsStore.archiveInputs.includes(file.type as ArchiveMime)) {
			const { files, filteredFiles } = await unzipFile(file);
			filesToUpload.push(...files);
			filesToNotUpload.push(...filteredFiles);
		} else {
			filesToNotUpload.push(file.name);
		}
	}

	return { filesToUpload, filesToNotUpload };
};

const handleFileUpload = async (files: File[]) => {
	const { filesToUpload, filesToNotUpload } = await getSupportedFiles(files);

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

	unsupportedFilesStore.add(filesToNotUpload);
	fileStore.add(newFiles);
};

export default handleFileUpload;
