<script>
    // Tidak butuh script khusus, murni UI
</script>

<div class="music-pill">
    <div class="equalizer">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
    </div>
    <span class="song-title">Wisp - Black Swan</span>
</div>

<style>
    .music-pill {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(255, 255, 255, 0.05); 
        backdrop-filter: blur(10px);
        padding: 8px 16px;
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        cursor: default;
    }
    
    .music-pill:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.4);
        transform: scale(1.02);
    }

    .song-title {
        font-family: 'Inter', system-ui, -apple-system, sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        letter-spacing: 0.15em;
        color: #fff;
        white-space: nowrap;
        text-transform: none;
    }

    .equalizer {
        display: flex;
        gap: 3px;
        height: 12px;
        align-items: flex-end;
    }
    .bar {
        width: 3px;
        background-color: rgb(255, 255, 255);
        border-radius: 2px;
        animation: bounce 1s infinite ease-in-out;
    }
    .bar:nth-child(1) { height: 6px; animation-duration: 0.8s; }
    .bar:nth-child(2) { height: 12px; animation-duration: 1.2s; }
    .bar:nth-child(3) { height: 8px; animation-duration: 1.0s; }

    @keyframes bounce {
        0%, 100% { height: 4px; opacity: 0.5; }
        50% { height: 14px; opacity: 1; }
    }
</style>
