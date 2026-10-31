/* ==========================================================================
   PIRATE'S NIM: THE AI TREASURE CHALLENGE
   Mathematical Nim Game Engine & Bitwise Strategy Solver
   ========================================================================== */

class NimEngine {
  constructor(options = {}) {
    this.defaultHeaps = options.heaps ? [...options.heaps] : [3, 4, 5, 2];
    this.heaps = [...this.defaultHeaps];
    this.currentTurn = options.startTurn || 'human'; // 'human' or 'ai'
    this.difficulty = options.difficulty || 'optimal'; // 'optimal', 'tactical', 'casual'
    this.moveHistory = [];
    this.lastAiMoveDetails = null;
    this.winner = null;
    this.isOver = false;
    this.startTime = Date.now();
  }

  // 1. Calculate Nim-Sum (XOR of all heaps)
  static calculateNimSum(heaps) {
    return heaps.reduce((acc, count) => acc ^ count, 0);
  }

  getNimSum() {
    return NimEngine.calculateNimSum(this.heaps);
  }

  // 2. Grundy Number Calculation
  // In normal play Nim, Grundy value G(k) = k for any heap of size k.
  getGrundy(heapIndex) {
    if (heapIndex < 0 || heapIndex >= this.heaps.length) return 0;
    return this.heaps[heapIndex];
  }

  getCombinedGrundy() {
    return this.getNimSum();
  }

  // 3. Game Over Status (Normal Play: Last player to take a coin wins)
  isGameOver() {
    return this.heaps.every(h => h === 0);
  }

  // 4. Move Validation
  isValidMove(heapIndex, count) {
    if (this.isOver) return false;
    if (heapIndex < 0 || heapIndex >= this.heaps.length) return false;
    if (typeof count !== 'number' || count <= 0) return false;
    return count <= this.heaps[heapIndex];
  }

  // 5. Execute Move
  makeMove(heapIndex, count, player = this.currentTurn) {
    if (!this.isValidMove(heapIndex, count)) {
      throw new Error(`Illegal Move: Cannot remove ${count} coins from Heap ${heapIndex + 1} (${this.heaps[heapIndex]} coins remaining).`);
    }

    const oldNimSum = this.getNimSum();
    const oldHeapSize = this.heaps[heapIndex];
    this.heaps[heapIndex] -= count;
    const newNimSum = this.getNimSum();

    const moveRecord = {
      turnNumber: this.moveHistory.length + 1,
      player, // 'human' or 'ai'
      heapIndex,
      heapName: `Heap ${heapIndex + 1}`,
      coinsRemoved: count,
      oldHeapSize,
      newHeapSize: this.heaps[heapIndex],
      oldNimSum,
      newNimSum,
      timestamp: Date.now()
    };

    this.moveHistory.push(moveRecord);

    if (this.isGameOver()) {
      this.isOver = true;
      this.winner = player; // Normal play: Last move claims the treasure!
    } else {
      this.currentTurn = this.currentTurn === 'human' ? 'ai' : 'human';
    }

    return moveRecord;
  }

  // 6. Find all mathematically optimal moves using Bouton's Theorem (XOR)
  findOptimalMoves() {
    const nimSum = this.getNimSum();
    const optimalMoves = [];

    // If Nim-sum is already 0, it's a P-position (no move can leave Nim-sum = 0)
    if (nimSum === 0) return [];

    for (let i = 0; i < this.heaps.length; i++) {
      const currentHeap = this.heaps[i];
      if (currentHeap === 0) continue;

      const targetSize = currentHeap ^ nimSum;

      // In Bouton's Theorem, if targetSize < currentHeap, reducing to targetSize produces Nim-sum = 0
      if (targetSize < currentHeap) {
        const coinsToRemove = currentHeap - targetSize;
        optimalMoves.push({
          heapIndex: i,
          heapName: `Heap ${i + 1}`,
          currentHeap,
          targetSize,
          coinsToRemove,
          resultingNimSum: 0
        });
      }
    }

    return optimalMoves;
  }

