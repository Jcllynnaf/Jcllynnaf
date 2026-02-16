<script lang="ts">
    import { onMount } from 'svelte';
    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
    
    // 1. IMPORT SUPABASE
    import { supabase } from '$lib/supabaseClient';

    gsap.registerPlugin(ScrollTrigger);

    // 2. UBAH 'const' JADI 'let' BIAR BISA DIUPDATE
    let profile = {
        label: "",
        alias: "Justin",     
        tagline: "I like being alone, listening to music in my own world, away from all bullshit in life.", 
        bio: "And yeah, below is a little story about how I first got into Wisp music.",
        avatar: "/profile1.png" // Ini gambar default kalau database kosong
    };

    const milestones = [
        {
            year: "2025",
            songTitle: "Your Face",
            image: "/albums/yourface.png", 
            desc: "Back in early 2025, this was the very first song that really stuck with me. I came across it on Instagram Reels, and it just hit differently. It felt powerful and deeply moving, and I ended up playing it every single day from the Pandora Singles album."
        },
        {
            year: "August 1, 2025",
            songTitle: "If Not Winter",
            image: "/albums/ifnotwinter.jpg", 
            desc: "After playing Wisp songs on repeat every day, I was counting down to this album. When it finally dropped, it completely lived up to the wait. It’s incredible, layered, and genuinely moving. The kind of album that lingers in your head long after the last track fades out."
        },
        {
            year: "February 1, 2026",
            songTitle: "If Not Winter Asia Tour",
            image: "/albums/tour.jpg", 
            desc: "At the Wisp tour in Jakarta, before the show even started, I caught a glimpse of Natalie up close. She was right there in front of me. She looked so beautiful and sweet, and when she sang, her voice was just as stunning in person. It felt like the beginning of something special, a day that broke away from my usual routine of chaos and boredom. I truly enjoyed every second of that concert."
        }
    ];

    // 3. UBAH onMount JADI ASYNC UNTUK AMBIL DATA
    onMount(async () => {
        // --- LOGIKA SUPABASE (BARU) ---
        // Cek apakah ada gambar baru di database admin?
        const { data, error } = await supabase
            .from('history_profiles')
            .select('image_url')
            .eq('section_name', 'main_profile')
            .single();

        // Kalau ada, ganti avatar default dengan yang dari database
        if (data && data.image_url) {
            profile.avatar = data.image_url;
            // Kita perlu force update svelte variable agar reaktif
            profile = profile; 
        }

        // --- ANIMASI GSAP (TETAP SAMA SEPERTI KODEMU) ---
        // Intro Animation
        const tlProfile = gsap.timeline({ delay: 0.2 });
        tlProfile.from(".main-title", { y: -30, opacity: 0, duration: 1, ease: "power3.out" })
                 .from(".profile-content", { y: 30, opacity: 0, duration: 1 }, "-=0.5")
                 .from(".connector-line", { scaleY: 0, transformOrigin: "top", duration: 0.8 }, "-=0.3");

        // Timeline Animation
        const rows = document.querySelectorAll('.history-row');
        rows.forEach((row) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: row,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            });

            tl.fromTo(row.querySelector('.img-box'), 
                { scale: 0.9, opacity: 0, filter: 'blur(4px)' }, 
                { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.8 }
            );

            const paths = row.querySelectorAll('.rope-path');
            paths.forEach(path => {
                // @ts-ignore
                const length = path.getTotalLength();
                gsap.fromTo(path, 
                    { strokeDasharray: length, strokeDashoffset: length },
                    { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", scrollTrigger: { trigger: row, start: "top 80%" } }
                );
            });

            tl.fromTo(row.querySelector('.text-container'),
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                "-=0.6"
            );
        });
    });
</script>

