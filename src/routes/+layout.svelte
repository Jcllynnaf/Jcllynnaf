<script lang="ts">
	import favicon from '$lib/assets/swan.webp';
	import '../app.css';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	let { children } = $props();

	onMount(() => {
		// 1. Setup Lenis (Smooth Scroll)
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing "Exponential" (Khas Premium)
			orientation: 'vertical', 
			gestureOrientation: 'vertical',
			smoothWheel: true,
			touchMultiplier: 2,
		});

		// 2. Sambungkan Lenis ke GSAP
		lenis.on('scroll', ScrollTrigger.update);

		gsap.ticker.add((time) => {
			lenis.raf(time * 1000);
		});

		gsap.ticker.lagSmoothing(0);
	});
</script>

<svelte:head>
    <title>Jcllynnaf</title>
    
    <meta name="description" content="Hi i'm Justin this page is just to show music from my favorite artists Wisp" />
    
    <meta name="keywords" content="Wisp, Shoegaze, Music, Tangled Dreams, Your Face, Fanbase, Website" />
    
    <meta property="og:title" content="SWORD PROJECT" />
    <meta property="og:description" content="Explore the dreamy world of Wisp." />
    <meta property="og:image" content="https://jcllynnaf.my.id/swan.webp" /> <meta property="og:url" content="https://jcllynnaf.my.id" />
</svelte:head>

{@render children()}

<style>
    /* :global(*) artinya berlaku untuk seluruh elemen di website */
    :global(*) {
        /* 1. Mencegah Teks Di-blok / Disalin */
        -webkit-user-select: none; /* Chrome/Safari/Opera */
        -moz-user-select: none;    /* Firefox */
        -ms-user-select: none;     /* IE/Edge */
        user-select: none;         /* Standar Modern */

        /* 2. Menghilangkan Kotak Biru saat di-Tap di HP (Android/iOS) */
        -webkit-tap-highlight-color: transparent;
        outline: none;
    }

    /* PENTING: PENGECUALIAN */
    /* Kita harus izinkan user ngetik di kolom Input & Komentar */
    :global(input), :global(textarea) {
        -webkit-user-select: text !important;
        user-select: text !important;
        /* Kembalikan cursor mengetik */
        cursor: text; 
    }
</style>