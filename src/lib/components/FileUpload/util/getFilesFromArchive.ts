import { type Unzipped, unzip } from 'fflate';
import { fileTypeFromBuffer } from 'file-type';

const getFilesFromArchive = async (file: File, basePath = '') => {
	const zipData = new Uint8Array(await file.arrayBuffer());

	const filesUint8 = await new Promise<Unzipped>((resolve, reject) =>
		unzip(zipData, (err, result) => (err ? reject(err) : resolve(result))),
	);

	const files: File[] = [];

	for (const [name, data] of Object.entries(filesUint8)) {
		if (!data.length) continue;

		const fullPath = basePath ? `${basePath}/${name}` : name;
		const fileType = await fileTypeFromBuffer(data);

		if (fileType) {
			const { mime } = fileType;

			const blob = new Blob([data]);
			files.push(new File([blob], fullPath, { type: mime }));
		} else {
			// fine to cast here since these will get filtered out since mime type is not valid
			files.push({ name: fullPath, type: '' } as File);
		}
	}

	return files;
};

export default getFilesFromArchive;
