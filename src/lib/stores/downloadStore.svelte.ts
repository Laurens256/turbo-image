import type { DownloadState } from '$types';

class DownloadStore {
	private _failedIds = $state<string[]>([]);
	private _failedCount = $derived(this._failedIds.length);

	private _downloadedIds = $state<string[]>([]);
	private _successCount = $derived(this._downloadedIds.length);

	private _completedCount = $derived(this._failedCount + this._successCount);

	private _idsToDownload = $state<string[]>([]);
	private _totalCount = $derived(this._idsToDownload.length);

	private timerStart = 0;
	private _durationSeconds = $state(0);

	private _downloadState = $derived.by<DownloadState>(() => {
		if (!this._totalCount) {
			return 'idle';
		}
		if (this._failedCount === this._totalCount) {
			return 'error';
		}
		if (this._completedCount === this._totalCount) {
			return 'done';
		}
		return 'loading';
	});

	public reset() {
		this._failedIds = [];
		// this._successCount = 0;
		this._downloadedIds = [];
		this._idsToDownload = [];
		this._durationSeconds = 0;
	}

	public addFailedId(id: string) {
		this._failedIds.push(id);
	}

	public addSuccessId(id: string) {
		this._downloadedIds.push(id);
	}
	get successCount() {
		return this._successCount;
	}

	set idsToDownload(ids: string[]) {
		this._idsToDownload = ids;
	}
	get totalCount() {
		return this._totalCount;
	}

	get failedIds() {
		return this._failedIds;
	}
	get failedCount() {
		return this._failedCount;
	}

	get completedCount() {
		return this._completedCount;
	}

	public startTimer() {
		this.timerStart = performance.now();
	}
	public endTimer() {
		const duration = (performance.now() - this.timerStart) / 1000;
		this._durationSeconds = Math.round(duration * 1000) / 1000;
	}
	get durationSeconds() {
		return this._durationSeconds;
	}

	get downloadState() {
		return this._downloadState;
	}

	public getFileDownloadState(id: string): DownloadState {
		if (!this._totalCount) {
			return 'idle';
		}
		if (this._downloadedIds.includes(id)) {
			return 'done';
		}
		if (this._failedIds.includes(id)) {
			return 'error';
		}
		return 'loading';
	}
}

export default new DownloadStore();