<section class="premium-layout">
    
    <header class="main-header">
        <h1 class="global-title">About Me</h1>
        <div class="header-line"></div>
    </header>

    <div class="profile-section">
        <div class="profile-content">
            
            <div class="profile-visual">
                <div class="profile-img-box">
                    <img src={profile.avatar} alt="Profile" />
                    <div class="img-border-offset"></div>
                </div>
            </div>

            <div class="profile-text">
                <span class="label-small">{profile.label}</span>
                <h2 class="name-large">{profile.alias}</h2>
                <h3 class="tagline">{profile.tagline}</h3>
                <p class="bio-paragraph">{profile.bio}</p>
            </div>

        </div>
    </div>

    <div class="connector-line"></div>

    <div class="timeline-wrapper">
        {#each milestones as item, i}
            <div class="history-row {i % 2 !== 0 ? 'row-even' : 'row-odd'}">
                
                <div class="col-left {i % 2 === 0 ? 'is-image' : 'is-text'}">
                    {#if i % 2 === 0}
                        <div class="image-container left-align">
                            <div class="img-box"><img src={item.image} alt={item.songTitle} /></div>
                            <h3 class="song-label">{item.songTitle}</h3>
                        </div>
                    {:else}
                        <div class="text-container right-align-text">
                            <span class="year-pill">{item.year}</span>
                            <p class="desc-text">{item.desc}</p>
                        </div>
                    {/if}
                </div>

                <div class="col-center">
                    <svg viewBox="0 0 120 40" class="rope-svg desktop-rope {i % 2 !== 0 ? 'flipped' : ''}">
                        <path d="M 0 20 C 40 20, 80 20, 120 20" class="rope-path" />
                        <circle cx="60" cy="20" r="3" fill="#fff" />
                    </svg>
                    <svg viewBox="0 0 40 80" class="rope-svg mobile-rope">
                        <path d="M 20 0 Q 40 20, 20 40 T 20 80" class="rope-path" />
                        <circle cx="20" cy="40" r="3" fill="#fff" />
                    </svg>
                </div>

                <div class="col-right {i % 2 === 0 ? 'is-text' : 'is-image'}">
                    {#if i % 2 === 0}
                        <div class="text-container left-align-text">
                            <span class="year-pill">{item.year}</span>
                            <p class="desc-text">{item.desc}</p>
                        </div>
                    {:else}
                        <div class="image-container right-align">
                            <div class="img-box"><img src={item.image} alt={item.songTitle} /></div>
                            <h3 class="song-label">{item.songTitle}</h3>
                        </div>
                    {/if}
                </div>

            </div>
        {/each}
    </div>

</section>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600&display=swap');

    .premium-layout {
        background-color: #000000;
        color: #f0f0f0;
        /* HAPUS min-height: 100vh agar tidak memaksa scroll kosong */
        padding: 4rem 1rem;
        overflow-x: hidden;
        font-family: 'Inter', sans-serif;
        min-height: auto;
    }

    /* --- 1. COMPACT HEADER --- */
    .main-header { text-align: center; margin-bottom: 2.5rem; }
    .header-line { width: 40px; height: 1px; background: #666; margin: 15px auto; opacity: 0.5; }


    /* --- 2. PREMIUM PROFILE (RESIZED) --- */
    .profile-section {
        max-width: 850px; margin: 0 auto;
        padding-bottom: 0; /* Hapus padding bawah berlebih */
    }
    
    .profile-content {
        display: flex; 
        align-items: center; 
        justify-content: center;
        gap: 3rem; /* Jarak antar elemen */
    }

    /* IMAGE (Compact Portrait) */
    .profile-visual { flex: 0 0 auto; }
    .profile-img-box {
        /* Ukuran Desktop yang PAS (Tidak Raksasa) */
        width: 180px; height: 240px; 
        position: relative;
    }
    .profile-img-box img {
        width: 100%; height: 100%; object-fit: cover;
        position: relative; z-index: 2;
        filter: grayscale(100%) contrast(1.1); transition: 0.5s;
    }
    .img-border-offset {
        position: absolute; top: 10px; left: 10px; width: 100%; height: 100%;
        border: 1px solid rgba(255,255,255,0.3); z-index: 1; transition: 0.3s;
    }
    .profile-img-box:hover img { filter: grayscale(0%); transform: translate(-3px, -3px); }
    .profile-img-box:hover .img-border-offset { transform: translate(3px, 3px); border-color: #fff; }

    /* TEXT INFO */
    .profile-text { text-align: left; max-width: 380px; }
    
    .label-small {
        font-size: 0.7rem; letter-spacing: 2px; color: #888; 
        text-transform: none; font-weight: 600; display: block; margin-bottom: 5px;
    }
    .name-large {
        font-family: 'LocalHeader', monospace;
        font-size: clamp(2rem, 3.5vw, 3rem);
        margin: 25px; line-height: 1.1; color: #fff; margin-bottom: 15px;
    }
    .tagline {
        font-family: 'Playfair Display', serif; font-size: 1rem; font-style: italic;
        color: #aaa; margin: 0 0 15px 0; font-weight: 400;
    }
    .bio-paragraph {
        font-size: 0.9rem; line-height: 1.6; color: #ccc; font-weight: 300;
        border-left: 1px solid #444; padding-left: 15px; margin: 0;
    }

    /* CONNECTOR */
    .connector-line {
        width: 1px; height: 60px; /* Tidak terlalu panjang */
        background: linear-gradient(to bottom, #444, #fff, #444);
        margin: 2rem auto 2rem auto; opacity: 0.5;
    }


    /* --- 3. TIMELINE (MAINTAINED) --- */
    .timeline-wrapper { width: 100%; max-width: 1000px; margin: 0 auto; display: flex; flex-direction: column; gap: 2rem; }
    .history-row { display: grid; grid-template-columns: 1fr 120px 1fr; align-items: center; min-height: 220px; }

    .col-left { display: flex; justify-content: flex-end; padding-right: 15px; width: 100%; box-sizing: border-box; }
    .col-right { display: flex; justify-content: flex-start; padding-left: 15px; width: 100%; box-sizing: border-box; }
    .col-center { display: flex; justify-content: center; align-items: center; width: 100%; }

    .image-container { display: flex; flex-direction: column; gap: 8px; width: 200px; }
    .img-box { 
    width: 100%; 
    height: auto; /* PENTING: Biar tinggi menyesuaikan gambar */
    border: 1px solid #333; 
    transition: 0.3s; 
    overflow: hidden; 
    display: flex; /* Tambahan agar rapi */
}
    .img-box img { 
    width: 100%; 
    height: auto; /* PENTING */
    object-fit: contain; /* Agar gambar utuh */
    filter: contrast(1.1); /* Hapus grayscale, sisakan contrast biar tajam */
    transition: 0.5s; 
}
    .img-box:hover img { 
    transform: scale(1.05); 
}
    
    .left-align { align-items: flex-end; text-align: right; }
    .right-align { align-items: flex-start; text-align: left; }
    .song-label { font-family: 'Playfair Display', serif; font-size: 1rem; color: #fff; margin: 0; letter-spacing: 1px; }

    .text-container { display: flex; flex-direction: column; max-width: 260px; justify-content: center; }
    .right-align-text { align-items: flex-end; text-align: right; }
    .left-align-text { align-items: flex-start; text-align: left; }
    .year-pill { font-size: 0.7rem; font-weight: 600; letter-spacing: 2px; color: #888; border: 1px solid #444; padding: 3px 10px; border-radius: 50px; margin-bottom: 8px; }
    .desc-text { font-size: 0.9rem; color: #ccc; line-height: 1.6; margin: 0; }

    .rope-svg { overflow: visible; width: 100%; height: 100%; }
    .rope-path { fill: none; stroke: #fff; stroke-width: 1.5px; opacity: 0.6; }
    .desktop-rope { display: block; height: 40px; }
    .mobile-rope { display: none; }
    .flipped { transform: scaleX(-1); }


    /* --- RESPONSIVE MOBILE FIX (CRUCIAL) --- */
    @media (max-width: 768px) {
        
        .premium-layout { padding: 3rem 1rem; }

        /* PROFILE MOBILE */
        .profile-content { 
            flex-direction: column; /* Stack ke bawah */
            gap: 1.5rem; text-align: center; 
        }
        .profile-img-box { 
            /* Kecilkan gambar di HP */
            width: 140px; height: 140px; margin: 0 auto; 
        }
        .profile-text { 
            text-align: center; max-width: 100%; padding: 0 1rem; 
        }
        .bio-paragraph { 
            border-left: none; padding-left: 0; /* Hapus garis pinggir di HP */
        }
        
        /* TIMELINE MOBILE */
        .history-row { display: flex; flex-direction: column; gap: 0; margin-bottom: 3rem; }
        
        /* ORDERING FIX */
        .is-image { order: 1; }
        .col-center { order: 2; }
        .is-text { order: 3; }

        .col-left, .col-right { justify-content: center; padding: 0; text-align: center; width: 100%; }
        .image-container, .text-container { align-items: center !important; text-align: center !important; max-width: 90%; }
        .left-align, .right-align, .left-align-text, .right-align-text { align-items: center; text-align: center; }

        .col-center { width: 100%; height: 60px; margin: 5px 0; display: flex; justify-content: center; }
        .desktop-rope { display: none; }
        .mobile-rope { display: block; width: 40px; }
        
        .img-box { 
    width: 100%; /* Atau biarkan 180px jika ingin lebar tetap */
    max-width: 250px; /* Batasi agar tidak terlalu besar di HP */
    height: auto; /* PENTING: Biar tidak kotak paksa */
}
    }
</style>