<script lang="ts">
	export let side: 'left' | 'right' = 'left';
</script>

<div class="swan-wrapper">
	<img src="/swan-{side}.webp" alt="Swan {side}" />
</div>

<style>
	.swan-wrapper {
		width: 180px; /* Sesuaikan ukuran angsa */
		height: auto;
		opacity: 0.9;
		/* Efek halus ethereal */
		filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));
		mix-blend-mode: lighten;
	}

	img {
		width: 100%;
		height: auto;
		display: block;
		backface-visibility: hidden;
	}
</style>