import { type UploadedFile } from '$types';
import { imageUtil, stringUtil } from '$utils';
import { showSaveFilePicker } from 'native-file-system-adapter';
import { appSettingsStore } from '$stores';
import { Zip, ZipPassThrough } from 'fflate';
import { downloadStore } from '$stores';

const MAX_BATCH_SIZE_N = 250;

const createBatchesBySize = (inputArr: UploadedFile[]) => {
	const batchSizeMB = appSettingsStore.settings.batchSizeMB;
	const maxBatchSizeBytes = batchSizeMB * 1024 * 1024;

	let currentBatchSize = 0;
	let currentBatch = [];
	const batches = [];

	for (const input of inputArr) {
		const fileSize = input.file.size;

		if (
			(currentBatchSize + fileSize > maxBatchSizeBytes
			&& currentBatch.length > 0)
			|| currentBatch.length >= MAX_BATCH_SIZE_N
		) {
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
) => {
	downloadStore.idsToDownload = files.map(({ id }) => id);

	if (files.length > 1) {
		const batches = createBatchesBySize(files);
		const imageGenerator = imageUtil.createImageGenerator(batches);
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

		downloadStore.startTimer();
		for await (const imageResponse of imageGenerator) {
			const id = files[downloadStore.completedCount].id;

			if (imageResponse.status === 'rejected') {
				downloadStore.addFailedId(id);
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
			await reader.cancel();

			downloadStore.addSuccessId(id);
		}

		if (downloadStore.failedCount === downloadStore.totalCount) {
			zip.terminate();
		} else {
			zip.end();
		}

		downloadStore.endTimer();
	} else if (files.length === 1) {
		const file = files[0];
		try {
			const filename = file.newName || stringUtil.getFilenameWithoutExtension(file.file.name);
			const writableStream = await createWritableStream(`${filename}.${file.outputExt}`);

			downloadStore.startTimer();

			const convertedImage = await imageUtil.convertImage(file);

			await convertedImage.blob.stream().pipeTo(writableStream);

			downloadStore.addSuccessId(file.id);
			downloadStore.endTimer();
		} catch (e) {
			if (e instanceof DOMException && e.name === 'AbortError') {
				downloadStore.reset();
			} else {
				downloadStore.addFailedId(file.id);
			}
		}
	}
};

export default {
	downloadFiles,
};
