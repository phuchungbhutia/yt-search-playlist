document.addEventListener('DOMContentLoaded', () => {
    const generatePlaylistsButton = document.getElementById('generatePlaylistsButton');
    const searchTermInput = document.getElementById('searchTermInput');
    const resultsContainer = document.getElementById('resultsContainer');
    const errorContainer = document.getElementById('errorContainer');
    const downloadButtonsDiv = document.getElementById('downloadButtons');
    const downloadCsvButton = document.getElementById('downloadCsvButton');
    const downloadTxtButton = document.getElementById('downloadTxtButton');

    // !!! IMPORTANT: Replace 'YOUR_YOUTUBE_API_KEY' with your actual API key
    const YOUTUBE_API_KEY = 'AIzaSyDitr_MrsymdAhrd3iVZdCI3Dvv0bQUQOQ';
    const YOUTUBE_API_BASE_URL = 'https://www.googleapis.com/youtube/v3/search';
    const MAX_RESULTS_PER_TERM = 25; // Fetch top 5 videos

    let allFetchedVideos = []; // Array to store all fetched video data for download

    generatePlaylistsButton.addEventListener('click', async () => {
        errorContainer.innerHTML = ''; // Clear previous errors
        resultsContainer.innerHTML = ''; // Clear previous results
        downloadButtonsDiv.style.display = 'none'; // Hide download buttons initially
        allFetchedVideos = []; // Clear previous video data
        const searchTerms = searchTermInput.value.split('\n').map(term => term.trim()).filter(term => term !== '');

        if (searchTerms.length === 0) {
            displayError('Please enter at least one search term.');
            return;
        }

        generatePlaylistsButton.disabled = true; // Disable button during processing
        generatePlaylistsButton.textContent = 'Generating...';

        try {
            for (const term of searchTerms) {
                await fetchVideosForTerm(term);
                // Introduce a small delay to potentially help with quota management
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            if (allFetchedVideos.length > 0) {
                downloadButtonsDiv.style.display = 'block'; // Show download buttons if videos are found
            }
        } catch (error) {
            console.error('An error occurred during playlist generation:', error);
            displayError('An unexpected error occurred. Please try again later.');
        } finally {
            generatePlaylistsButton.disabled = false;
            generatePlaylistsButton.textContent = 'Generate Playlists';
        }
    });

    async function fetchVideosForTerm(term) {
        const url = new URL(YOUTUBE_API_BASE_URL);
        url.searchParams.append('part', 'snippet');
        url.searchParams.append('q', term);
        url.searchParams.append('key', YOUTUBE_API_KEY);
        url.searchParams.append('type', 'video');
        url.searchParams.append('maxResults', MAX_RESULTS_PER_TERM);

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                if (data.error && data.error.errors && data.error.errors.length > 0) {
                    const errorMessage = data.error.errors[0].message;
                    if (errorMessage.includes('API key not valid')) {
                        displayError(`Error for "${term}": Invalid API Key. Please check your API key in script.js.`);
                    } else if (errorMessage.includes('quotaExceeded')) {
                        displayError(`Error: YouTube API quota exceeded. Please try again tomorrow or contact the administrator.`);
                    } else {
                        displayError(`Error for "${term}": ${errorMessage}`);
                    }
                } else {
                    displayError(`Error for "${term}": Failed to fetch videos. Status: ${response.status}`);
                }
                return;
            }

            displayVideos(term, data.items);
            // Store fetched video details for download
            data.items.forEach(video => {
                if (video.id.videoId) {
                    allFetchedVideos.push({
                        searchTerm: term,
                        title: video.snippet.title,
                        channel: video.snippet.channelTitle,
                        videoId: video.id.videoId,
                        url: `https://www.youtube.com/watch?v=${video.id.videoId}`
                    });
                }
            });

        } catch (error) {
            console.error(`Error fetching videos for "${term}":`, error);
            displayError(`Could not fetch videos for "${term}". Please check your internet connection.`);
        }
    }

    function displayVideos(term, videos) {
        const section = document.createElement('div');
        section.classList.add('playlist-section');

        const title = document.createElement('h2');
        title.textContent = `Videos for: "${term}"`;
        section.appendChild(title);

        if (videos.length === 0) {
            const noVideosMessage = document.createElement('p');
            noVideosMessage.classList.add('no-videos-message');
            noVideosMessage.textContent = 'No videos found for this search term.';
            section.appendChild(noVideosMessage);
        } else {
            const videoGrid = document.createElement('div');
            videoGrid.classList.add('video-grid');

            videos.forEach(video => {
                const videoId = video.id.videoId;
                if (videoId) {
                    const videoContainer = document.createElement('div');
                    videoContainer.classList.add('video-item');

                    const iframe = document.createElement('iframe');
                    iframe.width = '320';
                    iframe.height = '180';
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.frameBorder = '0';
                    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                    iframe.allowFullscreen = true;

                    const videoTitle = document.createElement('p');
                    videoTitle.classList.add('video-title');
                    videoTitle.textContent = video.snippet.title;

                    videoContainer.appendChild(iframe);
                    videoContainer.appendChild(videoTitle);
                    videoGrid.appendChild(videoContainer);
                }
            });
            section.appendChild(videoGrid);
        }
        resultsContainer.appendChild(section);
    }

    function displayError(message) {
        const p = document.createElement('p');
        p.textContent = message;
        errorContainer.appendChild(p);
    }

    // --- Download Functionality ---

    downloadCsvButton.addEventListener('click', () => {
        if (allFetchedVideos.length === 0) {
            displayError('No video data to download.');
            return;
        }
        const csvContent = generateCsvContent(allFetchedVideos);
        downloadFile(csvContent, 'youtube_playlist_data.csv', 'text/csv');
    });

    downloadTxtButton.addEventListener('click', () => {
        if (allFetchedVideos.length === 0) {
            displayError('No video data to download.');
            return;
        }
        const txtContent = generateTxtContent(allFetchedVideos);
        downloadFile(txtContent, 'youtube_playlist_data.txt', 'text/plain');
    });

    function generateCsvContent(videos) {
        const headers = ["Search Term", "Video Title", "Channel Name", "Video ID", "YouTube URL"];
        const rows = videos.map(video => [
            `"${video.searchTerm.replace(/"/g, '""')}"`, // Handle commas and quotes in search term
            `"${video.title.replace(/"/g, '""')}"`,     // Handle commas and quotes in title
            `"${video.channel.replace(/"/g, '""')}"`,   // Handle commas and quotes in channel name
            video.videoId,
            video.url
        ].join(','));
        return [headers.join(','), ...rows].join('\n');
    }

    function generateTxtContent(videos) {
        let content = '';
        videos.forEach(video => {
            content += `Search Term: ${video.searchTerm}\n`;
            content += `Video Title: ${video.title}\n`;
            content += `Channel: ${video.channel}\n`;
            content += `Video ID: ${video.videoId}\n`;
            content += `URL: ${video.url}\n`;
            content += '----------------------------------------\n';
        });
        return content;
    }

    function downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the URL object
    }
});