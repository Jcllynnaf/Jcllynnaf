<script lang="ts">
    import { slide, fly } from 'svelte/transition'; 
    import { backOut, cubicOut } from 'svelte/easing';

    // --- DATA DISKOGRAFI ---
    const albums = [
        //album
        { 
            id: 1, 
            category: 'album',
            showTracklist: true,
            title: 'If Not Winter', 
            artist: '2025 - 12 songs, 38 min 17 sec', 
            cover: '/albums/ifnotwinter.jpg',
            tracks: ["Sword", "Breathe onto me", "Save me now", "After dark", "Guide light", "Latvia", "If not winter", "Mesmerized", "Serpentine", "Get back to me", "Black swan", "All i need"],
            link: "https://open.spotify.com/album/6R21I5E805CLZmDn8vESQM"
        },
        //single
        { 
            id: 2, 
            category: 'single',
            showTracklist: true,
            title: 'Pandora', 
            artist: '2024 - 6 songs, 23 min 36 sec', 
            cover: '/albums/pandora.jpg',
            tracks: ["Pandora", "Your face", "Enough for you", "Luna", "See you soon", "Mimi"],
            link: "https://open.spotify.com/album/47rlABSBChwZC7qxAKzOWw"
        },
        {
            id: 3, 
            category: 'single', 
            showTracklist: false, 
            title: 'Yellow', 
            artist: '2025 - 1 songs, 4 min 27 sec', 
            cover: '/albums/yellow.jpg',
            tracks: ["Yellow"],
            link: "https://open.spotify.com/album/1BrAurLoXx2P0DFrdU3N2J"
        },
        {
            id: 4, 
            category: 'single', 
            showTracklist: false, 
            title: 'Tangled dreams', 
            artist: '2023 - 1 songs, 4 min 22 sec', 
            cover: '/albums/tangled.jpg',
            tracks: ["Tangled dreams"],
            link: "https://open.spotify.com/album/0KqPbrTMjCC8Hu4BKUM2LG"
        },
        {
            id: 5, 
            category: 'single', 
            showTracklist: false, 
            title: 'Once then we ll be free', 
            artist: '2023 - 1 songs, 3 min 23 sec', 
            cover: '/albums/once.jpg',
            tracks: ["Once then we ll be free"],
            link: "https://open.spotify.com/album/4vIM3lUezeQRsuevPU1h4N"
        },
        { 
            id: 6, 
            category: 'single',
            showTracklist: false, 
            title: 'I remember how your hands felt on mine', 
            artist: '2024 - 1 songs, 3 min 15 sec', 
            cover: '/albums/mine.jpg',
            tracks: ["I remember how your hands felt on mine"],
            link: "https://open.spotify.com/album/51SGbfwir9zzbgr2N0BxfO"
        },

        //collab
        { 
            id: 7, 
            category: 'collab', 
            showTracklist: false, 
            title: 'It Gets Easier', 
            artist: 'Tanukichan, Wisp', 
            cover: '/albums/circles.jpg',
            tracks: ["It Gets Easier"],
            link: "https://open.spotify.com/track/7C2bncZ2xUWmAIsfeukLhG?si=bc0fc03f0eef434a"
        },
        { 
            id: 8, 
            category: 'collab', 
            showTracklist: false, 
            title: 'Tomorrow', 
            artist: 'Distressor, Wisp', 
            cover: '/albums/tomorrow.jpg',
            tracks: ["Tomorrow"],
            link: "https://open.spotify.com/track/2Xe437hf0Ft1qNvtBTi54n?si=0b68af7ff62c42a0"
        },
        { 
            id: 9, 
            category: 'collab', 
            showTracklist: false, 
            title: 'Luna (djm23)', 
            artist: 'DJmegan23, Wisp', 
            cover: '/albums/luna.jpg',
            tracks: ["Luna (djm23)"],
            link: "https://open.spotify.com/track/1NqG1xOBDNp9eiK5ImRBga?si=137d68e48dab4307"
        },
        { 
            id: 10, 
            category: 'collab', 
            showTracklist: false, 
            title: 'crocodile eyes', 
            artist: 'aldn, Wisp', 
            cover: '/albums/eyes.jpg',
            tracks: ["crocodile eyes"],
            link: "https://open.spotify.com/track/6ox6nxzmyeGAbR4etEGQC1?si=df301ecd45044ef8"
        },
        { 
            id: 11, 
            category: 'collab', 
            showTracklist: false, 
            title: 'Heartstyle (feat. Wisp)', 
            artist: 'Photographic Memory, Wisp', 
            cover: '/albums/heart.jpg',
            tracks: ["Heartstyle (feat. Wisp)"],
            link: "https://open.spotify.com/track/7HDXvkyToDEZ5cKhHVLqoe?si=2d1c10d2fb394669"
        },
    ];

    // --- LOGIKA TABS ---
    let activeTab = 'album'; // Default tab yang aktif
    let activeIndex: number | null = null; // Menyimpan ID album yang sedang dibuka

    // Reactive: Filter album berdasarkan tab yang dipilih
    $: filteredAlbums = albums.filter(album => album.category === activeTab);

    // Fungsi ganti tab
    function setTab(cat: string) {
        activeTab = cat;
        activeIndex = null; // Tutup album yang sedang terbuka saat ganti tab
    }

    // Fungsi buka/tutup album
    function toggleAlbum(id: number) {
        activeIndex = activeIndex === id ? null : id;
    }
