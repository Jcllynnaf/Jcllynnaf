<script lang="ts">
    import { slide, fade, scale } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    import { onMount, onDestroy } from 'svelte';
    import { supabase } from '$lib/supabaseClient';

    // --- STATE ---
    let isModalOpen = false;
    let showError = false;
    let isSubmitting = false;

    // --- DATA ---
    let songs = [
        { id: 1, song_title: "Pandora" },
        { id: 2, song_title: "Your face" },
        { id: 3, song_title: "Enough for you" },
        { id: 4, song_title: "Luna" },
        { id: 5, song_title: "See you soon" },
        { id: 6, song_title: "Mimi" },
        { id: 7, song_title: "Sword" },
        { id: 8, song_title: "Breathe onto me" },
        { id: 9, song_title: "Save me now" },
        { id: 10, song_title: "After dark" },
        { id: 11, song_title: "Guide light" },
        { id: 12, song_title: "Latvia" },
        { id: 13, song_title: "If not winter" },
        { id: 14, song_title: "Mesmerized" },
        { id: 15, song_title: "Serpentine" },
        { id: 16, song_title: "Get back to you" },
        { id: 17, song_title: "Black swan" },
        { id: 18, song_title: "All i need" },
        { id: 19, song_title: "Sword" },
        { id: 19, song_title: "Yellow" },
        { id: 20, song_title: "Tangled Dreams" },
        { id: 21, song_title: "Once then we'll be free" },
        { id: 22, song_title: "I remember how your hands felt on mine" },
        { id: 23, song_title: "It Gets Easier" },
        { id: 24, song_title: "Tomorrow" },
        { id: 25, song_title: "crocodile eyes" },
        { id: 26, song_title: "Heartstyle (feat. Wisp)" },
        { id: 27, song_title: "Luna (djm23)" }
    ];

    let comments: any[] = [];
    let realtimeChannel: any;

    // --- LOGIKA REALTIME & FILTER ---
    onMount(async () => {
        // 1. Ambil data awal (HANYA YANG VISIBLE)
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('is_visible', true) // <-- Filter Aktif
            .order('created_at', { ascending: false });
        
        if (data) {
            comments = data;
        }

        // 2. Realtime Subscription
        realtimeChannel = supabase
            .channel('public:comments')
            // A. LISTEN INSERT (Komentar Baru Masuk)
            .on(
                'postgres_changes', 
                { event: 'INSERT', schema: 'public', table: 'comments', filter: 'is_visible=eq.true' }, 
                (payload) => {
                    const newComment = payload.new;
                    comments = [newComment, ...comments];
                }
            )
            // B. LISTEN DELETE (Komentar Dihapus Permanen)
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'comments' },
                (payload) => {
                    comments = comments.filter(c => c.id !== payload.old.id);
                }
            )
            // C. LISTEN UPDATE (Admin klik Hide/Show)
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'comments' },
                (payload) => {
                    const updated = payload.new;
                    
                    if (updated.is_visible) {
                        // Kalau Status berubah jadi SHOW -> Masukkan ke list (kalau belum ada)
                        const exists = comments.find(c => c.id === updated.id);
                        if (!exists) {
                            comments = [updated, ...comments];
                            // Opsional: Sort ulang berdasarkan tanggal biar rapi
                            comments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                        }
                    } else {
                        // Kalau Status berubah jadi HIDE -> Hapus dari layar
                        comments = comments.filter(c => c.id !== updated.id);
                    }
                }
            )
            .subscribe();
    });

    onDestroy(() => {
        if (realtimeChannel) supabase.removeChannel(realtimeChannel);
    });

    // --- FORM ACTIONS ---
    let formUsername = "";
    let formAvatar = ""; 
    let formMessage = "";
    let formSelectedSong = ""; 

    function openModal() {
        formUsername = "";
        formMessage = "";
        formSelectedSong = ""; 
        formAvatar = ""; 
        showError = false; 
        isModalOpen = true;
    }

    function closeModal() { isModalOpen = false; }

    function handleImageUpload(e: any) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { formAvatar = e.target?.result as string; };
            reader.readAsDataURL(file);
        }
    }

    async function submitForm() {
        if (!formUsername || !formMessage || !formSelectedSong) {
            showError = true;
            setTimeout(() => showError = false, 3000);
            return;
        }

        isSubmitting = true;

        // Default 'is_visible' adalah true (dari database), jadi langsung muncul
        const { error } = await supabase.from('comments').insert({
            username: formUsername,
            message: formMessage,
            voted_song: formSelectedSong,
            avatar: formAvatar 
        });

        isSubmitting = false;

        if (error) {
            alert("Gagal mengirim: " + error.message);
        } else {
            closeModal();
        }
    }

    function getInitial(name: string) {
        return name ? name.charAt(0).toUpperCase() : "?";
    }
