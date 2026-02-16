<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { fade, slide } from 'svelte/transition';

    // --- STATE & AUTH ---
    let isAuthenticated = false;
    let passwordInput = "";
    let systemKey = "dikaaa"; // Password Admin
    let activeTab = "dashboard";
    let loading = false; // State untuk animasi refresh

    // --- DATA ---
    let stats = {
        totalVisitors: 0,
        todayVisitors: 0,
        yesterdayVisitors: 0, // Tambahan untuk hitung tren
        totalComments: 0
    };
    
    // Hitung persentase kenaikan/penurunan
    $: trendPercent = stats.yesterdayVisitors > 0 
        ? Math.round(((stats.todayVisitors - stats.yesterdayVisitors) / stats.yesterdayVisitors) * 100) 
        : (stats.todayVisitors > 0 ? 100 : 0);

    let weeklyVisits: any[] = []; 
    let comments: any[] = [];
    let historyUploading = false;

    onMount(() => {
        if (localStorage.getItem("admin_session") === "true") {
            isAuthenticated = true;
            loadAllData();
        }
    });

    function login() {
        if (passwordInput === systemKey) {
            isAuthenticated = true;
            localStorage.setItem("admin_session", "true"); 
            loadAllData();
        } else {
            alert("ACCESS DENIED");
        }
    }

    function logout() {
        isAuthenticated = false;
        localStorage.removeItem("admin_session");
        comments = [];
    }

    // --- FUNGSI REFRESH YANG BERGUNA ---
    async function loadAllData() {
        loading = true; // Aktifkan loading indicator
        // Tunggu semua data selesai diambil baru loading dimatikan
        await Promise.all([fetchStats(), fetchComments()]);
        // Tambah sedikit delay biar kerasa refresh-nya (opsional UI feel)
        setTimeout(() => { loading = false; }, 500); 
    }

    // --- 1. LOGIKA ANALYTICS (DENGAN TREN) ---
    async function fetchStats() {
        // A. Total Pengunjung
        const { count: totalV } = await supabase.from('visitors').select('*', { count: 'exact', head: true });
        
        // B. Pengunjung HARI INI
        const todayStr = new Date().toISOString().split('T')[0];
        const { count: todayV } = await supabase
            .from('visitors')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', todayStr);

        // C. Pengunjung KEMARIN (Buat Tren)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = yesterday.toISOString().split('T')[0];
        // Ambil data antara kemarin 00:00 sampai hari ini 00:00
        const { count: yestV } = await supabase
            .from('visitors')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', yestStr)
            .lt('created_at', todayStr);

        // D. Total Komentar
        const { count: totalC } = await supabase.from('comments').select('*', { count: 'exact', head: true });
        
        stats = {
            totalVisitors: totalV || 0,
            todayVisitors: todayV || 0,
            yesterdayVisitors: yestV || 0,
            totalComments: totalC || 0
        };

        // E. Grafik 7 Hari
        const { data: last7Days } = await supabase
            .from('visitors')
            .select('created_at')
            .order('created_at', { ascending: false })
            .limit(500);

        processChartData(last7Days || []);
    }

    function processChartData(data: any[]) {
        const days: any = {};
        for(let i=6; i>=0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split('T')[0];
            days[key] = 0;
        }
        data.forEach(v => {
            const dateKey = v.created_at.split('T')[0];
            if (days[dateKey] !== undefined) days[dateKey]++;
        });
        weeklyVisits = Object.entries(days).map(([date, count]) => ({ date: date.slice(5), count }));
    }

    // --- 2. LOGIKA KOMENTAR ---
    async function fetchComments() {
        const { data } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });
        comments = data || [];
    }

    async function toggleHide(id: number, currentStatus: boolean) {
        const newStatus = !currentStatus;
        // Optimistic Update
        comments = comments.map(c => c.id === id ? { ...c, is_visible: newStatus } : c);
        const { error } = await supabase.from('comments').update({ is_visible: newStatus }).eq('id', id);
        if (error) alert("Failed to update status");
    }

    async function deleteComment(id: number) {
        if (!confirm("Permanently delete this signal?")) return;
        const { error } = await supabase.from('comments').delete().eq('id', id);
        if (!error) {
            comments = comments.filter(c => c.id !== id);
        }
    }

    // --- 3. LOGIKA HISTORY ---
    async function updateHistoryImage(e: any) {
        const file = e.target.files[0];
        if (!file) return;
        historyUploading = true;
        const fileName = `history-main-${Date.now()}`;
        try {
            const { error: upErr } = await supabase.storage.from('images').upload(fileName, file);
            if (upErr) throw upErr;
            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
            const { error: dbErr } = await supabase.from('history_profiles').upsert({ 
                section_name: 'main_profile', image_url: publicUrl 
            }, { onConflict: 'section_name' });
            if (dbErr) throw dbErr;
            alert("History Image Updated!");
        } catch (err: any) {
            alert("Error: " + err.message);
        } finally {
            historyUploading = false;
        }
    }
