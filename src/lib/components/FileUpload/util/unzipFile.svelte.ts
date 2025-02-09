import { supportedFormatsStore } from '$stores';
import type { ArchiveMime, ImageMime } from '$types';
import { type Unzipped, unzip } from 'fflate';
import { fileTypeFromBuffer } from 'file-type';

const isValidImageMime = (mimetype: string): mimetype is ImageMime => {
	return supportedFormatsStore.imageInputs.includes(mimetype as ImageMime);
};
const isValidArchiveMime = (mimetype: string): mimetype is ArchiveMime => {
	return supportedFormatsStore.archiveInputs.includes(mimetype as ArchiveMime);
};

const unzipData = async (
	zipData: Uint8Array,
	basePath = '',
): Promise<{ files: File[]; filteredFiles: string[] }> => {
	const filesUint8 = await new Promise<Unzipped>((resolve, reject) =>
		unzip(zipData, (err, result) => (err ? reject(err) : resolve(result))),
	);

	const files: File[] = [];
	const filteredFiles: string[] = [];

	for (const [name, data] of Object.entries(filesUint8)) {
		const fullPath = basePath ? `${basePath}/${name}` : name;
		const fileType = await fileTypeFromBuffer(data);

		if (!fileType) {
			filteredFiles.push(fullPath);
			continue;
		}

		const { mime } = fileType;

		if (isValidImageMime(mime)) {
			const blob = new Blob([data]);
			files.push(new File([blob], fullPath, { type: mime }));
		} else if (isValidArchiveMime(mime)) {
			const pathWithoutArchive = fullPath.split('/').shift();
			const { files: nestedFiles, filteredFiles: nestedFilteredFiles } = await unzipData(
				data,
				pathWithoutArchive,
			);
			files.push(...nestedFiles);
			filteredFiles.push(...nestedFilteredFiles);
		} else if (!fullPath.endsWith('/')) {
			// filter out unsupported files except directories
			filteredFiles.push(fullPath);
		}
	}

	return { files, filteredFiles };
};

const unzipFile = async (file: File) => {
	const zipData = new Uint8Array(await file.arrayBuffer());
	return await unzipData(zipData);
};

export default unzipFile;
