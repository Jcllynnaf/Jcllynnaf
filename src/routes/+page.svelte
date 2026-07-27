<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition'; // Untuk animasi preloader hilang
	import gsap from "gsap";
	import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

	// Import Components
	import Blade from '$lib/components/Blade.svelte';
	import Swan from '$lib/components/Swan.svelte';
	import MusicHeader from '$lib/components/MusicHeader.svelte';
	import Discography from '$lib/components/Discography.svelte';
	import Playlist from '$lib/components/Playlist.svelte';
	import History from '$lib/components/History.svelte';
	import Memories from '$lib/components/Memories.svelte';
	import Contact from '$lib/components/Contact.svelte';


	gsap.registerPlugin(ScrollTrigger);

	let bladeEl: HTMLElement;
	let swanLeftEl: HTMLElement;
	let swanRightEl: HTMLElement;
	let mainStage: HTMLElement;
	let textContainer: HTMLElement;
	let headerEl: HTMLElement;
	
	// STATE PRELOADER
	let isLoading = true;
	let loadProgress = 0;
	
	let storyText = "";

	// CONFIGURATION
	const CONFIG = {
		// Desktop defaults
		bladeScale: 5,
		swanScale: 1.4,
		baseY: -100,
		swanGap: 75,
		swanY_Offset: 10,
		flyDistance: 400,
		bladeDrop: 150
	};

	onMount(() => {
    // --- TAMBAHAN BARU: RESET SCROLL KE ATAS ---
    if (history.scrollRestoration) {
        history.scrollRestoration = "manual"; // Matikan ingatan posisi scroll browser
    }
    window.scrollTo(0, 0); // Paksa loncat ke paling atas detik ini juga
    // -------------------------------------------

    const isMobile = window.innerWidth < 768;
		
		// Adjust config for mobile
		if (isMobile) {
			CONFIG.bladeScale = 5;
			CONFIG.swanScale = 1.3;
			CONFIG.swanGap = 71;
			CONFIG.flyDistance = 150;
		}

		// --- 1. SETUP POSISI AWAL (FIX: Blur Dihapus agar Jernih) ---
		// Saya menghapus 'filter: blur(10px)' agar aset langsung tajam saat muncul
		gsap.set(headerEl, { y: -30, opacity: 0 });
		gsap.set(bladeEl, { scale: CONFIG.bladeScale, y: CONFIG.baseY + 50, opacity: 0 }); 
		gsap.set(swanLeftEl, { scale: CONFIG.swanScale, x: -CONFIG.swanGap, y: CONFIG.baseY + CONFIG.swanY_Offset + 50, opacity: 0 });
		gsap.set(swanRightEl, { scale: CONFIG.swanScale, x: CONFIG.swanGap, y: CONFIG.baseY + CONFIG.swanY_Offset + 50, opacity: 0 });
		gsap.set(textContainer, { y: 30, opacity: 0 }); // Blur teks juga dihapus agar konsisten

		// Timeline Intro (Kita pause dulu, jalan setelah loading selesai)
		const introTl = gsap.timeline({ paused: true });
		
		introTl.to(headerEl, {
			y: 0, opacity: 1, duration: 1.5, ease: "power3.out"
		}, "start");

		// Elemen visual masuk (Tanpa Unblur, karena sudah jernih dari awal)
		introTl.to([bladeEl, swanLeftEl, swanRightEl], {
			opacity: 1, 
			y: (i, target) => {
				return target === bladeEl ? CONFIG.baseY : CONFIG.baseY + CONFIG.swanY_Offset;
			},
			duration: 2.5, 
			ease: "power2.out", 
			stagger: 0.15,
			
			onStart: () => { 
				storyText = "hi i'm dikaaa<br>this page is just to show<br>music from my favorite artists."; 
			}
		}, "start+=0.2");

		introTl.to(textContainer, { 
			y: 0, opacity: 1, duration: 2, ease: "power2.out" 
		}, "start+=1.0");

		// --- LOGIKA PRELOADER ---
		// Kita buat simulasi loading agar terasa premium (0% -> 100%)
		const interval = setInterval(() => {
			loadProgress += Math.floor(Math.random() * 5) + 2; // Random increment
			
			if (loadProgress >= 100) {
				loadProgress = 100;
				clearInterval(interval);
				
				// Delay sedikit di 100% sebelum hilang
				setTimeout(() => {
					isLoading = false;
					// Jalankan animasi pedang setelah preloader hilang
					setTimeout(() => introTl.play(), 500); 
				}, 800);
			}
		}, 30); // Kecepatan counter

		// --- 3. SCROLL TRANSITION ---
		const scrollTl = gsap.timeline({
			scrollTrigger: {
				trigger: ".scroll-height",
				start: "top top",
				end: "bottom center",
				scrub: 1,
			}
		});

		scrollTl
			.addLabel("diverge")
			.to(swanLeftEl, { x: -CONFIG.flyDistance, opacity: 0, duration: 3, ease: "power1.in" }, "diverge")
			.to(swanRightEl, { x: CONFIG.flyDistance, opacity: 0, duration: 3, ease: "power1.in" }, "diverge")
			.to(bladeEl, { y: CONFIG.baseY + CONFIG.bladeDrop, opacity: 0, scale: CONFIG.bladeScale * 0.9, duration: 3 }, "diverge")
			.to(textContainer, { y: -100, opacity: 0, duration: 1.5 }, "diverge")
			.to(headerEl, { opacity: 0, y: -50, duration: 2 }, "diverge");
	});