</script>

<div class="app-container">
    {#if !isAuthenticated}
        <div class="login-wrapper" in:fade>
            <div class="login-card">
                <div class="logo-area">ADMIN</div>
                <input type="password" bind:value={passwordInput} placeholder="ENTER KEY" />
                <button onclick={login}>LOGIN</button>
            </div>
        </div>
    {:else}
        <div class="admin-layout" in:fade>
            
            <nav class="sidebar">
                <div class="menu">
                    <button class:active={activeTab === 'dashboard'} onclick={() => activeTab = 'dashboard'}>
                        OVERVIEW
                    </button>
                    <button class:active={activeTab === 'comments'} onclick={() => activeTab = 'comments'}>
                        SIGNALS
                    </button>
                    <button class:active={activeTab === 'history'} onclick={() => activeTab = 'history'}>
                        HISTORY
                    </button>
                </div>
                <button class="logout-btn" onclick={logout}>EXIT</button>
            </nav>

            <main class="content">
                
                {#if activeTab === 'dashboard'}
                    <div class="page-header" in:slide>
                        <h2>ANALYTICS</h2>
                        <button class="refresh-btn" onclick={loadAllData} disabled={loading}>
                            {loading ? 'WAIT' : 'REFRESH'}
                        </button>
                    </div>

                    <div class="stats-grid" in:fade>
                        <div class="stat-card highlight">
                            <span class="label">VISITORS TODAY</span>
                            <div class="flex-row">
                                <span class="value">{stats.todayVisitors}</span>
                                <span class="trend {trendPercent >= 0 ? 'up' : 'down'}">
                                    {trendPercent >= 0 ? '▲' : '▼'} {Math.abs(trendPercent)}%
                                </span>
                            </div>
                        </div>
                        <div class="stat-card">
                            <span class="label">TOTAL VISITORS</span>
                            <span class="value">{stats.totalVisitors}</span>
                        </div>
                        <div class="stat-card">
                            <span class="label">TOTAL COMMENTS</span>
                            <span class="value">{stats.totalComments}</span>
                        </div>
                    </div>

                    <div class="chart-section">
                        <h3>LAST 7 DAYS TRAFFIC</h3>
                        <div class="bar-chart">
                            {#each weeklyVisits as day}
                                <div class="bar-col">
                                    <div class="bar-fill" style="height: {Math.min(day.count * 10, 100)}px;">
                                        <span class="bar-tooltip">{day.count}</span>
                                    </div>
                                    <span class="bar-date">{day.date}</span>
                                </div>
                            {/each}
                        </div>
                    </div>
                {/if}

                {#if activeTab === 'comments'}
                    <div class="page-header" in:slide>
                        <h2>SIGNAL MANAGER</h2>
                        <span class="sub-info">{comments.length} Echoes Total</span>
                    </div>

                    <div class="comments-list">
                        {#each comments as c (c.id)}
                            <div class="comment-row" class:hidden-row={!c.is_visible} transition:slide>
                                <div class="c-avatar">
                                    {#if c.avatar} <img src={c.avatar} alt="u" /> {:else} 👤 {/if}
                                </div>
                                <div class="c-content">
                                    <div class="c-top">
                                        <strong>{c.username}</strong>
                                        <span class="c-date">{new Date(c.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div class="c-msg">{c.message}</div>
                                    <div class="c-song">🎵 {c.voted_song}</div>
                                </div>
                                <div class="c-actions">
                                    <button class="action-btn {c.is_visible ? 'btn-hide' : 'btn-show'}" 
                                        onclick={() => toggleHide(c.id, c.is_visible)}>
                                        {c.is_visible ? 'HIDE' : 'SHOW'}
                                    </button>
                                    
                                    <button class="action-btn btn-del" onclick={() => deleteComment(c.id)}>
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}

                {#if activeTab === 'history'}
                    <div class="page-header" in:slide>
                        <h2>HISTORY PROFILE</h2>
                    </div>
                    <div class="history-card">
                        <p>Current Profile Image on History Page</p>
                        <div class="upload-area">
                            {#if historyUploading}
                                <div class="spinner">UPLOADING...</div>
                            {:else}
                                <label class="file-label">
                                    📂 CHOOSE NEW IMAGE
                                    <input type="file" accept="image/*" onchange={updateHistoryImage} hidden />
                                </label>
                            {/if}
                        </div>
                    </div>
                {/if}

            </main>
        </div>
    {/if}
</div>

<style>
    :global(body) { background: #080808; margin: 0; font-family: 'Inter', monospace; color: #fff; }

    /* AUTH SCREEN */
    .login-wrapper { height: 100vh; display: flex; justify-content: center; align-items: center; }
    .login-card { background: #111; padding: 40px; border: 1px solid #333; text-align: center; width: 300px; }
    .logo-area { font-size: 1.2rem; font-weight: bold; margin-bottom: 20px; letter-spacing: 2px; }
    
    input { background: #000; border: 1px solid #444; color: #fff; padding: 10px; width: 100%; box-sizing: border-box; text-align: center; margin-bottom: 10px; }
    button { background: #fff; color: #000; border: none; padding: 10px; width: 100%; font-weight: bold; cursor: pointer; }
    
    /* LAYOUT */
    .admin-layout { display: flex; min-height: 100vh; overflow-x: hidden; /* Mencegah layar geser */ }
    
    /* SIDEBAR */
    .sidebar { 
        width: 200px; flex-shrink: 0; /* Pastikan lebar tetap */
        background: #050505; border-right: 1px solid #222; 
        padding: 20px; display: flex; flex-direction: column; 
    }
    .menu { display: flex; flex-direction: column; gap: 10px; flex-grow: 1; }
    .menu button { background: transparent; color: #666; text-align: left; padding: 12px; transition: 0.2s; cursor: pointer; border: none; font-family: monospace; font-size: 1rem; }
    .menu button:hover { color: #fff; background: #111; }
    .menu button.active { background: #222; color: #fff; border-left: 3px solid #fff; }
    
    /* TOMBOL EXIT DIPERBAIKI */
    .logout-btn { 
        background: #1a0505; color: #ff4444; border: 1px solid #330000;
        margin-top: auto; padding: 8px 15px; font-size: 0.75rem; 
        width: fit-content; /* Ukuran mengikuti teks */
        min-width: auto; 
        border-radius: 4px; cursor: pointer; 
    }
    .logout-btn:hover { background: #330000; color: #fff; }

    /* CONTENT */
    .content { flex-grow: 1; padding: 30px; overflow-y: auto; height: 100vh; box-sizing: border-box; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 1px solid #222; padding-bottom: 15px; }
    .page-header h2 { margin: 0; font-size: 1.2rem; letter-spacing: 1px; }
    .refresh-btn { width: auto; font-size: 0.8rem; padding: 5px 15px; background: #222; color: #fff; border: 1px solid #444; cursor: pointer; }
    .refresh-btn:hover { background: #333; }

    /* STATS GRID */
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
    .stat-card { background: #111; padding: 20px; border: 1px solid #222; border-radius: 8px; }
    .stat-card.highlight { border-color: #fff; background: #0a0a0a; }
    .label { font-size: 0.7rem; color: #666; display: block; margin-bottom: 5px; }
    .flex-row { display: flex; align-items: baseline; gap: 10px; }
    .value { font-size: 2.5rem; font-weight: bold; }
    
    /* TREND INDICATOR */
    .trend { font-size: 0.8rem; font-weight: bold; }
    .trend.up { color: #55ff55; }
    .trend.down { color: #ff5555; }

    /* CHART SIMPLE */
    .chart-section { background: #111; padding: 20px; border-radius: 8px; border: 1px solid #222; }
    .bar-chart { display: flex; gap: 10px; align-items: flex-end; height: 150px; padding-top: 20px; }
    .bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
    .bar-fill { width: 100%; background: #333; border-radius: 4px 4px 0 0; position: relative; min-height: 2px; transition: height 0.5s; }
    .bar-fill:hover { background: #fff; }
    .bar-date { font-size: 0.6rem; color: #555; }
    .bar-tooltip { position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; color: #fff; opacity: 0; }
    .bar-fill:hover .bar-tooltip { opacity: 1; }

    /* COMMENTS LIST */
    .comments-list { display: flex; flex-direction: column; gap: 10px; }
    .comment-row { display: flex; gap: 15px; background: #111; padding: 15px; border-radius: 8px; border: 1px solid #222; align-items: center; }
    .hidden-row { opacity: 0.5; border: 1px dashed #444; }
    
    .c-avatar { width: 40px; height: 40px; border-radius: 50%; background: #222; overflow: hidden; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .c-avatar img { width: 100%; height: 100%; object-fit: cover; }
    
    .c-content { flex-grow: 1; }
    .c-top { display: flex; gap: 10px; align-items: baseline; margin-bottom: 5px; }
    .c-date { font-size: 0.7rem; color: #555; }
    .c-msg { color: #ccc; font-size: 0.9rem; margin-bottom: 5px; }
    .c-song { font-size: 0.7rem; color: #666; font-family: monospace; background: #1a1a1a; display: inline-block; padding: 2px 6px; border-radius: 4px; }

    .c-actions { display: flex; gap: 5px; flex-direction: column; }
    .action-btn { font-size: 0.7rem; padding: 5px 10px; border-radius: 4px; width: 80px; cursor: pointer; border: none; }
    .btn-hide { background: #222; color: #aaa; border: 1px solid #333; }
    .btn-show { background: #003300; color: #55ff55; border: 1px solid #005500; }
    .btn-del { background: #330000; color: #ff5555; }

    /* HISTORY */
    .history-card { background: #111; padding: 40px; text-align: center; border: 1px dashed #333; border-radius: 8px; }
    .file-label { background: #fff; color: #000; padding: 10px 20px; cursor: pointer; display: inline-block; font-weight: bold; font-size: 0.9rem; }

    /* RESPONSIVE MOBILE */
    @media (max-width: 768px) {
        .admin-layout { flex-direction: column; }
        .sidebar { 
            width: 95%; flex-direction: row; align-items: center; 
            padding: 10px; border-right: none; border-bottom: 1px solid #222; 
            overflow-x: auto; /* Menu bisa discroll samping kalau kepanjangan */
        }
        .menu { flex-direction: row; gap: 5px; }
        .menu button { padding: 8px 12px; font-size: 0.8rem; }
        
        /* EXIT BUTTON MOBILE FIXED */
        .logout-btn { 
            margin: 0 0 0 auto; padding: 6px 10px; 
            font-size: 0.7rem; white-space: nowrap;
        }
        
        .content { padding: 15px; }
        .comment-row { flex-direction: column; align-items: flex-start; }
        .c-actions { flex-direction: row; width: 100%; margin-top: 10px; }
        .action-btn { flex: 1; width: auto; }
    }
</style>