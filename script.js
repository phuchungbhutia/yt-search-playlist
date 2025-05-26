// Helper: Get saved playlists from localStorage
function getSavedPlaylists() {
    const saved = localStorage.getItem("ytPlaylists");
    return saved ? JSON.parse(saved) : {};
  }
  
  // Helper: Save playlists to localStorage
  function savePlaylists(playlists) {
    localStorage.setItem("ytPlaylists", JSON.stringify(playlists));
  }
  
  // Generate and display playlists from textarea input
  function generatePlaylists() {
    const textarea = document.getElementById("searchList");
    const output = document.getElementById("playlistsOutput");
    const lines = textarea.value.split("\n").map(l => l.trim()).filter(Boolean);
  
    if (!lines.length) {
      alert("Please enter one or more search terms.");
      return;
    }
  
    output.innerHTML = "";
    lines.forEach(term => {
      // Encode search term for YouTube embed URL
      const query = encodeURIComponent(term);
      // Create iframe embed URL with modest branding & no related videos
      const embedUrl = `https://www.youtube.com/embed?listType=search&list=${query}&modestbranding=1&rel=0`;
  
      const container = document.createElement("div");
      container.className = "playlist";
  
      const title = document.createElement("h3");
      title.textContent = term;
      container.appendChild(title);
  
      const iframe = document.createElement("iframe");
      iframe.width = "560";
      iframe.height = "315";
      iframe.src = embedUrl;
      iframe.title = `YouTube search playlist for: ${term}`;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      container.appendChild(iframe);
  
      // Share buttons container
      const shareDiv = document.createElement("div");
      shareDiv.className = "share-buttons";
  
      // WhatsApp share link
      const waLink = document.createElement("a");
      waLink.href = `https://wa.me/?text=${encodeURIComponent(`Check out this YouTube playlist for "${term}": https://www.youtube.com/results?search_query=${query}`)}`;
      waLink.target = "_blank";
      waLink.rel = "noopener noreferrer";
      waLink.textContent = "WhatsApp";
      shareDiv.appendChild(waLink);
  
      // Telegram share link
      const tgLink = document.createElement("a");
      tgLink.href = `https://t.me/share/url?url=${encodeURIComponent(`https://www.youtube.com/results?search_query=${query}`)}&text=${encodeURIComponent(`YouTube playlist for "${term}"`)}`;
      tgLink.target = "_blank";
      tgLink.rel = "noopener noreferrer";
      tgLink.textContent = "Telegram";
      shareDiv.appendChild(tgLink);
  
      // Email share link
      const emailLink = document.createElement("a");
      emailLink.href = `mailto:?subject=${encodeURIComponent(`YouTube Playlist: ${term}`)}&body=${encodeURIComponent(`Check out this YouTube playlist:\nhttps://www.youtube.com/results?search_query=${query}`)}`;
      emailLink.textContent = "Email";
      shareDiv.appendChild(emailLink);
  
      container.appendChild(shareDiv);
  
      output.appendChild(container);
    });
  }
  
  // Save current playlist to localStorage with a name
  function saveCurrentPlaylist() {
    const nameInput = document.getElementById("playlistName");
    const name = nameInput.value.trim();
    if (!name) {
      alert("Enter a playlist name to save.");
      return;
    }
  
    const textarea = document.getElementById("searchList");
    const terms = textarea.value.trim();
    if (!terms) {
      alert("Enter some search terms before saving.");
      return;
    }
  
    const playlists = getSavedPlaylists();
    playlists[name] = terms;
    savePlaylists(playlists);
    alert(`Playlist "${name}" saved.`);
    renderSavedPlaylists();
  }
  
  // Load selected playlist into textarea
  function loadSelectedPlaylist() {
    const select = document.getElementById("savedPlaylists");
    const name = select.value;
    if (!name) {
      alert("Select a playlist to load.");
      return;
    }
    const playlists = getSavedPlaylists();
    document.getElementById("searchList").value = playlists[name] || "";
  }
  
  // Render saved playlists in the select dropdown
  function renderSavedPlaylists() {
    const select = document.getElementById("savedPlaylists");
    select.innerHTML = "<option value=''>-- Select Playlist --</option>";
    const playlists = getSavedPlaylists();
    Object.keys(playlists).forEach(name => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });
  }
  
  // Rename a saved playlist
  function renamePlaylist() {
    const select = document.getElementById("savedPlaylists");
    const oldName = select.value;
    if (!oldName) {
      alert("Select a playlist to rename.");
      return;
    }
    const newName = prompt("Enter new name for the playlist:", oldName);
    if (!newName) return;
  
    if (newName === oldName) return;
  
    const playlists = getSavedPlaylists();
    if (playlists[newName]) {
      alert("A playlist with this name already exists.");
      return;
    }
  
    playlists[newName] = playlists[oldName];
    delete playlists[oldName];
    savePlaylists(playlists);
    alert(`Playlist renamed to "${newName}"`);
    renderSavedPlaylists();
  }
  
  // Delete a saved playlist
  function deletePlaylist() {
    const select = document.getElementById("savedPlaylists");
    const name = select.value;
    if (!name) {
      alert("Select a playlist to delete.");
      return;
    }
    if (!confirm(`Are you sure you want to delete playlist "${name}"? This action cannot be undone.`)) {
      return;
    }
  
    const playlists = getSavedPlaylists();
    delete playlists[name];
    savePlaylists(playlists);
    alert(`Playlist "${name}" deleted.`);
    renderSavedPlaylists();
  }
  
  // Render trending search suggestions as clickable buttons
  function renderTrendingSuggestions() {
    const container = document.getElementById("trendingSuggestions");
    if (!container) return;
  
    // Example trending terms - update as you like
    const trending = [
      "Python tutorial",
      "Lo-fi music",
      "React hooks",
      "Meditation music",
      "Daily news",
      "Fitness workout"
    ];
  
    trending.forEach(term => {
      const btn = document.createElement("button");
      btn.textContent = term;
      btn.onclick = () => {
        const textarea = document.getElementById("searchList");
        if (textarea.value.trim()) textarea.value += "\n";
        textarea.value += term;
      };
      container.appendChild(btn);
    });
  }
  
  // Attach event listeners after DOM loads
  window.onload = () => {
    renderSavedPlaylists();
    renderTrendingSuggestions();
  
    document.getElementById("generateBtn").onclick = generatePlaylists;
    document.getElementById("savePlaylist").onclick = saveCurrentPlaylist;
    document.getElementById("loadPlaylist").onclick = loadSelectedPlaylist;
    document.getElementById("renamePlaylist").onclick = renamePlaylist;
    document.getElementById("deletePlaylist").onclick = deletePlaylist;
  };
  