<script lang="ts">
	export let opacity = 1;
</script>

<div class="blade-wrapper" style="opacity: {opacity}">
	<img src="/blade.webp" alt="The Blade" /> 
</div>

<style>
	.blade-wrapper {
		position: relative;
		/* Ukuran dasar diperkecil sedikit agar scalar di parent lebih efektif */
		width: 100px; 
		height: auto;
		z-index: 20;
		mix-blend-mode: screen; /* Agar menyatu dengan gradient baru */
	}

	img {
		width: 100%;
		height: auto;
		display: block;
		backface-visibility: hidden;
	}
</style>