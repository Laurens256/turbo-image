import type { ImageExt, UploadedFile } from '$types';
import { EXT_TO_DEFAULT_QUALITY } from '$constants';
import { stringUtil } from '$utils/index';

const EXT_TO_MIME: Record<ImageExt, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	webp: 'image/webp',
};

const convertImage = async (input: UploadedFile, _ctx?: CanvasRenderingContext2D | null) => {
	const image = new Image();
	const objectURL = URL.createObjectURL(input.file);
	image.src = objectURL;

	await new Promise<void>((resolve, reject) => {
		image.onload = () => {
			URL.revokeObjectURL(objectURL);
			resolve();
		};
		image.onerror = () => {
			URL.revokeObjectURL(objectURL);
			reject();
		};
	});

	const ctx = _ctx || document.createElement('canvas').getContext('2d');

	if (!ctx) {
		throw new Error('Could not get 2d context');
	}

	const { outputExt, quality, newName, file } = input;

	ctx.canvas.width = image.width;
	ctx.canvas.height = image.height;

	ctx.drawImage(image, 0, 0);

	const parsedQuality = typeof quality === 'number'
		? quality / 100
		: EXT_TO_DEFAULT_QUALITY[input.outputExt];

	const blob = await new Promise<Blob | null>((resolve) =>
		ctx.canvas.toBlob((blob) => resolve(blob), EXT_TO_MIME[outputExt], parsedQuality),
	);

	if (!blob) {
		throw new Error('Could not create blob');
	}
	const filename = newName || stringUtil.getFilenameWithoutExtension(file.name);

	return {
		name: `${filename}.${outputExt}`,
		blob,
	};
};

const createImageGenerator = async function* (
	imageBatches: UploadedFile[][],
) {
	const ctxPool = imageBatches[0].map(() =>
		document.createElement('canvas').getContext('2d', { willReadFrequently: true }),
	);

	for (const batch of imageBatches) {
		const promises = batch.map((input, i) => convertImage(input, ctxPool[i]));
		const results = await Promise.allSettled(promises);

		for (const result of results) {
			yield result;
		}
	}
};

export default {
	convertImage,
	createImageGenerator,
};
