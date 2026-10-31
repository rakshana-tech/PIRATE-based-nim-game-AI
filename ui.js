/* ==========================================================================
   PIRATE'S NIM: THE AI TREASURE CHALLENGE
   User Interface Controller & DOM Visualizations
   ========================================================================== */

class NimUI {
  constructor(engine, tutor, audio) {
    this.engine = engine;
    this.tutor = tutor;
    this.audio = audio;

    // UI state
    this.selectedHeapIndex = -1;
    this.selectedCoinCount = 1;
    this.isAiProcessing = false;

    // DOM Element References
    this.elements = {
      // Screens
      screenLanding: document.getElementById('screen-landing'),
      screenRules: document.getElementById('screen-rules'),
      screenGameplay: document.getElementById('screen-gameplay'),

      // Navigation & Header
      btnNavRules: document.getElementById('btn-nav-rules'),
      btnNavSound: document.getElementById('btn-nav-sound'),
      btnNavNewGame: document.getElementById('btn-nav-new-game'),
      btnNavRestart: document.getElementById('btn-nav-restart'),
      soundIcon: document.getElementById('sound-icon'),

      // Landing
      btnStartPlaying: document.getElementById('btn-start-playing'),
      btnHowToPlayHero: document.getElementById('btn-how-to-play-hero'),

      // Rules
      checkRulesAccepted: document.getElementById('check-rules-accepted'),
      btnAcceptRules: document.getElementById('btn-accept-rules'),
      btnBackToWelcome: document.getElementById('btn-back-to-welcome'),

      // Gameplay Main Area
      turnBanner: document.getElementById('turn-banner'),
      turnTitle: document.getElementById('turn-title'),
      turnSubtitle: document.getElementById('turn-subtitle'),
      turnTurnCounter: document.getElementById('turn-counter'),
      heapsContainer: document.getElementById('heaps-container'),
      selectedHeapLabel: document.getElementById('selected-heap-label'),
      counterValue: document.getElementById('counter-value'),
      btnCounterMinus: document.getElementById('btn-counter-minus'),
      btnCounterPlus: document.getElementById('btn-counter-plus'),
      btnTakeCoins: document.getElementById('btn-take-coins'),

      // Strategy & Nim-Sum Panel
      nimSumNumber: document.getElementById('nim-sum-number'),
      nimSumBinary: document.getElementById('nim-sum-binary'),
      nimSumStateBadge: document.getElementById('nim-sum-state-badge'),
      bitwiseTableBody: document.getElementById('bitwise-table-body'),
      parityRow: document.getElementById('parity-row'),
      aiExplanationCard: document.getElementById('ai-explanation-card'),
      aiExplanationText: document.getElementById('ai-explanation-text'),

      // Sidebar
      aiMoodStatus: document.getElementById('ai-mood-status'),
      aiPulseDot: document.getElementById('ai-pulse-dot'),
      tutorMessagesStream: document.getElementById('tutor-messages-stream'),
      tutorInput: document.getElementById('tutor-input'),
      tutorSendBtn: document.getElementById('tutor-send-btn'),
      quickPromptsContainer: document.getElementById('quick-prompts-container'),
      historyList: document.getElementById('history-list'),

      // Modals
      modalNewGame: document.getElementById('modal-new-game'),
      modalCloseNewGame: document.getElementById('modal-close-new-game'),
      btnStartCustomGame: document.getElementById('btn-start-custom-game'),
      presetButtons: document.querySelectorAll('.preset-btn'),
      inputHeapCustom: document.getElementById('input-heap-custom'),
      selectStartPlayer: document.getElementById('select-start-player'),
      selectDifficulty: document.getElementById('select-difficulty'),

      modalGameOver: document.getElementById('modal-game-over'),
      gameOverTitle: document.getElementById('game-over-title'),
      gameOverChestGlow: document.getElementById('game-over-chest-glow'),
      gameOverSubtitle: document.getElementById('game-over-subtitle'),
      gameOverMoves: document.getElementById('game-over-moves'),
      gameOverDuration: document.getElementById('game-over-duration'),
      gameOverWinner: document.getElementById('game-over-winner'),
      gameOverExplanation: document.getElementById('game-over-explanation'),
      btnPlayAgain: document.getElementById('btn-play-again'),
      btnGameOverNewGame: document.getElementById('btn-game-over-new-game')
    };

    this.bindEvents();
    this.updateSoundIcon();
  }

