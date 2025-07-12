# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
CatanUniverse
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ dice
│  │  │  ├─ diceFive.png
│  │  │  ├─ diceFour.png
│  │  │  ├─ diceOne.png
│  │  │  ├─ diceSix.png
│  │  │  ├─ diceThree.png
│  │  │  └─ diceTwo.png
│  │  ├─ knightCard.png
│  │  ├─ map
│  │  │  ├─ catanUniverse.ai
│  │  │  ├─ catanUniverse.jpg
│  │  │  ├─ desertCard.png
│  │  │  ├─ resourceTileBrick.png
│  │  │  ├─ resourceTileSheep.png
│  │  │  ├─ resourceTileSteel.png
│  │  │  ├─ resourceTileTree.png
│  │  │  └─ resourceTileWheat.png
│  │  ├─ merchantCard.png
│  │  ├─ playerBlue
│  │  │  ├─ blueCity.png
│  │  │  ├─ blueRoad.png
│  │  │  └─ blueVillage.png
│  │  ├─ playerGreen
│  │  │  ├─ greenCity.png
│  │  │  ├─ greenRoad.png
│  │  │  └─ greenVillage.png
│  │  ├─ playerOrange
│  │  │  ├─ orangeCity.png
│  │  │  ├─ orangeRoad.png
│  │  │  └─ orangeVillage.png
│  │  ├─ playerRed
│  │  │  ├─ redCity.png
│  │  │  ├─ redRoad.png
│  │  │  └─ redVillage.png
│  │  ├─ progCard
│  │  │  ├─ progressiveCard-back.png
│  │  │  ├─ progressiveCard-knight.png
│  │  │  ├─ progressiveCard-monopoly.png
│  │  │  ├─ progressiveCard-roadBuilding.png
│  │  │  ├─ progressiveCard-score.png
│  │  │  ├─ progressiveCard-yearOfPlenty.png
│  │  │  └─ progressiveCard.ai
│  │  ├─ resourceCard
│  │  │  ├─ resourceCardBrick.png
│  │  │  ├─ resourceCardSheep.png
│  │  │  ├─ resourceCardSteel.png
│  │  │  ├─ resourceCardTree.png
│  │  │  └─ resourceCardWheat.png
│  │  └─ theif.png
│  ├─ components
│  │  ├─ ActionPanel
│  │  │  └─ ActionButtons.jsx
│  │  ├─ Board
│  │  │  └─ HexTile.jsx
│  │  ├─ Dice
│  │  │  └─ DiceRoller.jsx
│  │  └─ PlayerPanel
│  │     └─ PlayerPanel.jsx
│  ├─ features
│  │  ├─ ai
│  │  │  ├─ aiDecisionMaker.js
│  │  │  └─ aiStrategy.js
│  │  ├─ board
│  │  │  ├─ boardGenerator.js
│  │  │  └─ tileUtils.js
│  │  ├─ game
│  │  │  ├─ actionHandler.js
│  │  │  ├─ gameEngine.js
│  │  │  ├─ resourceDistributor.js
│  │  │  └─ victoryChecker.js
│  │  └─ state
│  │     ├─ gameStore.js
│  │     └─ localStorageManager.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ router
│  │  ├─ index.jsx
│  │  └─ pages
│  │     ├─ Canvas.jsx
│  │     └─ Home.jsx
│  ├─ styles
│  │  └─ Home.css
│  └─ utils
│     ├─ constants.js
│     ├─ helpers.js
│     └─ random.js
└─ vite.config.js

```