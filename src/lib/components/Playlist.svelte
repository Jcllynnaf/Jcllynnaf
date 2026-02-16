<script lang="ts">
    import { fade, slide } from 'svelte/transition';

    // --- CONFIG SINGLE PLAYLIST ---
    // Masukkan ID Playlist Spotify yang berisi semua lagu yang kamu mau.
    const playlistConfig = {
        spotifyId: "4bg8Zbnu4lHCXnOU4BfjGq", 
        cover: "/albums/playlist.jpg", // Gambar Cover Utama
        type: "playlist" // Pastikan ini 'playlist' agar memuat banyak lagu
    };

    let isPlaying = false; // Status apakah sedang "Open"

    function togglePlayer() {
        isPlaying = !isPlaying;
    }
</script>

<section class="playlist-section">
    <div class="content-wrapper">
        
        <div class="header-box">
            <h2 class="global-title">My Playlist</h2>
            <p class="section-subtitle">
            <span class="blink-dot"></span> CLICK VINYL TO LISTEN
            </p>
        </div>

        <div class="player-center-stage">
            
            <button 
                class="visual-player-area {isPlaying ? 'playing' : ''}" 
                onclick={togglePlayer}
                aria-label="Toggle Player"
            >
                <div class="custom-vinyl-wrapper">
                    <div id="album">
                        <div id="cover" style="background-image: url('{playlistConfig.cover}');">
                            <div id="print"></div>
                        </div>
                        
                        <div id="vinyl">
                            <div id="print" style="background-image: url('{playlistConfig.cover}');"></div>
                        </div>
                    </div>

                    {#if !isPlaying}
                        <div class="click-hint" transition:fade>
                            <span>PLAY</span>
                        </div>
                    {/if}
                </div>
            </button>

            <div class="info-stack">
                <div class="now-playing-info">
                </div>

                {#if isPlaying}
                    <div class="spotify-embed-container" transition:slide={{ duration: 600 }}>
                        <iframe 
                            style="border-radius:12px" 
                            src="https://open.spotify.com/embed/{playlistConfig.type}/{playlistConfig.spotifyId}?utm_source=generator&theme=0" 
                            width="100%" 
                            height="500" 
                            frameBorder="0" 
                            allowfullscreen={false} 
                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                            loading="lazy"
                            title="Spotify Player">
                        </iframe>
                    </div>
                {/if}
            </div>

        </div>
    </div>
</section>

<style>
    /* --- SECTION STYLE --- */
    .playlist-section {
        position: relative; padding: 4rem 2rem;
        background: #000000; min-height: auto; color: #fff; overflow: hidden;
        display: flex; flex-direction: column; justify-content: center;
    }
    .content-wrapper { max-width: 800px; margin: 0 auto; width: 100%; position: relative; z-index: 2; }
    
    .header-box { text-align: center; margin-bottom: 4rem; }
    .section-subtitle { font-family: monospace; font-size: 0.75rem; color: rgb(255, 255, 255); letter-spacing: 1px; text-transform: uppercase; opacity: 0.8; }

    /* --- CENTER STAGE --- */
    .player-center-stage {
        display: flex; flex-direction: column; align-items: center; gap: 2rem;
    }

    /* BUTTON WRAPPER (Reset Button Style) */
    .visual-player-area {
        background: none; border: none; padding: 0; margin: 0; cursor: pointer;
        display: flex; flex-direction: column; align-items: center;
        transition: transform 0.3s ease;
    }
    .visual-player-area:hover { transform: scale(1.02); }

    /* --- CUSTOM VINYL CSS (Sama seperti sebelumnya, disesuaikan posisi) --- */
    .custom-vinyl-wrapper {
        position: relative;
        width: 320px; height: 320px;
        margin-bottom: 2rem;
        
        /* VARIABLE JARAK GESER */
        --slide-dist: 50%; 
    }

    #album { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

    #cover {
        position: absolute; top: 0; left: 0; z-index: 10;
        width: 100%; height: 100%;
        background-size: 100% 100%;
        box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 10px 5px rgba(255,255,255,0.1);
        border-radius: 4px;
    }
    
    /* Texture Overlays */
    #cover::before {
        position: absolute; top: 0; left: 0; z-index: 10; width: 100%; height: 100%;
        background-image: url('https://i.imgur.com/i0fMWpe.jpg');
        background-size: 100% 100%; border-radius: 4px; mix-blend-mode: screen; opacity: 0.5; content: ''; pointer-events: none;
    }
    #cover::after {
        position: absolute; top: 0; left: 0; z-index: 20; width: 100%; height: 100%;
        background-image: url('https://orig06.deviantart.net/0124/f/2013/136/6/7/texture_326_by_sirius_sdz-d65gs3s.jpg');
        background-size: 100% 100%; border-radius: 4px; mix-blend-mode: screen; opacity: 0.2; content: ''; pointer-events: none;
    }

    #vinyl {
        position: absolute; top: 2.5%; left: 2.5%; z-index: 0;
        width: 95%; height: 95%; display: block;
        background-image: url('https://gallery.yopriceville.com/var/resizes/Free-Clipart-Pictures/Music-PNG/Gramophone_Vinyl_LP_Record_PNG_Transparent_Clip_Art_Image.png?m=1462983196');
        background-size: 106% 106%; background-position: center; border-radius: 50%; content: '';
        transition: transform 1s ease;
    }
    #vinyl::before {
        position: absolute; top: 2.5%; left: 2.5%; z-index: 10; width: 95%; height: 95%;
        background-image: url('http://www.designresourcebox.com/ths/diverse/blacktextures/82267467.jpg');
        background-size: 100% 100%; border-radius: 50%; mix-blend-mode: screen; opacity: 0.3; content: ''; pointer-events: none;
    }
    #vinyl #print {
        position: absolute; top: 33%; left: 33%; height: 34%; width: 34%;
        box-shadow: inset 0 0 0 5px rgba(150,150,150,0.5);
        background-size: cover; border-radius: 50%; z-index: 20;
    }

    /* Click Hint Overlay */
    .click-hint {
        position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 30;
        display: flex; justify-content: center; align-items: center;
        background: rgba(0,0,0,0.3); border-radius: 4px;
        backdrop-filter: blur(2px);
        transition: opacity 0.3s;
    }
    .visual-player-area:hover .click-hint { background: rgba(0,0,0,0.1); backdrop-filter: blur(0px); }
    .click-hint span {
        font-family: monospace; font-size: 2rem; letter-spacing: 5px; color: #fff; }

    /* --- ANIMASI --- */
    /* Saat class 'playing' aktif (diklik) */
    .playing #vinyl {
        animation: spinThat 5s linear infinite, getOut 1s ease-out forwards; 
    }
    .playing .click-hint { opacity: 0; pointer-events: none; }

    @keyframes getOut {
        0% { left: 0; }
        100% { left: var(--slide-dist); } 
    }
    @keyframes spinThat {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* --- INFO & PLAYER --- */
    .info-stack { width: 100%; max-width: 450px; text-align: center; } /* Lebar Player Spotify */
    
    .spotify-embed-container { 
        width: 100%; border-radius: 12px; overflow: hidden; 
        box-shadow: 0 10px 40px rgba(0,0,0,0.6); 
    }

    /* --- MOBILE --- */
    @media (max-width: 768px) {
        .custom-vinyl-wrapper { 
            width: 260px; height: 260px; 
            --slide-dist: 20%; /* Geser dikit aja di HP biar gak nabrak */
        } 
    }

    .blink-dot {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-color: #ffffff; /* Warna Merah Menyala */
        border-radius: 50%;        /* Membuat bulat */
        margin-right: 8px;         /* Jarak dengan teks */
        box-shadow: 0 0 10px #ffffff; /* Efek Glow/Bercahaya */
        animation: blink-animation 1.5s infinite ease-in-out;
        vertical-align: middle;    /* Agar sejajar tengah dengan teks */
        margin-bottom: 2px;        /* Koreksi posisi sedikit */
    }

    /* Keyframes Animasi Kedip */
    @keyframes blink-animation {
        0% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    /* (Opsional) Update section-subtitle agar flex dan rapi */
    .section-subtitle {
        display: flex; 
        align-items: center; 
        justify-content: center;
        /* sisa style lama tetap ada... */
    }
</style>