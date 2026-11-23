// Test Scene Specification for village2d style.
// Scene: Wooden house with blue door and hand pump, an old woman with a white head cover and glasses holding a baby, a young man, and one speech bubble.

export const testScene = {
  duration: 3.5,
  background: 'house',
  characters: [
    {
      id: 'old_woman',
      age: 'elder',
      outfit: 'saree',
      hat: 'pallu',
      shirt: '#F7F4EC',      // Soft warm off-white saree & head cover
      pants: '#9A4141',      // Muted madder red saree border
      blouse: '#C4985B',     // Warm earthy mustard blouse
      glasses: true,
      baby: true,            // Holding swaddled baby
      expr: 'happy',
      anim: 'idle',
      x: 70,
      y: 880,
      scale: 2.3
    },
    {
      id: 'young_man',
      age: 'adult',
      outfit: 'shirt',
      shirt: '#5D7A94',      // Dusty desaturated blue village shirt
      pants: '#889396',      // Lighter desaturated slate/grey pants
      hair: '#241B17',
      style: 'short',
      expr: 'happy',
      anim: 'talk-still',    // Body still, mouth moving and subtle head motion
      x: 480,
      y: 880,
      scale: 2.35
    }
  ],
  dialogue: {
    speakerId: 'young_man',
    speakerX: 720,
    speakerY: 1140,
    text: "Dadi, look how peacefully the baby is sleeping today.",
    start: 0.25,
    end: 3.25,
    fontSize: 42
  }
};
