const getFilesFromDirectoryHandle = async (directory: FileSystemDirectoryHandle, path = '') => {
	const entries = directory.values();
	const files: { [path: string]: Promise<File> } = {};

	for await (const entry of entries) {
		const fullPath = path ? `${path}/${entry.name}` : entry.name;
		if (entry.kind === 'file') {
			files[fullPath] = entry.getFile();
		} else if (entry.kind === 'directory') {
			const nestedFiles = await getFilesFromDirectoryHandle(entry, fullPath);
			Object.assign(files, nestedFiles);
		}
	}

	return files;
};

export default getFilesFromDirectoryHandle;
