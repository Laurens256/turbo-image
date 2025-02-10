import { object, string, number, type ZodType } from 'zod';
import type { AppSettings } from '$types';

export const schema: ZodType<Omit<AppSettings, 'preferredImageMime'>> = object({
	batchSizeMB: number({ message: 'Must be a valid number' })
		.min(0, {
			message: 'Can\'t be negative. Set to 0 to disable batching',
		})
		.max(100, {
			message: 'Can\'t be more than 100MB',
		}),
	preferredImageMime: string(),
});
