<script lang="ts">
    import { onMount } from 'svelte';
    import { gsap } from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);
    
    // DATA DATA
    let memories = [
        { id: 1, type: 'video', src: '/memories/1.mp4', caption: 'Before the Concert.' },
        { id: 2, type: 'image', src: '/memories/2.webp', caption: 'photo from @javaboymk3' },
        { id: 3, type: 'image', src: '/memories/3.webp', caption: 'photo from @javaboymk3' },
        { id: 4, type: 'image', src: '/memories/4.webp', caption: 'photo from @javaboymk3' },
        { id: 5, type: 'image', src: '/memories/5.webp', caption: 'photo from @javaboymk3' }
    ];

    onMount(() => {
        let ctx = gsap.context(() => {
            // Animasi Header Simple
            gsap.from(".header-title", {
                scrollTrigger: { trigger: ".memories-section", start: "top 80%" },
                y: 30, opacity: 0, duration: 1
            });

            // Animasi Kartu List
            const items = document.querySelectorAll('.memory-item');
            items.forEach((item) => {
                gsap.from(item, {
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%", // Muncul saat elemen masuk layar
                        toggleActions: "play none none reverse"
                    },
                    y: 50, 
                    opacity: 0, 
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
        });
        return () => ctx.revert();
    });
</script>

<section class="memories-section">
    <div class="header-container">
        <h1 class="global-title">February 1st</h1>
        <p class="header-sub">Wisp Live In Jakarta 2026 @Krapela</p>
    </div>

    <div class="memories-container">
        {#each memories as item (item.id)}
            <div class="memory-item">
                <div class="polaroid-frame">
                    
                    <div class="media-area">
                        {#if item.type === 'video'}
                            <video 
                                src={item.src} 
                                class="media-content"
                                controls 
                                playsinline 
                                muted
                            ></video>
                        {:else}
                            <img src={item.src} alt="Memory" class="media-content" />
                        {/if}
                    </div>

                    <div class="caption-area">
                        <span class="date-text">01.02.2026</span>
                        <p class="caption-text">{item.caption}</p>
                    </div>

                </div>
            </div>
        {/each}
    </div>
</section>

<style>
    /* Reset & Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@300;400;600&display=swap');

    .memories-section {
        background-color: #000000;
        min-height: auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 80px 20px 120px 20px; /* Padding atas/bawah/kiri/kanan */
        box-sizing: border-box;
        overflow-x: hidden;
    }

    /* HEADER */
    .header-container {
        text-align: center;
        margin-bottom: 60px;
    }

    .header-sub {
        font-family: 'Inter', sans-serif;
        color: #888;
        font-size: 0.8rem;
        letter-spacing: 2px;
        text-transform: uppercase;
        margin-top: 10px;
    }

    /* CONTAINER LIST */
    .memories-container {
        display: flex;
        flex-direction: column; /* Wajib Column agar Vertikal */
        gap: 60px; /* Jarak antar kartu */
        width: 100%;
        max-width: 800px; /* Batas lebar konten di Desktop */
        align-items: center;
    }

    /* ITEM WRAPPER */
    .memory-item {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
    }

    /* FRAME PUTIH (POLAROID STYLE) */
    .polaroid-frame {
        background-color: #ffffff;
        width: 100%;
        padding: 10px; 
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
    }

    /* MEDIA AREA (ASPECT RATIO 16:9) */
    .media-area {
        width: 100%;
        aspect-ratio: 16/9; /* KUNCI LANDSCAPE */
        background-color: #eee;
        overflow: hidden;
        position: relative;
    }

    .media-content {
        width: 100%;
        height: 100%;
        object-fit: cover !important; /* Agar gambar penuh tanpa sisa hitam */
        display: block;
    }

    /* CAPTION */
    .caption-area {
        height: 40px; /* Sesuaikan angka ini jika ingin lebih tebal/tipis */
        display: flex;
        justify-content: space-between;
        align-items: center; 
        margin-top: 5px; 
        padding: 0 5px;
    }

    .date-text {
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        color: #999;
        font-weight: 600;
    }

    .caption-text {
        font-family: 'Playfair Display', serif;
        font-style: italic;
        font-size: 1.1rem;
        color: #222;
        margin: 0;
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 768px) {
        .header-title { font-size: 2.5rem; }
        
        .memories-container {
            gap: 40px; /* Jarak lebih dekat di HP */
            width: 100%; /* Lebar penuh */
        }

        .polaroid-frame {
            padding: 8px;
        }

        .caption-area {
            height: 35px; /* Bingkai bawah sedikit lebih kecil di HP */
            margin-top: 5px;
        }

        .caption-text {
            font-size: 0.9rem;
        }
    }
</style>