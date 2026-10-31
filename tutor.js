/* ==========================================================================
   PIRATE'S NIM: THE AI TREASURE CHALLENGE
   Intelligent Context-Aware AI Tutor ("NIM AI TUTOR")
   ========================================================================== */

class NimTutor {
  constructor(engine) {
    this.engine = engine;
    this.messages = [];
    this.name = "Navigator Bernoulli (NIM AI TUTOR)";

    // Initial greeting
    this.messages.push({
      sender: 'tutor',
      text: `Ahoy, Captain! I am <strong>Navigator Bernoulli</strong>, your AI Strategy Tutor. I will guide you through the mathematical secrets of the Seven Seas — from <strong>Bitwise XOR</strong> to <strong>Grundy Numbers</strong>. Click any prompt below or type your question!`
    });
  }

  // Set or update engine reference
  setEngine(engine) {
    this.engine = engine;
  }

  // Answer a question given user input string
  respond(rawInput) {
    const input = (rawInput || '').trim().toLowerCase();
    let reply = '';

    if (!input) {
      return "Ask me anything about XOR, Grundy numbers, Nim-sum, or the AI's moves!";
    }

    // 1. "What is Nim Game?"
    if (input.includes('what is nim') || input.includes('about nim') || input.includes('nim game')) {
      reply = `<strong>Nim</strong> is an ancient mathematical game of strategy for two players. Several heaps of tokens (or pirate gold coins!) are arranged on the table. On each turn, a player must remove one or more coins from any single heap.<br><br>Under <strong>Normal Play convention</strong>, the player who takes the very last coin wins the entire treasure! In 1901, Harvard mathematician Charles L. Bouton proved that Nim is completely solvable using binary digital sums (XOR).`;
    }

    // 2. "Explain XOR operation"
    else if (input.includes('xor') || input.includes('exclusive or')) {
      reply = `<strong>Bitwise XOR (Exclusive OR)</strong>, written as <code>⊕</code> or <code>^</code>, is addition without carry in binary:<br><br>
      • <code>0 ⊕ 0 = 0</code><br>
      • <code>1 ⊕ 0 = 1</code><br>
      • <code>0 ⊕ 1 = 1</code><br>
      • <code>1 ⊕ 1 = 0</code> (even parity cancels out!)<br><br>
      When you XOR two numbers, any bit column with an <em>even</em> number of 1s becomes <code>0</code>, while an <em>odd</em> number of 1s becomes <code>1</code>. In Nim, this measures whether the coin columns are balanced or vulnerable!`;
    }

    // 3. "What is Nim-sum?"
    else if (input.includes('nim-sum') || input.includes('nim sum')) {
      const heaps = this.engine.heaps;
      const currentSum = this.engine.getNimSum();
      const formula = heaps.map((h, i) => `H${i+1}(${h})`).join(' ⊕ ');

      reply = `The <strong>Nim-sum</strong> is the bitwise XOR sum of all heap sizes:<br>
      <code>Nim-sum = ${formula} = ${currentSum}</code>.<br><br>
      • <strong>Nim-sum = 0 (P-Position):</strong> The heaps are balanced. Any legal move will disrupt this balance and produce a non-zero Nim-sum. It is theoretically losing for the player whose turn it is!<br>
      • <strong>Nim-sum ≠ 0 (N-Position):</strong> The heaps are unbalanced. The player to move can always make a move that restores the Nim-sum to 0!`;
    }

    // 4. "Why did AI remove these coins?" or "Explain the last move"
    else if (input.includes('why did ai') || input.includes('last move') || input.includes('explain move') || input.includes('previous move')) {
      const lastMove = this.engine.lastAiMoveDetails;
      if (!lastMove) {
        reply = "Captain Grundy hasn't made a move yet in this game! Make your opening move and I will analyze his response.";
      } else {
        const hName = `Heap ${lastMove.heapIndex + 1}`;
        const prevSum = lastMove.previousNimSum;
        const target = lastMove.targetHeapSize;
        const curSize = lastMove.currentHeapSize;
        const count = lastMove.coinsToRemove;

        if (lastMove.isMathematicallyOptimal) {
          reply = `<strong>AI Move Breakdown:</strong><br>
          Before moving, the Nim-sum was <code>${prevSum}</code>.<br>
          1. Captain Grundy calculated target size: <code>${curSize} ⊕ ${prevSum} = ${target}</code>.<br>
          2. Since <code>${target} < ${curSize}</code>, he reduced <strong>${hName}</strong> by <code>${count}</code> coin(s) (leaving ${target}).<br>
          3. This made the new Nim-sum exactly <strong>0</strong>.<br><br>
          <em>Outcome:</em> You have been handed a balanced P-position, leaving you vulnerable to optimal counterplay!`;
        } else {
          reply = `Captain Grundy removed <code>${count}</code> coin(s) from <strong>${hName}</strong>.<br>
          Notice that the Nim-sum before this move was already 0! In a 0-sum position, no move can maintain balance, so the AI played defensively to test your skill.`;
        }
      }
    }

    // 5. "Explain Grundy numbers"
    else if (input.includes('grundy') || input.includes('sprague') || input.includes('mex')) {
      reply = `In combinatorial game theory, <strong>Grundy Numbers</strong> (or Nim-values) generalize any impartial game into an equivalent heap of Nim via the <strong>Sprague-Grundy Theorem</strong>.<br><br>
      For a standard heap of <code>k</code> coins where you can take any number of coins, the Grundy value is simply:<br>
      <code>G(k) = k</code>.<br><br>
      The combined Grundy value for heaps is: <code>G(H₁) ⊕ G(H₂) ⊕ ... = Nim-sum</code>.<br>
      When the combined Grundy value is 0, the position is terminal or zero-sum!`;
    }

    // 6. "How can I win against AI?" or "Hint" / "Suggest move"
    else if (input.includes('how can i win') || input.includes('win against ai') || input.includes('hint') || input.includes('suggest') || input.includes('what should i do')) {
      const nimSum = this.engine.getNimSum();
      const optimalMoves = this.engine.findOptimalMoves();

      if (this.engine.isGameOver()) {
        reply = "The game has already concluded! Start a new game and ask me for a hint on your first turn.";
      } else if (nimSum === 0) {
        reply = `<strong>Tactical Warning:</strong> The current Nim-sum is already <code>0</code> (a balanced P-position).<br>
        Mathematically, if the AI plays perfectly, it has the upper hand. However, you can make a small, tricky move (like taking 1 coin from the largest heap) and hope the AI slips or you capitalize on lower difficulty levels!`;
      } else {
        const best = optimalMoves[0];
        reply = `<strong>Winning Tactic Available!</strong><br>
        The current Nim-sum is <code>${nimSum}</code> (an N-position). You hold the mathematical advantage!<br><br>
        <strong>Recommended Move:</strong><br>
        Select <strong>${best.heapName}</strong> (currently ${best.currentHeap} coins) and remove <strong>${best.coinsToRemove}</strong> coin(s).<br>
        This leaves ${best.targetSize} coins and resets the Nim-sum to <strong>0</strong>, trapping Captain Grundy!`;
      }
    }

    // 7. "Current state" / "Heap sizes" / "Binary"
    else if (input.includes('current') || input.includes('state') || input.includes('binary') || input.includes('heaps')) {
      const heaps = this.engine.heaps;
      const nimSum = this.engine.getNimSum();
      const binaryLines = heaps.map((h, i) => `Heap ${i+1}: ${h} (binary: <code>${h.toString(2).padStart(4, '0')}₂</code>)`).join('<br>');

      reply = `<strong>Current Ocean State:</strong><br>
      ${binaryLines}<br><br>
      <strong>Current Nim-sum:</strong> <code>${nimSum} (${nimSum.toString(2).padStart(4, '0')}₂)</code><br>
      ${nimSum === 0 ? '⚓ Balanced (P-Position) - Previous player wins' : '⚔️ Unbalanced (N-Position) - Current player can force a win'}`;
    }

    // 8. "Rules"
    else if (input.includes('rules') || input.includes('how to play')) {
      reply = `<strong>Rules of Pirate's Nim:</strong><br>
      1. Pick any single heap per turn.<br>
      2. Take at least 1 coin (up to all remaining in that heap).<br>
      3. Players alternate turns.<br>
      4. The corsair who takes the last coin claims the entire treasure!`;
    }

    // 9. Greetings
    else if (input.includes('hello') || input.includes('ahoy') || input.includes('hi') || input.includes('who are you')) {
      reply = `Ahoy! I am Navigator Bernoulli. Ask me: <em>"Explain XOR"</em>, <em>"How can I win against AI?"</em>, or <em>"Why did AI remove these coins?"</em> and I'll lay out the mathematical charts!`;
    }

    // 10. Default fallback
    else {
      const nimSum = this.engine.getNimSum();
      reply = `Intriguing question! On our current board, the Nim-sum is <code>${nimSum}</code>.<br>
      Remember the pirate's golden rule: whenever your turn comes and the Nim-sum is greater than 0, there is always at least one heap you can reduce to make the resulting Nim-sum exactly 0! Ask me <em>"How can I win against AI?"</em> for the exact move!`;
    }

    // Save message
    this.messages.push({ sender: 'user', text: rawInput });
    this.messages.push({ sender: 'tutor', text: reply });

    return reply;
  }
}
