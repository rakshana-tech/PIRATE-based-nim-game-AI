/* ==========================================================================
   PIRATE'S NIM: THE AI TREASURE CHALLENGE
   Main Application Bootstrapper
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Mathematical Game Engine
  const engine = new NimEngine({
    heaps: [3, 4, 5, 2],
    startTurn: 'human',
    difficulty: 'optimal'
  });

  // 2. Initialize AI Tutor
  const tutor = new NimTutor(engine);

  // 3. Initialize UI Controller
  const ui = new NimUI(engine, tutor, gameAudio);

  // 4. Initial Navigation Screen: Welcome Landing Page
  ui.switchScreen('landing');

  // 5. Expose for console testing & strategy exploration
  window.piratesNim = {
    engine,
    tutor,
    ui,
    audio: gameAudio
  };

  console.log('⚓ PIRATE\'S NIM: THE AI TREASURE CHALLENGE initialized successfully.');
});
