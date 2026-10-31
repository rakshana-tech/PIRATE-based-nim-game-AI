# 🏴‍☠️ PIRATE'S NIM – THE AI TREASURE CHALLENGE

> **"Outsmart the AI. Claim the Treasure."**

A complete, interactive, responsive web application implementing an intelligent game of **Nim** with an unbeatable AI opponent ("Captain Grundy") and an interactive AI Strategy Tutor ("Navigator Bernoulli").

---

## 🌟 Overview & Features

### 1. Themed Pirate Interface
- **Atmospheric Visuals:** Rich Dark Navy Blue (`#050811`, `#0a1124`), Antique Gold (`#d4af37`), and Ocean Teal (`#0ea5e9`) color palette with celestial map grids and ocean glow.
- **Physical Gold Doubloons:** Every single coin is rendered individually with realistic 3D bevels, pirate skull insignias, metallic shimmer, and smooth removal physics.
- **Responsive Layout:** Two-column desktop dashboard transitioning to a sleek stacked mobile layout.
- **Web Audio API Sound Engine:** 100% procedural sound effects (coin clicks, multi-tone coin scoops, tactical sonar pings, victory fanfares, and defeat gongs) with instant mute control and zero external file requirements.

### 2. Intelligent Game Engine & Mathematical AI
- **Pure Game Logic:** Implements the Sprague-Grundy theorem and Charles L. Bouton's 1901 optimal strategy.
- **Nim-Sum Calculation:** Calculates the bitwise XOR sum ($S = H_1 \oplus H_2 \oplus \dots \oplus H_n$) in real time.
- **Optimal Bouton Solver:**
  - Evaluates target heap sizes: $\text{Target} = H_i \oplus S$.
  - When $\text{Target} < H_i$, the AI calculates the exact difference $H_i - \text{Target}$ to remove, restoring the Nim-sum to **0** (a balanced P-position).
  - When the Nim-sum is already 0, the AI recognizes it is in a losing position against optimal play and executes delaying tactics.
- **Live Strategy Panel:** Displays real-time bitwise decompositions (bits 8, 4, 2, 1), parity sums, Grundy numbers $G(k)$, and step-by-step XOR explanations.
- **Difficulty Settings:**
  - **Grand Admiral:** 100% mathematically optimal play.
  - **Corsair:** 85% optimal, 15% casual (gives the human chances to recover).
  - **Apprentice Buccaneer:** 60% optimal practice mode.

### 3. Interactive AI Tutor ("NIM AI TUTOR")
- Dedicated chat assistant powered by an educational rule-based engine with live state inspection.
- **Pre-configured Quick Prompts:**
  - *"What is Nim Game?"*
  - *"Explain XOR operation."*
  - *"What is Nim-sum?"*
  - *"Why did AI remove these coins?"*
  - *"Explain Grundy numbers."*
  - *"How can I win against AI?"*
  - *"Explain the last move."*
- **Dynamic Context Awareness:** Inspects current board state to tell players their exact winning moves, explain AI decisions step-by-step, or analyze binary parity.

### 4. Game Modes & Screen Flow
- **Welcome / Landing Page:** Cinematic entrance with animated treasure chest and AI lore.
- **Rules Page:** Interactive checklist gate ensuring the player understands all 6 core rules before entering the board.
- **Gameplay Dashboard:** Full interactive duel with real-time feedback, turn banners, and move history.
- **Game Over Screen:** Celebration modal with confetti bursts, winner announcements, and complete game post-mortem.
- **Customizable Heaps:** Presets including *Pirate's Fleet (3, 4, 5, 2)*, *Classic (3, 4, 5)*, *Seven Seas (1, 3, 5, 7)*, or custom user-defined heap counts.

---

## 📐 Mathematical Foundations

### Bouton's Theorem (1901)
In Normal Play Nim (where the player who takes the last coin wins), a position is a:
- **P-Position (Previous Player Winning):** if and only if the Nim-sum is $0$:
  $$\bigoplus_{i=1}^n H_i = 0$$
  From any P-position, *every* legal move leaves a non-zero Nim-sum.
- **N-Position (Next Player Winning):** if and only if the Nim-sum is non-zero:
  $$\bigoplus_{i=1}^n H_i \neq 0$$
  From any N-position, there is *always* at least one legal move that transitions to a P-position (Nim-sum = 0).

### Sprague-Grundy Values
In standard Nim, the Grundy value (or nim-value) of a heap of size $k$ is:
$$G(k) = k$$
The combined Grundy value of the game is equivalent to the Nim-sum:
$$G_{\text{total}} = G(H_1) \oplus G(H_2) \oplus \dots \oplus G(H_n)$$

---

## 🚀 Running the Project Locally

No node modules, package managers, or server installations are required! The application runs in any modern browser.

### Option 1: Direct File Open
Double-click `index.html` or open it directly in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari:
```text
C:\Users\Rakshana R\.gemini\antigravity\scratch\pirates-nim\index.html
```

### Option 2: Local HTTP Server (Optional)
If you prefer running via a local server (e.g., using Python or Node):

**Using Python 3:**
```powershell
cd "C:\Users\Rakshana R\.gemini\antigravity\scratch\pirates-nim"
python -m http.server 8000
```
Then navigate to: `http://localhost:8000`

**Using Node.js (`npx serve`):**
```powershell
cd "C:\Users\Rakshana R\.gemini\antigravity\scratch\pirates-nim"
npx serve .
```

---

## 📂 Project Architecture

```
pirates-nim/
├── index.html            # Main single-page application structure & views
├── README.md             # Project documentation & mathematical theory
├── css/
│   ├── main.css          # Color system, typography, resets & header
│   ├── components.css    # Heaps, individual 3D coins, tutor chat & panels
│   └── animations.css    # Keyframe animations (coin physics, chest glows, confetti)
└── js/
    ├── audio.js          # Zero-dependency Web Audio API procedural sound engine
    ├── engine.js         # Pure mathematical Nim logic, Bouton XOR solver & AI
    ├── tutor.js          # Context-aware AI strategy chat assistant
    ├── ui.js             # DOM renderer, coin animations & event orchestrator
    └── app.js            # Main application bootstrapper
```

---

## 🎮 Rules of the Game
1. The game contains multiple heaps of pirate coins.
2. Each player can select only **ONE** heap per turn.
3. A player can remove one or more coins from the selected heap.
4. A player cannot remove coins from multiple heaps in one turn.
5. The human captain and AI take turns alternatively.
6. The player who removes the last coin wins the treasure!
