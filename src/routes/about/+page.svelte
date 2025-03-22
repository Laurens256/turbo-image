<script lang="ts">
	import { Accordion } from './components';
</script>

<main class="root">
	<h1>About TurboImage</h1>

	<p class="description">
		TurboImage is a <i>client-side</i> image converter.
		This means that none of the files you upload are sent to a server.
		All processing is done on and by your device.
	</p>

	<div>
		<Accordion title="What image formats can I upload?">
			<p>
				Any image format that your browser supports. For more information on specific image formats, check out
				<a href="https://caniuse.com/" rel="noopener noreferrer" target="_blank">Can I use?</a>.
			</p>
		</Accordion>

		<Accordion title="How does it work?">
			<p>
				TurboImage uses the Canvas API to convert images.
				This means that the supported image formats are limited to those supported by your browser.
			</p>
		</Accordion>

		<Accordion title="What to do if my browser is lagging?">
			<p>
				Try setting batching to a lower value in the settings.
				This will reduce the number of images processed at once.
				You can set batching to 0 to only process one image at a time.
			</p>
		</Accordion>

		<Accordion title="What browser does TurboImage work best in?">
			<p>
				TurboImage works best in the latest version of Chrome (or other recent Chromium-based browsers).
				Sorry Firefox bros
			</p>
		</Accordion>
	</div>
</main>

<style>
	.root {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
    padding-top: min(8vh, 7.5rem);
		width: min(100%, 40rem);
    margin-inline: auto;
	}
  .description {
    font-size: 0.9rem;
  }
</style>
