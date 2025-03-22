import type { UploadedFile } from '$types';

type FormValues = Partial<Pick<UploadedFile, 'quality' | 'outputExt'>>;

export type {
	FormValues,
};
