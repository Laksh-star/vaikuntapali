# Vaikuntapali (Snakes and Ladders)

A classic Indian Vaikuntapali (snakes and ladders) web game with a moral-journey theme, virtues as ladders, and vices as serpents.

## Features
- 10x10 winding board with Vaikuntha at 100
- Virtues (ladders) and vices (snakes) with Sanskrit-inspired labels
- Two-player turn system with exact-roll-to-100 rule
- Animated token movement and activity log
- Themed visuals and typography

## Screenshots
![Vaikuntapali gameplay](screenshots/vaikuntapali-screenshot.svg)

## How To Run
1. Open `index.html` in a modern browser.
2. Click **Roll the Cowrie** to play.

## Installation Variants
1. Open `index.html` directly from the filesystem.
2. Serve locally with Python: run `python3 -m http.server 8080` and open `http://localhost:8080`.
3. Serve locally with PHP: run `php -S localhost:8080` and open `http://localhost:8080`.
4. Serve locally with Node (if already installed): run `npx serve` and follow the printed URL.

## Customization Notes
1. Update ladders and snakes in `app.js` by editing the `ladders` and `snakes` arrays.
2. Change the theme colors in `styles.css` under `:root`.
3. Adjust player tokens in `styles.css` under `#token-0` and `#token-1`.
4. Keep the board at 10x10 unless you also update `numberToCoord()` in `app.js` and the SVG overlay sizing.

## Project Structure
- `index.html` - App shell and layout
- `styles.css` - Visual theme and layout styling
- `app.js` - Game logic, rendering, and interactions
- `project-report.md` - Summary of work and feature breakdowns

## Notes
This is a single-page, dependency-free project. No build tools required.
