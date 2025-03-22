<script lang="ts">
	import { IconSettings, IconInfoCircle, IconLibraryPhoto } from '@tabler/icons-svelte';
	import { NavLink } from './components';
</script>

<nav class="root">
	<section class="section">
		<NavLink href="/" icon={IconLibraryPhoto}>
			Convert
		</NavLink>
	</section>
	<section class="section">
		<NavLink href="/about" icon={IconInfoCircle}>
			About
		</NavLink>
		<NavLink href="/settings" icon={IconSettings}>
			Settings
		</NavLink>
	</section>
</nav>

<style>
	.root {
		--border: solid 2px var(--background-secondary);
		width: var(--nav-width);
		/* background-color: var(--background-secondary); */
		border-right: var(--border);
		position: sticky;
		left: 0;
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		flex-shrink: 0;
		align-items: center;

    @media screen and (max-width: 35rem) {
			--nav-height: 4rem;
      bottom: 0;
			flex-direction: row;
			justify-content: center;
			height: var(--nav-height);
			border-top: var(--border);
			border-right: none;
    }
	}
	.section {
		display: flex;
		flex-direction: inherit;
		gap: inherit;
		height: 100%;
		width: 100%;

    @media screen and (max-width: 35rem) {
			width: auto;
    }

		&:last-of-type {
			justify-content: flex-end;
		}
	}
</style>
