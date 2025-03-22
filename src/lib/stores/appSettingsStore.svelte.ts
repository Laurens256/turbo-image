import type { AppSettings } from '$types';

const DEFAULT_APP_STATE: AppSettings = {
	batchSizeMB: 30,
	preferredImageExt: 'png',
};
const LOCAL_STORAGE_KEY = 'appSettings';

let appSettings = $state<AppSettings>(DEFAULT_APP_STATE);

const saveAppSettings = (newValue: AppSettings) => {
	window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
};

export default {
	get settings() {
		return appSettings;
	},
	update: (newSettings: Partial<AppSettings>) => {
		const newValue = { ...appSettings, ...newSettings };
		appSettings = newValue;
		saveAppSettings(newValue);
	},
	reset() {
		const newValue = { ...DEFAULT_APP_STATE };
		saveAppSettings(newValue);
		return newValue;
	},
	setAppSettingsFromStorage() {
		const storedSettings = window.localStorage.getItem(LOCAL_STORAGE_KEY);
		if (storedSettings) {
			appSettings = JSON.parse(storedSettings);
		} else {
			saveAppSettings(appSettings);
		}
	},
};
