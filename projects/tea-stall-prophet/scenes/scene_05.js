// Visual specification for scene_05
export const sceneConfig = {
  "background": "house",
  "characters": [
    {
      "id": "dadi",
      "age": "elder",
      "outfit": "saree",
      "hat": "pallu",
      "shirt": "#F7F4EC",
      "pants": "#9A4141",
      "glasses": true,
      "baby": true,
      "expr": "neutral",
      "anim": "idle",
      "x": 120,
      "y": 880,
      "scale": 2.3
    },
    {
      "id": "rahat",
      "age": "adult",
      "outfit": "shirt",
      "shirt": "#5D7A94",
      "pants": "#889396",
      "expr": "happy",
      "anim": "talk-still",
      "x": 480,
      "y": 880,
      "scale": 2.35
    }
  ],
  "dialogue": {
    "speakerId": "rahat",
    "speakerX": 720,
    "speakerY": 1140,
    "text": "Chacha said his joints are aching, and that always means heavy rain!",
    "start": 0.15,
    "end": 4.1,
    "fontSize": 38
  }
};
export default sceneConfig;
