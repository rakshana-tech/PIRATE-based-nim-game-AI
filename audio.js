/* ==========================================================================
   PIRATE'S NIM: THE AI TREASURE CHALLENGE
   Procedural Web Audio Engine (Zero external dependencies)
   ========================================================================== */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('pirates_nim_muted') === 'true';
    this.hasUnlocked = false;

    // Attach interaction listener to unlock AudioContext on first gesture
    const unlockAudio = () => {
      this.initContext();
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.hasUnlocked = true;
      ['click', 'keydown', 'touchstart'].forEach(e => 
        document.removeEventListener(e, unlockAudio)
      );
    };

    ['click', 'keydown', 'touchstart'].forEach(e => 
      document.addEventListener(e, unlockAudio, { once: true })
    );
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('pirates_nim_muted', this.isMuted.toString());
    return this.isMuted;
  }

  // 1. Single Gold Doubloon Clink (Metallic ring with fast decay)
  playCoinClink() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Sharp high frequency bell-like tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, t);
      osc.frequency.exponentialRampToValueAtTime(1200, t + 0.18);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.18);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 2. Coin Heap Removal / Scoop (Rapid ascending melodic clinks)
  playCoinRemove() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [1046.5, 1318.5, 1567.98]; // C6, E6, G6
      notes.forEach((freq, idx) => {
        const t = this.ctx.currentTime + idx * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.2, t + 0.12);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 3. AI Strategic Calculation Move (Tactical digital submarine sonar pulse)
  playAiMove() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.25);

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.3);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 4. Grand Victory Fanfare (Golden major chords)
  playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const melody = [
        { freq: 523.25, time: 0.0, dur: 0.2 }, // C5
        { freq: 659.25, time: 0.18, dur: 0.2 }, // E5
        { freq: 783.99, time: 0.36, dur: 0.2 }, // G5
        { freq: 1046.50, time: 0.54, dur: 0.6 } // C6
      ];

      melody.forEach(n => {
        const t = this.ctx.currentTime + n.time;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + n.dur);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 5. Defeat Gong (Low solemn minor toll)
  playDefeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(146.83, t); // D3
      osc.frequency.exponentialRampToValueAtTime(73.42, t + 0.8);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.8);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // 6. Tactile UI Click (Wooden ship peg)
  playClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, t);
      osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.04);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }
}

// Global audio singleton
const gameAudio = new SoundManager();
