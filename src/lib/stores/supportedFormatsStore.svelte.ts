import type { ImageExt } from '$types';

let imageOutputs = $state<ImageExt[]>(['png', 'jpg', 'webp']);

const imageMimes: Record<string, ImageExt> = {
	'image/png': 'png',
	'image/jpeg': 'jpg',
	'image/webp': 'webp',
};

export default {
	get imageOutputs() {
		return imageOutputs;
	},
	testImageOutputs () {
		const canvas = document.createElement('canvas');

		for (const [mime, ext] of Object.entries(imageMimes)) {
			const url = canvas.toDataURL(mime);
			if (!url.startsWith(`data:${mime}`)) {
				imageOutputs = imageOutputs.filter((output) => output !== ext);
			}
		}
	},
};
