import type { UploadedFile } from '$types';

type FormValues = Partial<Pick<UploadedFile, 'newName' | 'outputExt' | 'quality'>>;

export type {
	FormValues,
};