  // 1. Navigation & Screen Management
  switchScreen(screenName) {
    const screens = [this.elements.screenLanding, this.elements.screenRules, this.elements.screenGameplay];
    screens.forEach(s => {
      if (s) s.classList.remove('active');
    });

    if (screenName === 'landing' && this.elements.screenLanding) {
      this.elements.screenLanding.classList.add('active');
    } else if (screenName === 'rules' && this.elements.screenRules) {
      this.elements.screenRules.classList.add('active');
    } else if (screenName === 'gameplay' && this.elements.screenGameplay) {
      this.elements.screenGameplay.classList.add('active');
      this.renderFullGame();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 2. Sound Icon Update
  updateSoundIcon() {
    if (!this.elements.soundIcon) return;
    if (this.audio.isMuted) {
      this.elements.soundIcon.textContent = '🔇';
      this.elements.btnNavSound.title = 'Sound Muted (Click to Unmute)';
    } else {
      this.elements.soundIcon.textContent = '🔊';
      this.elements.btnNavSound.title = 'Sound On (Click to Mute)';
    }
  }

  // 3. Render Entire Game Board
  renderFullGame() {
    this.renderTurnBanner();
    this.renderHeaps();
    this.renderMoveControls();
    this.renderLiveStrategyPanel();
    this.renderAiExplanation();
    this.renderMoveHistory();
    this.renderTutorMessages();
    this.updateAiMood();
  }

  // 4. Render Turn Banner
  renderTurnBanner() {
    const isHuman = this.engine.currentTurn === 'human';
    const banner = this.elements.turnBanner;
    if (!banner) return;

    banner.classList.remove('human-turn', 'ai-turn');

    if (isHuman) {
      banner.classList.add('human-turn');
      this.elements.turnTitle.innerHTML = '⚔️ YOUR TURN, CAPTAIN!';
      this.elements.turnSubtitle.textContent = 'Select a heap and choose how many gold coins to take.';
    } else {
      banner.classList.add('ai-turn');
      this.elements.turnTitle.innerHTML = '🤖 CAPTAIN GRUNDY IS CALCULATING...';
      this.elements.turnSubtitle.textContent = 'Evaluating bitwise XOR parity & optimal Grundy reduction.';
    }

    if (this.elements.turnTurnCounter) {
      this.elements.turnTurnCounter.textContent = `Turn #${this.engine.moveHistory.length + 1}`;
    }
  }

  // 5. Render Pirate Heaps with Individual Gold Coins
  renderHeaps() {
    const container = this.elements.heapsContainer;
    if (!container) return;
    container.innerHTML = '';

    // Auto-select first available non-empty heap if none selected or selected is empty
    if (this.selectedHeapIndex === -1 || this.engine.heaps[this.selectedHeapIndex] === 0) {
      const firstValid = this.engine.heaps.findIndex(h => h > 0);
      this.selectedHeapIndex = firstValid !== -1 ? firstValid : 0;
      this.selectedCoinCount = 1;
    }

    this.engine.heaps.forEach((count, idx) => {
      const isSelected = idx === this.selectedHeapIndex && count > 0;
      const grundy = this.engine.getGrundy(idx);
      const binaryStr = count.toString(2).padStart(4, '0');

      const card = document.createElement('div');
      card.className = `heap-card glass-panel ${isSelected ? 'selected' : ''} ${count === 0 ? 'empty-heap' : ''}`;
      card.dataset.heapIndex = idx;

      // Card Header
      const topMeta = document.createElement('div');
      topMeta.className = 'heap-top-meta';
      topMeta.innerHTML = `
        <div class="heap-title">
          <span>🪙 Heap ${idx + 1}</span>
          <span class="badge ${count > 0 ? 'badge-gold' : 'badge-danger'}">${count > 0 ? 'Active' : 'Depleted'}</span>
        </div>
        <div class="heap-count-pill">${count} coins</div>
      `;

      // Sub meta with Grundy & Binary
      const mathMeta = document.createElement('div');
      mathMeta.className = 'heap-math-info';
      mathMeta.innerHTML = `
        <span>Grundy: <strong class="text-gold">G = ${grundy}</strong></span>
        <span>•</span>
        <span>Binary: <code class="font-mono text-teal">${binaryStr}₂</code></span>
      `;

      // Coins Canvas / Stage
      const coinsStage = document.createElement('div');
      coinsStage.className = 'coins-stage';

      if (count === 0) {
        coinsStage.innerHTML = `<span class="empty-heap-label">Empty Heap</span>`;
      } else {
        for (let c = 0; c < count; c++) {
          const coin = document.createElement('div');
          coin.className = 'pirate-coin';
          coin.dataset.coinIndex = c;
          coin.dataset.heapIndex = idx;
          coin.title = `Coin #${c + 1} of Heap ${idx + 1}`;

          // Highlight coins marked to remove
          if (isSelected && c >= (count - this.selectedCoinCount)) {
            coin.classList.add('to-remove');
          }

          coin.innerHTML = `
            <div class="coin-inner-ring">
              <span class="coin-insignia">☠</span>
            </div>
          `;

          // Direct coin clicking: click coin to set removal count
          coin.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.engine.currentTurn !== 'human' || this.isAiProcessing) return;
            this.selectedHeapIndex = idx;
            const coinsAbove = count - c;
            this.selectedCoinCount = Math.max(1, coinsAbove);
            this.audio.playCoinClink();
            this.renderHeaps();
            this.renderMoveControls();
          });

          coinsStage.appendChild(coin);
        }
      }

      card.appendChild(topMeta);
      card.appendChild(mathMeta);
      card.appendChild(coinsStage);

      // Card click event
      card.addEventListener('click', () => {
        if (this.engine.currentTurn !== 'human' || this.isAiProcessing || count === 0) return;
        this.selectedHeapIndex = idx;
        if (this.selectedCoinCount > count) {
          this.selectedCoinCount = 1;
        }
        this.audio.playClick();
        this.renderHeaps();
        this.renderMoveControls();
      });

      container.appendChild(card);
    });
  }

  // 6. Render Move Controls (+ / - counter & Take Coins button)
  renderMoveControls() {
    const isHuman = this.engine.currentTurn === 'human' && !this.isAiProcessing;
    const currentHeapSize = this.selectedHeapIndex >= 0 ? this.engine.heaps[this.selectedHeapIndex] : 0;

    if (this.elements.selectedHeapLabel) {
      if (this.selectedHeapIndex >= 0 && currentHeapSize > 0) {
        this.elements.selectedHeapLabel.textContent = `Selected: Heap ${this.selectedHeapIndex + 1} (${currentHeapSize} coins available)`;
      } else {
        this.elements.selectedHeapLabel.textContent = 'Please select a non-empty heap';
      }
    }

    if (this.elements.counterValue) {
      this.elements.counterValue.textContent = this.selectedCoinCount;
    }

    if (this.elements.btnCounterMinus) {
      this.elements.btnCounterMinus.disabled = !isHuman || this.selectedCoinCount <= 1;
    }

    if (this.elements.btnCounterPlus) {
      this.elements.btnCounterPlus.disabled = !isHuman || this.selectedCoinCount >= currentHeapSize;
    }

    if (this.elements.btnTakeCoins) {
      const isValid = isHuman && currentHeapSize > 0 && this.selectedCoinCount >= 1 && this.selectedCoinCount <= currentHeapSize;
      this.elements.btnTakeCoins.disabled = !isValid;
    }
  }

  // 7. Render Live Nim-Sum & Bitwise Parity Strategy Panel
  renderLiveStrategyPanel() {
    const nimSum = this.engine.getNimSum();
    const binarySum = nimSum.toString(2).padStart(4, '0');

    if (this.elements.nimSumNumber) {
      this.elements.nimSumNumber.textContent = nimSum;
    }

    if (this.elements.nimSumBinary) {
      this.elements.nimSumBinary.textContent = `(${binarySum}₂)`;
    }

    if (this.elements.nimSumStateBadge) {
      if (nimSum === 0) {
        this.elements.nimSumStateBadge.className = 'badge badge-success';
        this.elements.nimSumStateBadge.innerHTML = '⚓ BALANCED (P-Position: Previous Mover Wins)';
      } else {
        this.elements.nimSumStateBadge.className = 'badge badge-gold';
        this.elements.nimSumStateBadge.innerHTML = '⚔️ UNBALANCED (N-Position: Current Mover Can Win)';
      }
    }

    // Render Bitwise Table
    const tbody = this.elements.bitwiseTableBody;
    if (tbody) {
      tbody.innerHTML = '';
      const columnSums = [0, 0, 0, 0]; // 8s, 4s, 2s, 1s bit columns

      this.engine.heaps.forEach((hSize, idx) => {
        const bin = hSize.toString(2).padStart(4, '0');
        const bits = bin.split('').map(Number);
        bits.forEach((b, col) => {
          columnSums[col] += b;
        });

        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>Heap ${idx + 1}</strong></td>
          <td class="text-gold font-mono">${hSize}</td>
          <td><span class="bit-cell ${bits[0] ? 'active-bit' : ''}">${bits[0]}</span></td>
          <td><span class="bit-cell ${bits[1] ? 'active-bit' : ''}">${bits[1]}</span></td>
          <td><span class="bit-cell ${bits[2] ? 'active-bit' : ''}">${bits[2]}</span></td>
          <td><span class="bit-cell ${bits[3] ? 'active-bit' : ''}">${bits[3]}</span></td>
          <td class="text-teal font-mono">G = ${hSize}</td>
        `;
        tbody.appendChild(row);
      });

      // Parity Calculation Row
      if (this.elements.parityRow) {
        const bitSumBits = binarySum.split('').map(Number);
        this.elements.parityRow.innerHTML = `
          <td><strong>Column Parity</strong></td>
          <td class="text-gold font-mono">${nimSum}</td>
          <td><span class="bit-cell ${columnSums[0] % 2 !== 0 ? 'odd-parity' : 'even-parity'}">${columnSums[0]} (${columnSums[0] % 2 === 0 ? 'Even' : 'Odd'})</span></td>
          <td><span class="bit-cell ${columnSums[1] % 2 !== 0 ? 'odd-parity' : 'even-parity'}">${columnSums[1]} (${columnSums[1] % 2 === 0 ? 'Even' : 'Odd'})</span></td>
          <td><span class="bit-cell ${columnSums[2] % 2 !== 0 ? 'odd-parity' : 'even-parity'}">${columnSums[2]} (${columnSums[2] % 2 === 0 ? 'Even' : 'Odd'})</span></td>
          <td><span class="bit-cell ${columnSums[3] % 2 !== 0 ? 'odd-parity' : 'even-parity'}">${columnSums[3]} (${columnSums[3] % 2 === 0 ? 'Even' : 'Odd'})</span></td>
          <td class="text-gold font-mono">Sum: ${nimSum}</td>
        `;
      }
    }
  }

  // 8. Render AI Explanation Card
  renderAiExplanation() {
    const card = this.elements.aiExplanationCard;
    const textEl = this.elements.aiExplanationText;
    if (!card || !textEl) return;

    const lastMove = this.engine.lastAiMoveDetails;
    if (!lastMove) {
      textEl.innerHTML = `<em>Captain Grundy is observing the waters. Once the AI makes a move, the mathematical XOR rationale and Grundy reduction will be displayed here.</em>`;
      return;
    }

    let mathStepDetails = '';
    if (lastMove.allEvaluations && lastMove.allEvaluations.length > 0) {
      const evalList = lastMove.allEvaluations.map(e => {
        const note = e.isSmaller ? `<strong>${e.currentSize} ⊕ ${lastMove.previousNimSum} = ${e.targetSize}</strong> (< ${e.currentSize}, optimal reduction: take ${e.coinsToRemove} coins!)` 
                                  : `${e.currentSize} ⊕ ${lastMove.previousNimSum} = ${e.targetSize} (not smaller than ${e.currentSize})`;
        return `• ${e.heapName}: ${note}`;
      }).join('<br>');
      mathStepDetails = `<div style="margin-top: 8px; font-size: 0.82rem; background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">${evalList}</div>`;
    }

    textEl.innerHTML = `
      <strong>AI Move:</strong> Removed <strong>${lastMove.coinsToRemove}</strong> coin(s) from <strong>Heap ${lastMove.heapIndex + 1}</strong>.<br>
      <div style="margin-top: 6px;">${lastMove.explanation}</div>
      ${mathStepDetails}
    `;
  }

  // 9. Update AI Mood / Portrait
  updateAiMood() {
    const moodEl = this.elements.aiMoodStatus;
    const dot = this.elements.aiPulseDot;
    const nimSum = this.engine.getNimSum();

    if (this.isAiProcessing) {
      if (moodEl) moodEl.textContent = 'Calculating XOR Parity...';
      if (dot) dot.className = 'ai-pulse-dot thinking';
    } else {
      if (dot) dot.className = 'ai-pulse-dot';
      if (moodEl) {
        if (nimSum === 0) {
          moodEl.textContent = 'Confident (P-Position Dominance)';
          moodEl.style.color = '#10b981';
        } else {
          moodEl.textContent = 'Vulnerable (N-Position Disruption)';
          moodEl.style.color = '#38bdf8';
        }
      }
    }
  }

  // 10. Render Move History Log
  renderMoveHistory() {
    const list = this.elements.historyList;
    if (!list) return;
    list.innerHTML = '';

    if (this.engine.moveHistory.length === 0) {
      list.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; padding: 10px 0;">No moves recorded yet.</div>`;
      return;
    }

    // Render in reverse order (newest on top)
    [...this.engine.moveHistory].reverse().forEach(record => {
      const item = document.createElement('div');
      item.className = `history-item ${record.player === 'ai' ? 'ai-move' : ''}`;
      const playerLabel = record.player === 'human' ? '⚔️ Human' : '🤖 AI';
      item.innerHTML = `
        <div>
          <strong>#${record.turnNumber} ${playerLabel}:</strong> Took ${record.coinsRemoved} from ${record.heapName}
        </div>
        <div class="font-mono text-muted">
          ${record.oldNimSum} ➔ <span class="text-gold">${record.newNimSum}</span>
        </div>
      `;
      list.appendChild(item);
    });
  }

  // 11. Render AI Tutor Chat Stream
  renderTutorMessages() {
    const container = this.elements.tutorMessagesStream;
    if (!container) return;
    container.innerHTML = '';

    this.tutor.messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.sender}`;
      bubble.innerHTML = msg.text;
      container.appendChild(bubble);
    });

    // Auto-scroll to bottom
    container.scrollTop = container.scrollHeight;
  }

  // 12. Human Move Execution
  executeHumanMove() {
    if (this.engine.currentTurn !== 'human' || this.isAiProcessing) return;

    const heapIdx = this.selectedHeapIndex;
    const count = this.selectedCoinCount;

    if (!this.engine.isValidMove(heapIdx, count)) {
      alert('Invalid move selection! Please select a valid heap and coin count.');
      return;
    }

    // Animate coins in the DOM
    this.animateCoinRemoval(heapIdx, count, () => {
      this.audio.playCoinRemove();
      this.engine.makeMove(heapIdx, count, 'human');
      this.renderFullGame();

      if (this.engine.isGameOver()) {
        this.handleGameOver('human');
      } else {
        // Trigger AI Turn
        this.triggerAiTurn();
      }
    });
  }

  // 13. AI Turn Execution with Realistic Thinking Delay
  triggerAiTurn() {
    this.isAiProcessing = true;
    this.renderTurnBanner();
    this.updateAiMood();
    this.renderMoveControls();

    // 1.2 second thinking delay for strategic suspense
    setTimeout(() => {
      if (this.engine.isGameOver()) {
        this.isAiProcessing = false;
        return;
      }

      const aiDecision = this.engine.computeAiMove();
      if (!aiDecision) {
        this.isAiProcessing = false;
        return;
      }

      // Highlight heap card
      const heapCards = document.querySelectorAll('.heap-card');
      if (heapCards[aiDecision.heapIndex]) {
        heapCards[aiDecision.heapIndex].classList.add('ai-highlight');
      }

      // Animate AI coin removal
      setTimeout(() => {
        this.animateCoinRemoval(aiDecision.heapIndex, aiDecision.coinsToRemove, () => {
          this.audio.playAiMove();
          this.engine.makeMove(aiDecision.heapIndex, aiDecision.coinsToRemove, 'ai');
          this.isAiProcessing = false;
          this.renderFullGame();

          if (this.engine.isGameOver()) {
            this.handleGameOver('ai');
          }
        });
      }, 500);

    }, 1100);
  }

  // 14. Animate Coins Disappearing
  animateCoinRemoval(heapIndex, countToRemove, callback) {
    const heapCards = document.querySelectorAll('.heap-card');
    const targetCard = heapCards[heapIndex];
    if (!targetCard) {
      if (callback) callback();
      return;
    }

    const coins = targetCard.querySelectorAll('.pirate-coin');
    const totalCoins = coins.length;
    const startIndex = Math.max(0, totalCoins - countToRemove);

    for (let i = startIndex; i < totalCoins; i++) {
      if (coins[i]) {
        coins[i].classList.add('animating-out');
      }
    }

    setTimeout(() => {
      if (callback) callback();
    }, 550);
  }

  // 15. Game Over Handler
  handleGameOver(winner) {
    const isHumanWin = winner === 'human';
    const totalMoves = this.engine.moveHistory.length;
    const durationSeconds = Math.round((Date.now() - this.engine.startTime) / 1000);
    const finalMove = this.engine.moveHistory[this.engine.moveHistory.length - 1];

    if (isHumanWin) {
      this.audio.playVictory();
      this.triggerConfetti();
      this.elements.gameOverTitle.textContent = "VICTORY AT SEA!";
      this.elements.gameOverTitle.className = 'victory-title';
      this.elements.gameOverSubtitle.textContent = "You outsmarted Captain Grundy and claimed the Pirate's Treasure!";
      this.elements.gameOverWinner.textContent = "Human Captain";
      this.elements.gameOverWinner.style.color = "var(--gold-bright)";
    } else {
      this.audio.playDefeat();
      this.elements.gameOverTitle.textContent = "DEFEAT ON THE TIDES!";
      this.elements.gameOverTitle.className = 'defeat-title';
      this.elements.gameOverSubtitle.textContent = "Captain Grundy's optimal XOR algorithm has seized the bounty!";
      this.elements.gameOverWinner.textContent = "Captain Grundy (AI)";
      this.elements.gameOverWinner.style.color = "#f87171";
    }

    this.elements.gameOverMoves.textContent = totalMoves;
    this.elements.gameOverDuration.textContent = `${durationSeconds}s`;

    if (finalMove) {
      this.elements.gameOverExplanation.innerHTML = `
        <strong>Winning Move:</strong> ${finalMove.player === 'human' ? 'You' : 'AI'} removed ${finalMove.coinsRemoved} coin(s) from ${finalMove.heapName}, clearing the final heap and completing the zero-sum victory under Normal Nim rules!
      `;
    }

    if (this.elements.modalGameOver) {
      this.elements.modalGameOver.classList.add('active');
    }
  }

  // 16. Confetti Cannon
  triggerConfetti() {
    const container = document.body;
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor = ['#f5d76e', '#ffea79', '#38bdf8', '#10b981', '#f3c642'][Math.floor(Math.random() * 5)];
      piece.style.animationDelay = `${Math.random() * 1.5}s`;
      piece.style.width = `${Math.random() * 8 + 6}px`;
      piece.style.height = `${Math.random() * 12 + 6}px`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 4000);
    }
  }

  // 17. Bind Event Listeners
  bindEvents() {
    // Navigation / Screen routing
    if (this.elements.btnStartPlaying) {
      this.elements.btnStartPlaying.addEventListener('click', () => {
        this.audio.playClick();
        this.switchScreen('rules');
      });
    }

    if (this.elements.btnHowToPlayHero) {
      this.elements.btnHowToPlayHero.addEventListener('click', () => {
        this.audio.playClick();
        this.switchScreen('rules');
      });
    }

    if (this.elements.btnNavRules) {
      this.elements.btnNavRules.addEventListener('click', () => {
        this.audio.playClick();
        this.switchScreen('rules');
      });
    }

    if (this.elements.btnBackToWelcome) {
      this.elements.btnBackToWelcome.addEventListener('click', () => {
        this.audio.playClick();
        this.switchScreen('landing');
      });
    }

    // Rules Acceptance Checkbox Gate
    if (this.elements.checkRulesAccepted && this.elements.btnAcceptRules) {
      this.elements.checkRulesAccepted.addEventListener('change', (e) => {
        this.elements.btnAcceptRules.disabled = !e.target.checked;
      });

      this.elements.btnAcceptRules.addEventListener('click', () => {
        if (!this.elements.checkRulesAccepted.checked) return;
        this.audio.playClick();
        this.switchScreen('gameplay');
      });
    }

    // Sound Toggle Button
    if (this.elements.btnNavSound) {
      this.elements.btnNavSound.addEventListener('click', () => {
        this.audio.toggleMute();
        this.updateSoundIcon();
        if (!this.audio.isMuted) {
          this.audio.playClick();
        }
      });
    }

    // Header Restart & New Game
    if (this.elements.btnNavRestart) {
      this.elements.btnNavRestart.addEventListener('click', () => {
        this.audio.playClick();
        if (confirm('Restart current game with default heaps?')) {
          this.engine.restart();
          this.selectedHeapIndex = -1;
          this.renderFullGame();
        }
      });
    }

    if (this.elements.btnNavNewGame) {
      this.elements.btnNavNewGame.addEventListener('click', () => {
        this.audio.playClick();
        if (this.elements.modalNewGame) {
          this.elements.modalNewGame.classList.add('active');
        }
      });
    }

    // Counter Plus / Minus
    if (this.elements.btnCounterMinus) {
      this.elements.btnCounterMinus.addEventListener('click', () => {
        if (this.selectedCoinCount > 1) {
          this.selectedCoinCount--;
          this.audio.playCoinClink();
          this.renderHeaps();
          this.renderMoveControls();
        }
      });
    }

    if (this.elements.btnCounterPlus) {
      this.elements.btnCounterPlus.addEventListener('click', () => {
        const curSize = this.selectedHeapIndex >= 0 ? this.engine.heaps[this.selectedHeapIndex] : 0;
        if (this.selectedCoinCount < curSize) {
          this.selectedCoinCount++;
          this.audio.playCoinClink();
          this.renderHeaps();
          this.renderMoveControls();
        }
      });
    }

    // Take Coins Action Button
    if (this.elements.btnTakeCoins) {
      this.elements.btnTakeCoins.addEventListener('click', () => {
        this.executeHumanMove();
      });
    }

    // Tutor Chat Input & Send
    const sendTutorQuestion = () => {
      const q = this.elements.tutorInput.value.trim();
      if (!q) return;
      this.audio.playClick();
      this.tutor.respond(q);
      this.elements.tutorInput.value = '';
      this.renderTutorMessages();
    };

    if (this.elements.tutorSendBtn) {
      this.elements.tutorSendBtn.addEventListener('click', sendTutorQuestion);
    }

    if (this.elements.tutorInput) {
      this.elements.tutorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          sendTutorQuestion();
        }
      });
    }

    // Tutor Suggested Quick Prompts
    if (this.elements.quickPromptsContainer) {
      this.elements.quickPromptsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.prompt-chip');
        if (!chip) return;
        const q = chip.textContent.trim();
        this.audio.playClick();
        this.tutor.respond(q);
        this.renderTutorMessages();
      });
    }

    // New Game Modal Controls
    if (this.elements.modalCloseNewGame) {
      this.elements.modalCloseNewGame.addEventListener('click', () => {
        this.elements.modalNewGame.classList.remove('active');
      });
    }

    if (this.elements.presetButtons) {
      this.elements.presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.elements.presetButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (this.elements.inputHeapCustom) {
            this.elements.inputHeapCustom.value = btn.dataset.heaps;
          }
        });
      });
    }

    if (this.elements.btnStartCustomGame) {
      this.elements.btnStartCustomGame.addEventListener('click', () => {
        const raw = this.elements.inputHeapCustom.value;
        const parsed = raw.split(/[\s,]+/).map(n => parseInt(n.trim(), 10)).filter(n => !isNaN(n) && n > 0 && n <= 15);

        if (parsed.length < 2) {
          alert('Please enter at least 2 heap sizes between 1 and 15 (e.g. "3, 4, 5, 2").');
          return;
        }

        const startPlayer = this.elements.selectStartPlayer.value;
        const diff = this.elements.selectDifficulty.value;

        this.engine.configureNewGame(parsed, startPlayer, diff);
        this.selectedHeapIndex = -1;
        this.selectedCoinCount = 1;
        this.elements.modalNewGame.classList.remove('active');
        this.renderFullGame();

        if (startPlayer === 'ai') {
          this.triggerAiTurn();
        }
      });
    }

    // Game Over Modal Controls
    if (this.elements.btnPlayAgain) {
      this.elements.btnPlayAgain.addEventListener('click', () => {
        this.elements.modalGameOver.classList.remove('active');
        this.engine.restart();
        this.selectedHeapIndex = -1;
        this.selectedCoinCount = 1;
        this.renderFullGame();
      });
    }

    if (this.elements.btnGameOverNewGame) {
      this.elements.btnGameOverNewGame.addEventListener('click', () => {
        this.elements.modalGameOver.classList.remove('active');
        this.elements.modalNewGame.classList.add('active');
      });
    }
  }
}
