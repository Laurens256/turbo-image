import 'native-file-system-adapter'; // polyfill for getAsFileSystemHandle

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

const getFilesFromDataTransferItemList = async (items: DataTransferItemList | undefined) => {
	const filePromises = Array.from(items || []).map(async (item) => {
		try {
			const handle = await item.getAsFileSystemHandle();
			if (!handle) {
				return [];
			}

			if (handle.kind === 'directory') {
				const files = await getFilesFromDirectoryHandle(handle as FileSystemDirectoryHandle);
				return Promise.all(Object.entries(files).map(async ([path, filePromise]) => {
					const file = await filePromise;
					return new File([file], path, { type: file.type });
				}));
			} else if (handle.kind === 'file') {
				return (handle as FileSystemFileHandle).getFile();
			}

			return [];
		} catch {
			return [];
		}
	});

	return (await Promise.all(filePromises)).flat();
};

export default getFilesFromDataTransferItemList;
