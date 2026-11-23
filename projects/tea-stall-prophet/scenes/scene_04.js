// Visual specification for scene_04
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
      "blouse": "#C4985B",
      "glasses": true,
      "baby": true,
      "expr": "neutral",
      "anim": "talk-still",
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
      "expr": "neutral",
      "anim": "idle",
      "x": 480,
      "y": 880,
      "scale": 2.35
    }
  ],
  "dialogue": {
    "speakerId": "dadi",
    "speakerX": 350,
    "speakerY": 1140,
    "text": "Why are you sweating like a madman under the afternoon sun?",
    "start": 0.15,
    "end": 3.3,
    "fontSize": 40
  }
};
export default sceneConfig;
