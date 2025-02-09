export type ImageMime =
| 'image/jpeg'
| 'image/png'
| 'image/webp'
| 'image/apng'
| 'image/bmp'
| 'image/avif'
| 'image/gif'
| 'image/tiff'
| 'image/x-icon'
| 'image/heif';

export type ArchiveMime =
| 'application/zip'
| 'application/gzip';

export type UploadedFile = {
  file: File;
  outputMime: ImageMime;
	quality?: number | null;
	newName?: string;
};
