import { EXT_TO_DEFAULT_QUALITY } from '$constants';
import type { UploadedFile } from '$types';
import mimeUtil from './mime.util';

const convertImage = async (input: UploadedFile) => {
	const image = new Image();
	image.src = URL.createObjectURL(input.file);

	await new Promise<void>((resolve, reject) => {
		image.onload = () => resolve();
		image.onerror = (e) => {
			console.error(e);
			reject(e);
		};
	});

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) {
		throw new Error('Could not get 2d context');
	}

	canvas.width = image.width;
	canvas.height = image.height;
	ctx.drawImage(image, 0, 0);

	const quality = typeof input.quality === 'number'
		? input.quality / 100
		: EXT_TO_DEFAULT_QUALITY[input.outputMime];

	const blob = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob((blob) => resolve(blob), input.outputMime, quality),
	);
	URL.revokeObjectURL(image.src);

	if (!blob) {
		throw new Error('Could not create blob');
	}
	const filename = input.newName || input.file.name.split('.').slice(0, -1).join('.');
	const outputExt = mimeUtil.getImageExtensionByMimetype(input.outputMime);

	return {
		name: `${filename}.${outputExt}`,
		blob,
	};
};

const createImageGenerator = async function* (
	imageBatches: UploadedFile[][],
	counterCallback: ((count: number) => void) | undefined,
) {
	let index = 0;
	for (const batch of imageBatches) {
		const promises = batch.map((input) => convertImage(input));
		const results = await Promise.allSettled(promises);

		if (counterCallback) {
			index += results.length;
			counterCallback(index);
		}

		for (const result of results) {
			yield result;
		}
	}
};

export default {
	convertImage,
	createImageGenerator,
};
