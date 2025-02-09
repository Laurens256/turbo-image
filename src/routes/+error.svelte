<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	$effect(() => {
		if (page.status === 404) {
			goto('/', { replaceState: true });
		}
	});
</script>

<main class="root">
	<h1>{page.error?.message}</h1>
	<a href="/">Back to home</a>
</main>

<style>
	.root {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		gap: 1rem;
		height: 100vh;
	}
</style>
