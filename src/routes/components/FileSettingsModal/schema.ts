import type { UploadedFile } from '$types';
import { object, string, number, type ZodType } from 'zod';

const invalidRangeMessage = 'Quality must be between 0 and 100';

type InputFields = Pick<UploadedFile, 'quality' | 'newName'>;

export const schema: ZodType<InputFields> = object({
	newName: string().optional(),
	quality: number({ message: invalidRangeMessage })
		.min(0, { message: invalidRangeMessage })
		.max(100, { message: invalidRangeMessage })
		.optional().nullable(),
});
