// track if any dialog is open
// used to disable dropzone if a dialog is open
class DialogStore {
	private _isOpen = $state(false);

	set isOpen(isOpen) {
		this._isOpen = isOpen;
	}
	get isOpen() {
		return this._isOpen;
	}
}

export default new DialogStore();
