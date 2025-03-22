type ImageExt = 'jpg' | 'png' | 'webp';

type UploadedFile = {
  file: File;
	outputExt: ImageExt;
	quality?: number | null;
	newName?: string;
	id: string;
};

type DownloadState = 'idle' | 'loading' | 'error' | 'done';

export type {
	ImageExt,
	UploadedFile,
	DownloadState,
};
