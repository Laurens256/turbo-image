<script>
	import { FileUpload } from '$components';
</script>

<div class="root">
	<div class="textContainer">
		<h1>TurboImage</h1>
		<p>Free, unlimited image conversions</p>
	</div>
	<FileUpload containerClass="bigFileUpload">
		Drag and drop your images or click to upload
	</FileUpload>
</div>

<style>
	.root {
    display: flex;
    flex-direction: column;
    gap: 1rem;
	}

  .textContainer {
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .root > :global(.bigFileUpload) {
    min-height: 15rem;
    padding: 2rem;
    text-align: center;
  }
</style>