</script>

<section class="community-section">
    <div class="content-wrapper">
        <h2 class="global-title">Signal & Comments</h2>
        <p class="subtitle">LEAVE YOUR MARK</p>

        <div class="guestbook-container">
            <div class="glass-panel guestbook-panel">
                <div class="panel-header">
                    <button class="join-btn" onclick={openModal}>+ ADD COMMENT</button>
                </div>

                <div class="comments-scroll">
                    {#if comments.length === 0}
                         <div style="text-align: center; color: #555; font-family: monospace; padding: 20px;">No visible signals yet.</div>
                    {/if}

                    {#each comments as comment (comment.id)}
                        <div class="comment-card" in:slide={{ duration: 300 }} out:slide={{ duration: 300 }}>
                            <div class="card-avatar">
                                {#if comment.avatar}
                                    <img src={comment.avatar} alt="user" />
                                {:else}
                                    <div class="avatar-initial">
                                        {getInitial(comment.username)}
                                    </div>
                                {/if}
                            </div>
                            
                            <div class="card-body">
                                <div class="comment-header-row">
                                    <span class="username">{comment.username}</span>
                                    <span class="timestamp">
                                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : "Just now"}
                                    </span>
                                </div>
                                
                                <div class="comment-vote-row">
                                    <span class="vote-badge">
                                        Favorite 
                                        <strong class="song-highlight">
                                            {comment.voted_song}
                                        </strong>
                                    </span>
                                </div>

                                <p class="message">{comment.message}</p>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>

        <div class="elegant-footer">
            <div class="footer-divider"></div>
            <div class="footer-grid">
                <div class="footer-section social-section">
                    <span class="footer-label">CONNECT</span>
                    <div class="social-links">
                        <a href="https://instagram.com/jcllynnaf" target="_blank">INSTAGRAM</a>
                        <a href="https://discord.com/users/715124279955685406" target="_blank">MY DISCORD</a>
                        <a href="https://discord.gg/wispcord" target="_blank">WISP DISCORD</a>
                    </div>
                </div>
                <div class="footer-section creator-section">
                    <span class="made-text">Created by <span class="highlight">Jcllynnaf</span></span>
                </div>
            </div>
        </div>

    </div>
</section>

{#if isModalOpen}
    <div class="modal-backdrop" transition:fade={{ duration: 200 }}>
        <div 
            class="modal-card" 
            in:scale={{ start: 0.95, duration: 300, easing: backOut, opacity: 0 }} 
            out:scale={{ start: 0.95, duration: 200, opacity: 0 }}
            onclick={(e) => e.stopPropagation()}
        >
            <div class="modal-header">
                <h3>Leave a Signal</h3>
                <button class="close-btn" onclick={closeModal}>✕</button>
            </div>
            
            <div class="modal-body">
                {#if showError}
                    <div class="error-toast" transition:fade>
                        ⚠ Please fill all fields & select a song!
                    </div>
                {/if}

                <div class="form-avatar-section">
                    <div class="avatar-wrapper">
                        {#if formAvatar}
                            <img src={formAvatar} alt="preview" class="avatar-preview" />
                        {:else}
                            <div class="avatar-initial preview">
                                {getInitial(formUsername)}
                            </div>
                        {/if}
                    </div>
                    
                    <label for="modal-upload" class="upload-btn">Change Photo</label>
                    <input type="file" id="modal-upload" accept="image/*" onchange={handleImageUpload} hidden />
                </div>

                <div class="input-stack">
                    <div class="form-group">
                        <label for="m-name">Username</label>
                        <input type="text" id="m-name" bind:value={formUsername} placeholder="Who are you?" maxlength="15" />
                    </div>

                    <div class="form-group">
                        <label for="m-song">Vote Song</label>
                        <div class="select-wrapper">
                            <select id="m-song" bind:value={formSelectedSong}>
                                <option value="" disabled selected>Pick your favorite...</option>
                                {#each songs as song}
                                    <option value={song.song_title}>{song.song_title}</option>
                                {/each}
                            </select>
                            <div class="select-arrow">▼</div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="m-msg">Message</label>
                        <textarea id="m-msg" bind:value={formMessage} placeholder="Type something..." rows="3"></textarea>
                    </div>
                </div>

                <button class="submit-btn" onclick={submitForm} disabled={isSubmitting}>
                    {isSubmitting ? 'SENDING...' : 'SEND SIGNAL'}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    /* CSS STYLE SAMA SEPERTI SEBELUMNYA */
    * { box-sizing: border-box; }
    
    .community-section {
        padding: 4rem 1.5rem 6rem;
        background: #000000; color: #fff;
        display: flex; justify-content: center;
        min-height: auto; width: 100%; overflow-x: hidden;
    }
    
    .content-wrapper { width: 100%; max-width: 900px; display: flex; flex-direction: column; align-items: center; }
    
    .global-title { 
        font-family: var(--f-header); font-size: 2.5rem; text-align: center; margin-bottom: 0.5rem; letter-spacing: 0; text-transform: uppercase; font-weight: bold;
    }
    .subtitle { 
        font-family: monospace; color: #666; letter-spacing: 0.3em; margin-bottom: 3rem; text-align: center; font-size: 0.8rem; 
    }

    .guestbook-container { width: 100%; margin-bottom: 4rem; }

    .glass-panel {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 16px; padding: 2rem;
        backdrop-filter: blur(5px); width: 100%;
    }

    .panel-header {
        display: flex; justify-content: center; align-items: center; margin-bottom: 2rem;
        border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px;
    }

    .join-btn {
        background: #fff; color: #000; border: none; padding: 10px 20px;
        font-family: monospace; font-weight: bold; cursor: pointer; border-radius: 20px; font-size: 0.75rem;
        transition: transform 0.2s, box-shadow 0.2s; white-space: nowrap;
    }
    .join-btn:hover { transform: scale(1.05); box-shadow: 0 0 15px rgba(255,255,255,0.3); }

    .comments-scroll {
        display: flex; flex-direction: column; gap: 1rem;
        max-height: 500px; overflow-y: auto; padding-right: 5px;
    }
    .comments-scroll::-webkit-scrollbar { width: 4px; }
    .comments-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }

    .comment-card {
        display: flex; gap: 15px; align-items: flex-start;
        background: rgba(0, 0, 0, 0.2); padding: 15px; border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.03);
    }
    
    .card-avatar { flex-shrink: 0; width: 40px; height: 40px; }
    .card-avatar img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 1px solid #333; }

    .avatar-initial {
        width: 100%; height: 100%; border-radius: 50%;
        background: #1a1a1a; border: 1px solid #333;
        display: flex; justify-content: center; align-items: center;
        color: #fff; font-family: monospace; font-size: 1.1rem; font-weight: bold;
        text-transform: uppercase;
        box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
    }
    .avatar-initial.preview { font-size: 2rem; background: #0a0a0a; border-color: #444; }

    .card-body { flex-grow: 1; min-width: 0; display: flex; flex-direction: column; }
    
    .comment-header-row {
        display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; 
    }
    .username { font-family: 'Inter', sans-serif; font-weight: bold; color: #fff; font-size: 0.95rem; }
    .timestamp { font-family: monospace; font-size: 0.65rem; color: #555; }

    .comment-vote-row { margin-bottom: 8px; }
    .vote-badge {
        font-family: monospace; font-size: 0.7rem; color: #888;
        background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 4px;
        border: 1px solid rgba(255,255,255,0.1); display: inline-block;
    }
    .song-highlight { color: #fff; text-shadow: 0 0 8px rgba(255,255,255,0.4); }
    
    .message { font-family: 'Inter', sans-serif; color: #ccc; font-size: 0.9rem; line-height: 1.5; margin: 0; word-wrap: break-word; }

    .elegant-footer { width: 100%; position: relative; }
    .footer-divider {
        width: 100%; height: 1px;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        margin-bottom: 2.5rem;
    }
    .footer-grid { display: flex; flex-direction: column !important; align-items: center; text-align: center; gap: 3rem; width: 100%; }
    .footer-section { display: flex; flex-direction: column; gap: 1rem; align-items: center; width: 100%; }
    .footer-label { font-family: monospace; font-size: 0.65rem; color: #666; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 0.5rem; }
    
    .social-section { order: 1; } 
    .social-links { display: flex; flex-direction: column; gap: 1.2rem; align-items: center; }
    .social-links a {
        font-family: 'Inter', sans-serif; font-size: 0.85rem; color: #aaa; text-decoration: none; letter-spacing: 1px; position: relative; transition: all 0.3s;
    }
    .social-links a:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.6); }
    .social-links a::after {
        content: ''; position: absolute; width: 0; height: 1px; bottom: -4px; left: 50%; transform: translateX(-50%); background-color: #fff; transition: width 0.3s ease;
    }
    .social-links a:hover::after { width: 100%; }

    .creator-section { order: 2; } 
    .made-text { font-family: monospace; font-size: 0.8rem; color: #888; }
    .highlight { color: #fff; font-weight: bold; letter-spacing: 1px; }

    .modal-backdrop {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 15px;
        will-change: opacity;
    }
    .modal-card {
        background: #111; border: 1px solid #333; width: 100%; max-width: 400px;
        border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        display: flex; flex-direction: column;
        will-change: transform, opacity;
    }
    .modal-header {
        background: #151515; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center;
        border-bottom: 1px solid #222;
    }
    .modal-header h3 { margin: 0; font-family: 'Inter', sans-serif; font-size: 0.90rem; color: #fff; }
    .close-btn { background: none; border: none; color: #666; font-size: 1.2rem; cursor: pointer; padding: 5px; }

    .modal-body { padding: 20px; display: flex; flex-direction: column; gap: 1.2rem; position: relative; }
    .error-toast {
        background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.3);
        color: #ffffff; padding: 10px; border-radius: 8px; font-size: 0.7rem; text-align: center; font-family: monospace;
    }

    .form-avatar-section { display: flex; flex-direction: column; align-items: center; gap: 8px; margin-bottom: 5px; }
    .avatar-wrapper { 
        width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 2px solid #333; 
        display: flex; justify-content: center; align-items: center; background: #0a0a0a;
    }
    .avatar-preview { width: 100%; height: 100%; object-fit: cover; }
    
    .upload-btn { font-family: monospace; font-size: 0.75rem; color: #666; cursor: pointer; text-decoration: none; padding: 5px; transition: color 0.2s ease; }
    .upload-btn:hover { color: #fff; }

    .input-stack { display: flex; flex-direction: column; gap: 1rem; width: 100%; }
    .form-group { display: flex; flex-direction: column; gap: 6px; width: 100%; }
    .form-group label { font-family: monospace; font-size: 0.7rem; color: #888; }
    
    input[type="text"], textarea {
        background: #080808; border: 1px solid #333; color: #fff; padding: 12px;
        border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; width: 100%;
        transition: border-color 0.2s;
    }
    input:focus, textarea:focus { border-color: #666; }

    .select-wrapper { position: relative; width: 100%; }
    select {
        background: #080808; border: 1px solid #333; color: #fff; padding: 12px;
        border-radius: 8px; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; width: 100%;
        appearance: none; cursor: pointer;
    }
    .select-arrow { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #666; font-size: 0.7rem; pointer-events: none; }

    .submit-btn {
        background: #fff; color: #000; border: none; padding: 14px; width: 100%;
        font-family: monospace; font-weight: bold; border-radius: 8px; cursor: pointer; margin-top: 10px;
        transition: opacity 0.2s;
    }
    .submit-btn:hover { opacity: 0.9; }
    .submit-btn:disabled { background: #333; color: #888; cursor: not-allowed; }

    @media (max-width: 768px) {
        .community-section { padding: 3rem 1rem 5rem; }
        .glass-panel { padding: 1.25rem; }
    }
</style>