  // 7. Generate AI Decision & Move Explanation
  computeAiMove() {
    const nimSum = this.getNimSum();
    const nonZeroHeapIndices = this.heaps
      .map((size, idx) => ({ size, idx }))
      .filter(item => item.size > 0);

    if (nonZeroHeapIndices.length === 0) return null;

    // Evaluate step-by-step calculation for all heaps (for educational display)
    const evaluations = nonZeroHeapIndices.map(item => {
      const target = item.size ^ nimSum;
      const isSmaller = target < item.size;
      return {
        heapIndex: item.idx,
        heapName: `Heap ${item.idx + 1}`,
        currentSize: item.size,
        targetSize: target,
        isSmaller,
        coinsToRemove: isSmaller ? item.size - target : 0
      };
    });

    const optimalMoves = evaluations.filter(e => e.isSmaller);
    let chosenMove = null;
    let isOptimal = true;
    let strategyReason = '';

    // Determine difficulty-based execution
    const shouldPlayOptimal = () => {
      if (this.difficulty === 'optimal') return true;
      if (this.difficulty === 'tactical') return Math.random() < 0.85;
      if (this.difficulty === 'casual') return Math.random() < 0.60;
      return true;
    };

    if (nimSum !== 0 && optimalMoves.length > 0 && shouldPlayOptimal()) {
      // Pick the best optimal move (prioritize reducing the largest heap or cleanest reduction)
      chosenMove = optimalMoves[0];
      strategyReason = `The current Nim-sum was ${nimSum}. Captain Grundy calculated Target = ${chosenMove.currentSize} ⊕ ${nimSum} = ${chosenMove.targetSize}. Removing ${chosenMove.coinsToRemove} coin(s) from Heap ${chosenMove.heapIndex + 1} produces a balanced Nim-sum of 0, forcing you into a losing P-position!`;
    } else {
      // Nim-sum is 0 (P-position) OR AI made a tactical/casual slip
      isOptimal = false;
      // Make a defensive legal move: take 1 coin from the largest available heap
      nonZeroHeapIndices.sort((a, b) => b.size - a.size);
      const chosenHeap = nonZeroHeapIndices[0];
      const count = 1; // Minimizes damage, hoping human fails to maintain 0-sum

      chosenMove = {
        heapIndex: chosenHeap.idx,
        heapName: `Heap ${chosenHeap.idx + 1}`,
        currentSize: chosenHeap.size,
        targetSize: chosenHeap.size - count,
        isSmaller: true,
        coinsToRemove: count
      };

      if (nimSum === 0) {
        strategyReason = `The Nim-sum was already 0 (a balanced P-position). The AI was in a mathematically losing position against perfect play, so Captain Grundy removed 1 coin from Heap ${chosenMove.heapIndex + 1} to delay and test your strategy.`;
      } else {
        strategyReason = `Captain Grundy tested a diversionary maneuver by removing ${count} coin from Heap ${chosenMove.heapIndex + 1}.`;
      }
    }

    const result = {
      heapIndex: chosenMove.heapIndex,
      coinsToRemove: chosenMove.coinsToRemove,
      currentHeapSize: chosenMove.currentSize,
      targetHeapSize: chosenMove.targetSize,
      previousNimSum: nimSum,
      resultingNimSum: (nimSum ^ chosenMove.currentSize) ^ chosenMove.targetSize,
      isMathematicallyOptimal: isOptimal,
      explanation: strategyReason,
      allEvaluations: evaluations
    };

    this.lastAiMoveDetails = result;
    return result;
  }

  // 8. Reset Current Game Heaps
  restart() {
    this.heaps = [...this.defaultHeaps];
    this.currentTurn = 'human';
    this.moveHistory = [];
    this.lastAiMoveDetails = null;
    this.winner = null;
    this.isOver = false;
    this.startTime = Date.now();
  }

  // 9. Configure New Game
  configureNewGame(newHeaps, startTurn = 'human', difficulty = 'optimal') {
    this.defaultHeaps = [...newHeaps];
    this.heaps = [...newHeaps];
    this.currentTurn = startTurn;
    this.difficulty = difficulty;
    this.moveHistory = [];
    this.lastAiMoveDetails = null;
    this.winner = null;
    this.isOver = false;
    this.startTime = Date.now();
  }
}
