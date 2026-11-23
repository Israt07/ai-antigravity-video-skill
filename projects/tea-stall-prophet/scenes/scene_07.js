// Visual specification for scene_07
export const sceneConfig = {
  "background": "tea-stall",
  "characters": [
    {
      "id": "elder_listener",
      "age": "elder",
      "outfit": "fatua",
      "shirt": "#E5DAC0",
      "pants": "#46604D",
      "hat": "topi",
      "beard": true,
      "expr": "surprised",
      "anim": "idle",
      "x": 320,
      "y": 890,
      "scale": 2.25
    },
    {
      "id": "tea_chacha",
      "age": "elder",
      "outfit": "lungi",
      "shirt": "#D86B4F",
      "pants": "#3B5875",
      "mustache": true,
      "gamchha": true,
      "expr": "happy",
      "anim": "walk",
      "x": 750,
      "y": 890,
      "scale": 2.2
    }
  ],
  "dialogue": {
    "speakerId": "elder_listener",
    "speakerX": 540,
    "speakerY": 1140,
    "text": "And just like that, the storm never came... and neither did Chacha's money.",
    "start": 0.2,
    "end": 4.8,
    "fontSize": 38
  }
};
export default sceneConfig;
