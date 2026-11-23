// Visual specification for scene_02
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
      "gamchha": true,
      "expr": "surprised",
      "anim": "talk",
      "x": 240,
      "y": 890,
      "scale": 2.3
    },
    {
      "id": "elder_listener",
      "age": "elder",
      "outfit": "fatua",
      "shirt": "#E5DAC0",
      "pants": "#46604D",
      "hat": "topi",
      "beard": true,
      "expr": "neutral",
      "anim": "idle",
      "x": 580,
      "y": 890,
      "scale": 2.25
    }
  ],
  "dialogue": {
    "speakerId": "tea_chacha",
    "speakerX": 460,
    "speakerY": 1140,
    "text": "Look at that crow flying sideways! In five minutes, a massive storm is coming!",
    "start": 0.15,
    "end": 4.9,
    "fontSize": 38
  }
};
export default sceneConfig;
