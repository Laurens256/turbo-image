import type { ImageMime } from '$types';

export const EXT_TO_DEFAULT_QUALITY: { [K in ImageMime]?: number} = {
	'image/webp': 90,
	'image/avif': 80,
	'image/jpeg': 85,
	'image/heif': 85,
};

export const LOSSY_IMAGE_MIMES: ImageMime[] = ['image/jpeg', 'image/webp', 'image/avif', 'image/heif'] as const;
