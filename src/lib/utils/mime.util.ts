import type { ArchiveMime, ImageMime } from '$types';

const imageMimetypeToExtMap: Record<ImageMime, string[]> = {
	'image/jpeg': ['jpg', 'jpeg', 'jpe', 'jif', 'jfif', 'jfi'],
	'image/png': ['png'],
	'image/webp': ['webp'],
	'image/apng': ['apng'],
	'image/bmp': ['bmp', 'dib'],
	'image/avif': ['avif'],
	'image/gif': ['gif'],
	'image/tiff': ['tif', 'tiff'],
	'image/x-icon': ['ico', 'cur'],
	'image/heif': ['heif', 'heic'],
} as const;

const archiveMimetypeToExtMap: Record<ArchiveMime, string[]> = {
	'application/gzip': ['gz', 'gzip'],
	'application/zip': ['zip'],
};

const getExtensionByMimetype = <
	Mime extends string,
	Map extends Record<string, string[]>,
	IncludeAll extends boolean = false
>(mime: Mime, map: Map, includeAll: IncludeAll = false as IncludeAll) => {
	type ReturnValue = Mime extends keyof Map
		? IncludeAll extends true ? string[] : string
		: IncludeAll extends true ? string[] : string | undefined;

	const extensions = map[mime as keyof Map];

	if (!extensions) {
		return undefined as ReturnValue;
	}

	return (includeAll ? extensions : extensions[0]) as ReturnValue;
};

const getImageExtensionByMimetype = <Mime extends string = ImageMime, IncludeAll extends boolean = false>(
	mime: Mime,
	includeAll: IncludeAll = false as IncludeAll,
) => getExtensionByMimetype(mime, imageMimetypeToExtMap, includeAll);

const getArchiveExtensionByMimetype = <Mime extends string = ArchiveMime, IncludeAll extends boolean = false>(
	mime: Mime,
	includeAll: IncludeAll = false as IncludeAll,
) => getExtensionByMimetype(mime, archiveMimetypeToExtMap, includeAll);

const getImageMimetypeByExtension = (ext: string) => {
	for (const [mimetype, extensions] of Object.entries(imageMimetypeToExtMap)) {
		if (extensions.includes(ext)) {
			return mimetype as ImageMime;
		}
	}

	return null;
};

export default {
	getImageExtensionByMimetype,
	getArchiveExtensionByMimetype,
	getImageMimetypeByExtension,
};
