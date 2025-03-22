<script lang="ts">
	import type { Snippet } from 'svelte';
	import { IconChevronDown } from '@tabler/icons-svelte';

	type Props = {
		title: string;
		children: Snippet;
	};

	const { title, children }: Props = $props();
</script>

<details class="details">
	<summary class="summary" tabindex="0">
		{title}
		<IconChevronDown size={24} class="chevron" />
	</summary>
	<div class="detailsInner">
		{@render children()}
	</div>
</details>

<style>
  .details {
    --padding-inline: 0.75rem;
    --outer-radius: 0.3rem;
		line-height: 1.75;

    .summary {
      cursor: pointer;
      background-color: var(--background-button);
      padding: 0.4rem var(--padding-inline);
      transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
      border: 1px solid transparent;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &:hover, &:focus-visible {
        background-color: var(--background-button-hover);
        border-color: var(--highlight-button);
      }

      &::marker {
        content: none;
      }
      & :global(.chevron) {
        transition: rotate 0.15s ease;
      }
    }
    &[open] .summary :global(.chevron) {
      rotate: 180deg;
    }
    &:first-of-type .summary {
      border-top-left-radius: var(--outer-radius);
      border-top-right-radius: var(--outer-radius);
    }
    &:last-of-type .summary {
      border-bottom-left-radius: var(--outer-radius);
      border-bottom-right-radius: var(--outer-radius);
    }

    & .detailsInner {
      padding: 0.25rem var(--padding-inline) 1rem;
      font-size: 0.9rem;
    }
  }
</style>
