# Bay Nepali Cricket Club — Website

A full static website for BNCC. No backend, no subscriptions. Runs entirely in the browser.

## Files
- `index.html` — Home page (announcements, next match, results, top stats)
- `players.html` — Full batting / bowling / fielding stats
- `schedule.html` — All matches with filters
- `gallery.html` — Photo gallery
- `admin.html` — Password-protected editor (default password: `bncc2025`)
- `data.js` — All the site data (edit this to publish changes)
- `style.css` — All styles
- `app.js` — Renders data into pages

---

## Hosting on GitHub Pages (free URL)

1. Go to https://github.com and sign in (or create a free account)
2. Click **New repository** → name it `bncc` (or anything you like)
3. Set it to **Public**
4. Upload all 7 files from this folder
5. Go to **Settings → Pages → Source → Deploy from branch → main → / (root)**
6. Your site will be live at: `https://YOUR-USERNAME.github.io/bncc`

Share that URL with your team!

---

## How to update the site

### Easy way (browser only)
1. Open `yoursite.github.io/bncc/admin.html`
2. Enter password (`bncc2025` by default)
3. Add announcements, match results, stats, photos
4. Click **Export data.js** → it downloads a new `data.js` file
5. Go to your GitHub repo → click `data.js` → click the pencil (edit) icon
6. Replace all the content with the new file's content → **Commit changes**
7. Site updates in ~30 seconds

### Change the admin password
Open `data.js` and change `"adminPassword": "bncc2025"` to your own password.

---

## How to update stats from CricClubs
1. Go to https://cricclubs.com/baca/viewTeam.do?teamId=1189&clubId=1755
2. Copy the stats you want (runs, wickets, averages, etc.)
3. Open the Admin panel → paste them in one player at a time
4. Export & upload `data.js`

---

## Customization
- **Team colors**: Edit `--green-dark`, `--green-mid`, and `--gold` at the top of `style.css`
- **Logo**: Replace the 🏏 emoji in the `<nav>` section of each HTML file with an `<img>` tag
- **Domain**: You can point a custom domain (e.g. `bncricket.com`) to GitHub Pages for free — see GitHub Pages docs
