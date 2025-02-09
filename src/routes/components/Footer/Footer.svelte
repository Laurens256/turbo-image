<script lang="ts">
	import { AppSettings, AppAbout } from './components';

	const modals = {
		settings: 'settings',
		about: 'about',
	} as const;

	type Modal = typeof modals[keyof typeof modals];

	let activeModal = $state<Modal | null>(null);

	const openModal = (modal: Modal) => activeModal = modal;
	const closeModal = () => activeModal = null;
</script>

<section class="container">
	<div class="buttonsContainer">
		<button
			onclick={() => openModal(modals.about)}
		>
			About
		</button>
		<button
			onclick={() => openModal(modals.settings)}
		>
			Settings
		</button>
	</div>
</section>

<AppAbout isOpen={activeModal === modals.about} onClose={closeModal} />
<AppSettings isOpen={activeModal === modals.settings} onClose={closeModal} />

<style>
	.container {
		position: fixed;
		bottom: var(--settings-footer-bottom);
		height: var(--settings-footer-height);
	}
	.buttonsContainer {
		display: flex;
		gap: 0.5rem;
		height: 100%;
	}
</style>
