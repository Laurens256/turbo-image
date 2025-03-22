type WithLoader = <T extends (...args: any[]) => any>(cb: T) => (...args: Parameters<T>) => Promise<ReturnType<T>>;

export type {
	WithLoader,
};
