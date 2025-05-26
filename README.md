

# YouTube Search Playlist Generator

[![GitHub Actions](https://github.com/phuchungbhutia/yt-search-playlist/workflows/Deploy%20to%20GitHub%20Pages/badge.svg)](https://github.com/phuchungbhutia/yt-search-playlist/actions)

[![GitHub Pages](https://github.com/phuchungbhutia/yt-search-playlist/workflows/Pages%20build%20and%20deployment/badge.svg)](https://phuchungbhutia.github.io/yt-search-playlist/)

Generate YouTube search playlists from a list of search terms, embed the results using the official YouTube Data API, and share easily.

---

## Live Demo

[https://phuchungbhutia.github.io/yt-search-playlist/](https://phuchungbhutia.github.io/yt-search-playlist/)

---

## Features

* Convert search term list into embedded YouTube video playlists fetched via YouTube Data API v3
* Save/load playlists from browser LocalStorage
* Rename and delete saved playlists
* Share playlists via WhatsApp, Telegram, and Email
* Trending search suggestions
* Responsive and lightweight frontend

---

## Folder Structure

```
yt-search-playlist/
├── index.html           # Main HTML page
├── style.css            # CSS styles
├── script.js            # JavaScript logic (handles API calls & rendering)
├── README.md            # Project documentation
└── .github/
    └── workflows/
        └── deploy.yml   # GitHub Actions workflow for deployment
```

---

## YouTube Data API Key Setup

To enable video fetching and embedding, this app requires a  **YouTube Data API v3 key** . Follow these steps to get your API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create or select a Google Cloud project.
3. Navigate to  **APIs & Services > Library** .
4. Search for **YouTube Data API v3** and enable it.
5. Go to  **APIs & Services > Credentials** .
6. Click  **Create Credentials > API key** .
7. Copy the generated API key.

---

## How to Add Your API Key

1. Open the `script.js` file in your code editor.
2. Find the line near the top that sets the API key, for example:
   ```js
   const API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Replace `'YOUR_API_KEY_HERE'` with your actual API key string.
4. Save the file.

---

## How to Run Locally

1. Clone the repository:

```bash
git clone https://github.com/phuchungbhutia/yt-search-playlist.git
cd yt-search-playlist
```

2. Edit `script.js` to insert your YouTube Data API key as described above.
3. Open `index.html` in your preferred web browser.

> **Note:** This is a purely frontend static site, no backend required.

---

## Git Commit & Push Commands

```bash
git add .
git commit -m "Your descriptive commit message"
git push origin main
```

---

## Deploy on GitHub Pages

* Push your changes to the `main` branch.
* The GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically deploys the site to GitHub Pages.
* Your site will be available at:

  `https://phuchungbhutia.github.io/yt-search-playlist/`

---

## Contribution

Contributions, issues, and feature requests are very welcome!

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

Please follow [GitHub Flow](https://guides.github.com/introduction/flow/) and keep commits clean.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

---

## Contact

Created by [phuchungbhutia](https://github.com/phuchungbhutia).

Feel free to reach out for questions or suggestions.