</script>

<section class="sonic-collection" in:fly={{ y: 50, duration: 1000, easing: cubicOut }}>
    
    <div class="collection-header">
        <h2 class="global-title">Wisp</h2>
        <p class="subtitle">all my favorites</p>
    </div>

    <div class="info-container">
        <div class="click-instruction-minimal">
            <div class="blinking-dot"></div>
            <span class="instruction-text">Click Cover for Details</span>
        </div>
    </div>

    <div class="tabs-container">
        <button class="tab-btn {activeTab === 'album' ? 'active' : ''}" onclick={() => setTab('album')}>
            <span class="tab-text">ALBUMS</span>
            {#if activeTab === 'album'}<div class="active-line" transition:slide={{ axis: 'x', duration: 300 }}></div>{/if}
        </button>
        
        <button class="tab-btn {activeTab === 'single' ? 'active' : ''}" onclick={() => setTab('single')}>
            <span class="tab-text">SINGLE & EP</span>
            {#if activeTab === 'single'}<div class="active-line" transition:slide={{ axis: 'x', duration: 300 }}></div>{/if}
        </button>
        
        <button class="tab-btn {activeTab === 'collab' ? 'active' : ''}" onclick={() => setTab('collab')}>
            <span class="tab-text">APPEARS ON</span>
            {#if activeTab === 'collab'}<div class="active-line" transition:slide={{ axis: 'x', duration: 300 }}></div>{/if}
        </button>
    </div>

    <div class="vinyl-grid">
        {#each filteredAlbums as album, i (album.id)}
            <div class="album-unit {activeIndex === album.id ? 'is-active' : ''}" 
                 in:fly={{ y: 30, duration: 800, delay: i * 100 }}>
                
                <div class="track-info-top">
                    <h3 class="song-title">{album.title}</h3>
                    <p class="artist-name">{album.artist}</p>
                </div>

                <button class="album-display" onclick={() => toggleAlbum(album.id)}>
                    <div class="vinyl-disc">
                        <div class="grooves"></div>
                        <div class="label" style="background-image: url({album.cover});"></div>
                    </div>
                    <div class="album-cover" style="background-image: url({album.cover});">
                        <div class="glare"></div>
                        {#if activeIndex === album.id}<div class="playing-indicator">PLAYING</div>{/if}
                    </div>
                </button>

                {#if activeIndex === album.id}
                    
                    {#if !album.showTracklist}
                        <div class="simple-btn-container" transition:slide={{ duration: 400, axis: 'y' }}>
                            <a href={album.link} target="_blank" class="listen-btn glow-btn">
                                LISTEN NOW 
                            </a>
                        </div>

                    {:else}
                        <div class="paper-wall-container" transition:slide={{ duration: 600, easing: backOut, axis: 'y' }}>
                            <div class="tape-strip"></div>
                            <div class="paper-sheet">
                                <div class="paper-header">TRACKLIST</div>
                                <ul class="track-list">
                                    {#each album.tracks as track}<li>{track}</li>{/each}
                                </ul>
                                <a href={album.link} target="_blank" class="listen-btn">
                                    LISTEN NOW
                            </div>
                        </div>
                    {/if}

                {/if}
            </div>
        {/each}
    </div>

</section>

<style>
    /* IMPORT FONT TULISAN TANGAN */
    @import url('https://fonts.googleapis.com/css2?family=Rock+Salt&display=swap');

    /* --- GLOBAL --- */
    .sonic-collection {
        position: relative; z-index: 50; background-color: #000000;
        padding: 4rem 2rem; min-height: auto; overflow-x: hidden; width: 100%; box-sizing: border-box;
    }

    /* --- 1. HEADER (Style Rock Salt) --- */
    .collection-header {
        position: relative; text-align: center; margin-bottom: 0; 
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        min-height: 200px; 
    }

    /* Subtitle di bawah Garis */
    .subtitle { 
        font-family: 'LocalHeader', monospace; 
        color: #ffffff; 
        font-size: 2rem; 
        margin-top: 5px;
        margin-bottom: 0; 
    }
    /* --- 2. INFO CONTAINER --- */
    .info-container {
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; margin-top: 1rem; margin-bottom: 2rem; z-index: 20; position: relative;
    }

    .click-instruction-minimal { display: flex; align-items: center; justify-content: center; gap: 8px; }
    .instruction-text { font-family: monospace; font-size: 0.75rem; color: rgb(255, 255, 255); letter-spacing: 1px; text-transform: uppercase; opacity: 0.8; }
    .blinking-dot {
        width: 8px; height: 8px; background-color: rgb(255, 255, 255); border-radius: 50%;
        box-shadow: 0 0 5px rgb(255, 255, 255); animation: blink 1.5s infinite ease-in-out;
    }
    @keyframes blink {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.8); }
    }

    /* --- 3. TABS MENU --- */
    .tabs-container {
        display: flex; 
        justify-content: center; 
        gap: 3rem; /* Jarak antar tab lebih lega */
        margin-bottom: 4rem; 
        border-bottom: 1px solid rgba(255,255,255,0.1); /* Garis tipis di bawah container */
        padding-bottom: 0.5rem;
        width: fit-content;
        margin-left: auto;
        margin-right: auto;
    }
    .tab-btn {
        background: transparent; 
        border: none; /* Hilangkan border kotak */
        color: #666; 
        padding: 10px 0; /* Padding vertikal saja */
        font-family: 'Inter', sans-serif; /* Pakai font sans-serif biar bersih */
        font-size: 0.75rem; 
        font-weight: 600;
        cursor: pointer; 
        letter-spacing: 1px;
        transition: color 0.3s ease;
        position: relative;
        text-transform: uppercase;
    }

    .tab-btn:hover { color: #fff; }

    .tab-btn.active {
        color: #fff; 
        text-shadow: 0 0 10px rgba(255,255,255,0.4); /* Sedikit glow di text */
    }

    /* Garis bawah animasi untuk tab aktif */
    .active-line {
        position: absolute;
        bottom: -0.5rem; /* Menempel di garis container */
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(255,255,255,0.8); /* Glow effect */
    }

    /* --- 4. GRID & ALBUM --- */
    .vinyl-grid {
        display: grid; grid-template-columns: 1fr; gap: 4rem;
        width: 100%; max-width: 1200px; margin: 0 auto; place-items: center;
    }
    @media (min-width: 768px) {
        .vinyl-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 5rem; }
    }
    .album-unit { display: flex; flex-direction: column; align-items: center; width: 100%; position: relative; }

    .track-info-top { 
        text-align: center; 
        margin-bottom: 1.5rem; /* Jarak lebih jauh ke Cover Album */
        display: flex;
        flex-direction: column;
        gap: 0.5rem; /* JARAK ANTARA JUDUL DAN ARTIS */
        min-height: 60px; /* Menjaga tinggi agar sejajar */
        justify-content: flex-end;
    }

    .song-title { 
        font-family: 'Inter', sans-serif; 
        font-size: 1.3rem; 
        font-weight: 700; 
        color: #fff; 
        margin: 0; 
        line-height: 1.2;
        letter-spacing: -0.5px;
    }

    .artist-name { 
        font-family: monospace; 
        font-size: 0.8rem; 
        color: #888; 
        margin: 0; 
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .album-display {
        position: relative; width: 250px; height: 250px; max-width: 80vw; max-height: 80vw;
        background: transparent; border: none; padding: 0; cursor: pointer; z-index: 20;
        display: flex; justify-content: center; align-items: center;
    }
    .album-cover {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        background-size: cover; background-position: center; border-radius: 4px; z-index: 10;
        box-shadow: 0 10px 40px rgba(0,0,0,0.6); transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .glare { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%); pointer-events: none; }
    .vinyl-disc {
        position: absolute; top: 2%; left: 2%; width: 96%; height: 96%;
        border-radius: 50%; background: #111; z-index: 5;
        display: flex; justify-content: center; align-items: center;
        box-shadow: 5px 0 15px rgba(0,0,0,0.6); transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    }
    .grooves {
        position: absolute; width: 95%; height: 95%; border-radius: 50%; border: 1px solid rgba(255,255,255,0.05);
        background: repeating-radial-gradient(#111, #111 2px, #1a1a1a 3px, #1a1a1a 4px);
    }
    .label { width: 35%; height: 35%; border-radius: 50%; background-size: cover; background-position: center; border: 4px solid #111; }
    .playing-indicator {
        position: absolute; bottom: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff;
        font-size: 0.6rem; padding: 4px 8px; border-radius: 4px; letter-spacing: 1px;
    }
    .album-display:hover .album-cover { transform: scale(1.02); }
    
    .album-unit.is-active .album-cover { transform: translateX(-15%) scale(1.02); box-shadow: 0 15px 50px rgba(0,0,0,0.8); }
    .album-unit.is-active .vinyl-disc { animation: spinAndShiftMobile 4s linear infinite; }
    
    @keyframes spinAndShiftMobile { 0% { transform: translateX(15%) rotate(0deg); } 100% { transform: translateX(15%) rotate(360deg); } }
    @media (min-width: 768px) {
        .album-unit.is-active .album-cover { transform: translateX(-20%) scale(1.02); }
        .album-unit.is-active .vinyl-disc { animation: spinAndShiftDesktop 4s linear infinite; }
    }
    @keyframes spinAndShiftDesktop { 0% { transform: translateX(20%) rotate(0deg); } 100% { transform: translateX(20%) rotate(360deg); } }

    /* --- KERTAS & TOMBOL --- */
    .paper-wall-container { position: relative; margin-top: 1.5rem; width: 220px; z-index: 10; }
    .tape-strip {
        position: absolute; top: -10px; left: 50%; transform: translateX(-50%) rotate(-2deg);
        width: 60px; height: 18px; background: rgba(255, 255, 255, 0.3); box-shadow: 0 1px 3px rgba(0,0,0,0.2); z-index: 15;
    }
    .paper-sheet {
        background: #f0f0f0; color: #222; padding: 20px; font-family: 'Courier New', monospace;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); transform: rotate(1deg); position: relative;
        display: flex; flex-direction: column; 
    }
    .paper-sheet::after {
        content: ''; position: absolute; bottom: 5px; right: 5px; width: 50%; height: 10px;
        box-shadow: 0 15px 15px rgba(0,0,0,0.4); transform: rotate(3deg); z-index: -1;
    }
    .paper-header {
        text-align: center; font-weight: bold; border-bottom: 2px solid #222; margin-bottom: 10px; padding-bottom: 5px; letter-spacing: 1px; font-size: 0.8rem;
    }
    .track-list { list-style: decimal; padding-left: 20px; margin: 0; flex-grow: 1; }
    .track-list li { font-size: 0.8rem; margin-bottom: 4px; color: #333; }

    .listen-btn {
        font-family: 'Inter', sans-serif;  margin-top: 15px; text-decoration: none; background: #ffffff; color: #000000;
        font-size: 0.75rem; font-weight: bold; padding: 8px;
        display: flex; justify-content: center; align-items: center; gap: 5px;
        border-radius: 2px; transition: background 0.2s, transform 0.1s; border: 1px solid #ffffff; cursor: pointer;
    }
    .listen-btn:hover { background: #ffffff; transform: scale(1.02); }
    .listen-btn:active { transform: scale(0.98); }

    /* Style Khusus Tombol Single */
    .simple-btn-container { margin-top: 2rem; z-index: 30; position: relative; }
    .glow-btn { padding: 10px 20px; font-size: 0.9rem; }
</style>