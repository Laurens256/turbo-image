<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import type { Icon as IconType } from '@tabler/icons-svelte';
	import { page } from '$app/state';

	type Props = {
		children: Snippet;
		icon?: IconType;
	} & HTMLAnchorAttributes;

	const { children, href, icon: Icon, class: className, ...rest }: Props = $props();
</script>

<a
	class={[
		className,
		'link',
		page.route.id === href && 'active',
	]}
	{href}
	{...rest}
>
	{#if Icon}
		<Icon size={20} />
	{/if}
	{@render children()}
</a>

<style>
	.link {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		align-items: center;
		justify-content: center;
		text-align: center;
		font-size: 0.65rem;
		color: var(--text-secondary);
		text-decoration: none;
		height: var(--nav-width);
		transition: background-color 0.1s ease-in-out;
		border-radius: 0.25rem;
		outline-offset: -5px;

		&.active {
			background-color: var(--text-primary);
			color: var(--background-primary)
		}

		&:not(.active):where(:hover, :focus-visible) {
			background-color: var(--highlight-button);
		}

    @media screen and (max-width: 35rem) {
      padding-block: 0;
			min-width: var(--nav-height);
			height: 100%;
    }
	}
</style>
