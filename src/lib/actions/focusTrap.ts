import type { Action } from 'svelte/action';

import { onMount } from 'svelte';

type FocusTrapProps = {
	isActive: boolean;
	onClose?: () => void;
	withDynamicFocusElements?: boolean;
	closeOnEscape?: boolean;
	closeOnOutsideClick?: boolean;
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

const focusTrap: Action<HTMLElement, FocusTrapProps> = (node, {
	isActive: isInitialActive, onClose, withDynamicFocusElements, closeOnEscape = true, closeOnOutsideClick = true,
}: FocusTrapProps) => {
	let focusedBeforeTrap = document.activeElement;
	let focusable = searchFocusable(node);

	const handleDocumentClick = (e: MouseEvent) => {
		if (node && onClose && !node.contains(e.target as Node)) {
			e.stopPropagation();
			onClose();
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		const { key, shiftKey, target } = e;

		if (!['Escape', 'Tab'].includes(key)) return;

		if (key === 'Tab') {
			if (withDynamicFocusElements) focusable = searchFocusable(node);
			const firstElement = focusable[0];
			const lastElement = focusable[focusable.length - 1];

			if (!shiftKey && target === lastElement) {
				e.preventDefault();
				firstElement.focus();
			} else if (shiftKey && target === firstElement) {
				e.preventDefault();
				lastElement.focus();
			}
		} else if (key === 'Escape' && closeOnEscape && onClose) {
			e.stopPropagation();
			onClose();
		}
	};

	const handleDestroy = () => {
		node.removeEventListener('keydown', handleKeyDown);

		if (closeOnOutsideClick) {
			document.removeEventListener('click', handleDocumentClick);
		}
		if (focusedBeforeTrap instanceof HTMLElement) {
			focusedBeforeTrap.focus();
		}
	};

	const handleUpdate = (isUpdatedActive?: boolean) => {
		if (isUpdatedActive ?? isInitialActive) {
			node.addEventListener('keydown', handleKeyDown);
			focusedBeforeTrap = document.activeElement;

			setTimeout(() => {
				// make sure we set click event listener and focus after initial click is finished
				if (closeOnOutsideClick) {
					document.addEventListener('click', handleDocumentClick);
				}
				focusable[0]?.focus();
			}, 0);
		} else {
			handleDestroy();
		}
	};

	// update is not called on mount so need to call manually
	onMount(() => { handleUpdate(); });

	return {
		update: ({ isActive }) => handleUpdate(isActive),
		destroy: handleDestroy,
	};
};

export default focusTrap;
