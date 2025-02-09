import { type UploadedFile } from '$types';
import { imageUtil } from '$utils';
import { showSaveFilePicker } from 'native-file-system-adapter';
import { appSettingsStore, erroredFilesStore } from '$stores';
import { Zip, ZipPassThrough } from 'fflate';

const createBatchesBySize = (inputArr: UploadedFile[]) => {
	const batchSizeMB = appSettingsStore.settings.batchSizeMB;
	const maxBatchSizeBytes = batchSizeMB * 1024 * 1024;

	let currentBatchSize = 0;
	let currentBatch = [];
	const batches = [];

	for (const input of inputArr) {
		const fileSize = input.file.size;

		if (currentBatchSize + fileSize > maxBatchSizeBytes && currentBatch.length > 0) {
			batches.push(currentBatch);
			currentBatch = [];
			currentBatchSize = 0;
		}

		currentBatch.push(input);
		currentBatchSize += fileSize;
	}

	if (currentBatch.length > 0) {
		batches.push(currentBatch);
	}

	return batches;
};

const createWritableStream = async (suggestedName: string) => {
	const fileHandle = await showSaveFilePicker({ suggestedName });
	return await fileHandle.createWritable();
};

const downloadFiles = async (
	files: UploadedFile[],
	counterCallback?: (count: number) => void,
) => {
	if (files.length > 1) {
		const erroredFiles: string[] = [];
		const batches = createBatchesBySize(files);
		const imageGenerator = imageUtil.createImageGenerator(batches, counterCallback);
		const writableStream = await createWritableStream('images.zip');

		const zip = new Zip();
		const rs = new ReadableStream({
			start(controller) {
				zip.ondata = (err, dat, final) => {
					if (err) {
						controller.error(err);
					} else {
						controller.enqueue(dat);
						if (final) controller.close();
					}
				};
			},
		});

		rs.pipeTo(writableStream);

		let index = 0;
		for await (const imageResponse of imageGenerator) {
			if (imageResponse.status === 'rejected') {
				erroredFiles.push(files[index].file.name);
				counterCallback?.(index++);
				continue;
			}
			const convertedImage = imageResponse.value;

			const file = new ZipPassThrough(convertedImage.name);
			zip.add(file);

			const reader = convertedImage.blob.stream().getReader();
			while (true) {
				const { value, done } = await reader.read();
				if (done) {
					file.push(new Uint8Array(0), true);
					break;
				}
				file.push(value);
			}
			counterCallback?.(index++);
			await reader.cancel();
		}

		erroredFilesStore.add(erroredFiles);
		if (erroredFiles.length === files.length) {
			zip.terminate();
			throw new Error('Download failed');
		} else {
			zip.end();
		}
	} else if (files.length === 1) {
		const file = files[0];
		try {
			const convertedImage = await imageUtil.convertImage(file);
			const filename = convertedImage.name.split('/').pop() || convertedImage.name;

			const writableStream = await createWritableStream(filename);
			await convertedImage.blob.stream().pipeTo(writableStream);
		} catch (e) {
			if (!(e instanceof DOMException && e.name === 'AbortError')) {
				erroredFilesStore.add([file.file.name]);
			}
			throw e;
		}
	}
};

export default {
	downloadFiles,
};