</script>

{#if isLoading}
	<div class="preloader" out:fade={{ duration: 800 }}>
		<div class="loader-content">
			<div class="loader-percent">{loadProgress}%</div>
			<div class="loader-line">
				<div class="loader-progress" style="width: {loadProgress}%"></div>
			</div>
			<div class="loader-text">LOADING</div>
		</div>
	</div>
{/if}

<main class="stage" bind:this={mainStage}>
	
	<div class="header-wrapper" bind:this={headerEl}>
		<MusicHeader />
	</div>

	<div class="story-text" bind:this={textContainer}>
		<p>{@html storyText}</p>
	</div>

	<div class="actor center-anchor" style="z-index: 1;" bind:this={bladeEl}>
		<Blade />
	</div>
	
	<div class="actor center-anchor" style="z-index: 2;" bind:this={swanLeftEl}>
		<Swan side="left" />
	</div>
	<div class="actor center-anchor" style="z-index: 2;" bind:this={swanRightEl}>
		<Swan side="right" />
	</div>

</main>

<div class="scroll-height">
	<div class="scroll-instruction">SCROLL DOWN</div>
</div>

<div class="content-layer">
	<Discography />
	<Playlist />
	<History />
	<Memories />
	<Contact />
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow-x: hidden;
		background: radial-gradient(circle at center, #1a1a1a 0%, #050505 80%);
		color: var(--c-blade);
	}

	/* --- STYLE PRELOADER --- */
	.preloader {
		position: fixed;
		top: 0; left: 0; width: 100vw; height: 100vh;
		background-color: #000; /* Hitam pekat */
		z-index: 9999; /* Paling depan */
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
	}

	.loader-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		width: 200px;
	}

	.loader-percent {
		font-family: monospace; /* Font teknikal */
		font-size: 2rem;
		color: #fff;
		font-weight: bold;
	}

	.loader-text {
		font-family: monospace;
		font-size: 0.7rem;
		color: #666;
		letter-spacing: 3px;
	}

	.loader-line {
		width: 100%;
		height: 2px;
		background: #222;
		position: relative;
		overflow: hidden;
	}

	.loader-progress {
		height: 100%;
		background: #fff;
		transition: width 0.1s linear;
	}

	/* --- EXISTING STYLES --- */
	.stage {
		position: fixed;
		top: 0; left: 0;
		width: 100vw; height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 0;
		pointer-events: none;
	}

	.header-wrapper {
		position: absolute;
		top: 30px; right: 30px;
		z-index: 50;
        pointer-events: auto; 
	}

	.story-text {
		position: absolute !important;
		bottom: 13% !important;
		width: 100% !important;
		display: flex !important;
		justify-content: center !important;
		align-items: center !important;
		text-align: center !important;
		z-index: 20;
		will-change: transform, opacity;
	}

	.story-text p {
		font-family: var(--f-story);
		font-size: 2.2rem !important;
		color: rgba(255, 255, 255, 0.95);
		line-height: 1.2 !important; 
		margin: 0;
		text-shadow: 0 4px 20px rgba(0,0,0,0.8);
		text-transform: none !important;
	}

	.center-anchor {
		position: absolute;
		display: flex; justify-content: center; align-items: center;
		transform-origin: center center; 
		will-change: transform, opacity; /* Filter dihapus dari will-change */
	}

	.scroll-height { 
		height: 100vh;
		position: relative; 
		z-index: 1;
		pointer-events: none;
	}

	.scroll-instruction {
		position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
		font-family: sans-serif; font-size: 0.7rem; opacity: 0.5; letter-spacing: 3px;
		animation: pulse 2s infinite;
	}

	.content-layer {
		position: relative;
		z-index: 10;
		background: var(--c-void);
		box-shadow: 0 -50px 100px rgba(0,0,0,1);
		min-height: 100vh;
	}

	@keyframes pulse {
		0%, 100% { opacity: 0.3; }
		50% { opacity: 0.8; }
	}

	@media (max-width: 768px) {
		.header-wrapper { top: 20px; right: 0; left: 0; display: flex; justify-content: center; }
		.story-text { bottom: 20% !important; }
		.story-text p { font-size: 1.8rem !important; }
	}
</style>
