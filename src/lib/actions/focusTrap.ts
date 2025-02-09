// ! SOURCE: https://gist.github.com/JulienPradet/20dbb7ca06cbd9e2ec499bb2206aab55

import type { Action } from 'svelte/action';

type FocusTrapProps = {
	isActive: boolean;
	onClose: () => void;
	returnElement?: HTMLElement | null;
};

const searchFocusable = (node: HTMLElement) => {
	return node.querySelectorAll(
		`a[href],
		area[href],
		input:not([disabled]),
		select:not([disabled]),
		textarea:not([disabled]),
		button:not([disabled]),
		iframe,
		object,
		embed,
		[tabindex],
		[contenteditable]`,
	) as NodeListOf<HTMLElement>;
};

const focusTrap: Action<HTMLElement, FocusTrapProps> = (node, { returnElement }) => {
	let parentNode: HTMLElement | null = null;
	let disableTrap: (() => void) | null = null;

	const onDocumentKeyDown = (event: KeyboardEvent) => {
		if (!parentNode) return;

		const { key, shiftKey } = event;

		const isNext = key === 'Tab' && !shiftKey;
		const isPrevious = key === 'Tab' && shiftKey;
		const isEscape = key === 'Escape';

		const focusableElements = searchFocusable(parentNode);

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		if (isNext && event.target === lastElement) {
			event.preventDefault();
			firstElement.focus();
		} else if (isPrevious && event.target === firstElement) {
			event.preventDefault();
			lastElement.focus();
		} else if (isEscape && disableTrap) {
			disableTrap();
			event.stopPropagation();
		}
	};

	const onDocumentClick = (event: MouseEvent) => {
		if (parentNode && disableTrap && !parentNode.contains(event.target as Node)) {
			disableTrap();
		}
	};

	const onDestroy = () => {
		returnElement?.focus();
		parentNode = null;
		disableTrap = null;
		document.removeEventListener('keydown', onDocumentKeyDown);
		document.removeEventListener('click', onDocumentClick);

		setTimeout(() => {
			returnElement?.focus();
		}, 0);
	};

	return {
		update: ({ isActive, onClose }: FocusTrapProps) => {
			if (isActive) {
				parentNode = node;
				disableTrap = onClose;
				document.addEventListener('keydown', onDocumentKeyDown);

				setTimeout(() => {
					searchFocusable(node)[0]?.focus();
					document.addEventListener('click', onDocumentClick);
				}, 0);
			} else {
				onDestroy();
			}
		},
		destroy: onDestroy,
	};
};

export default focusTrap;
