import type { ImageExt } from '$types';

const SUPPORTED_ARCHIVE_MIMES = ['application/zip', 'application/gzip'];

const EXT_TO_DEFAULT_QUALITY: {[K in ImageExt]?: number} = {
	'webp': 90,
	'jpg': 85,
};

export {
	SUPPORTED_ARCHIVE_MIMES,
	EXT_TO_DEFAULT_QUALITY,
};
