// Visual specification for scene_01
export const sceneConfig = {
  "background": "tea-stall",
  "characters": [
    {
      "id": "tea_chacha",
      "age": "elder",
      "outfit": "lungi",
      "shirt": "#D86B4F",
      "pants": "#3B5875",
      "mustache": true,
      "beard": false,
      "gamchha": true,
      "expr": "happy",
      "anim": "talk-still",
      "x": 380,
      "y": 890,
      "scale": 2.3
    }
  ],
  "dialogue": {
    "speakerId": "tea_chacha",
    "speakerX": 600,
    "speakerY": 1140,
    "text": "In our village, nobody checks the weather forecast on a smartphone.",
    "start": 0.2,
    "end": 3.9,
    "fontSize": 40
  }
};
export default sceneConfig;
