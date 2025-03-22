<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		label: string;
		tooltip?: string;
		errors?: string[];
		parseValue?: (value: string) => string;
	} & HTMLInputAttributes;
	let { label, tooltip, errors = [], value = $bindable(), parseValue, ...rest }: Props = $props();
</script>

<div class="container">
	<label for={rest.id} class="label">
		{label}
		{#each errors as error}
			<span class="error">{error}</span>
		{/each}
	</label>
	<input
		{...rest}
		class="input"
		bind:value={
			() => value,
			(v) => value = parseValue ? parseValue(v) : v
		}
		aria-invalid={errors.length > 0}
	/>
	<span class="tooltip">{tooltip}</span>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
	.label {
		display: flex;
		flex-direction: column;
		width: fit-content;

		& .error {
			color: var(--highlight-red);
			font-size: 0.9rem;
		}
	}
	.input {
		padding: 0.25rem 0.5rem;
		border: solid 2px transparent;
		background-color: var(--background-button);
		border-radius: 0.5rem;
		width: min(100%, 15rem);

		&[aria-invalid="true"] {
			border-color: var(--highlight-red);
		}

		&[type="number"] {
			appearance: textfield;
			-moz-appearance: textfield;

			&::-webkit-inner-spin-button,
			&::-webkit-outer-spin-button {
				-webkit-appearance: none;
				margin: 0;
			}
		}
		&:focus {
			outline: 0;
			border-color: var(--highlight-purple);
		}
	}
	.tooltip {
		font-size: 0.8rem;
		color: var(--text-secondary);
		margin-top: 0.1rem;
	}
</style>
