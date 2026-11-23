// Index export for village2d backgrounds
import { renderBackground as house } from './house.js';
import { renderBackground as teaStall } from './tea-stall.js';
import { renderBackground as mosqueField } from './mosque-field.js';
import { renderBackground as indoorBench } from './indoor-bench.js';
import { renderBackground as feastTent } from './feast-tent.js';

export const BACKGROUNDS = {
  house,
  'house-pump': house,
  'tea-stall': teaStall,
  teastall: teaStall,
  'mosque-field': mosqueField,
  mosque: mosqueField,
  'indoor-bench': indoorBench,
  indoor: indoorBench,
  'feast-tent': feastTent,
  feast: feastTent,
};

export function getBackground(name = 'house') {
  const norm = String(name).toLowerCase().trim().replace(/_/g, '-');
  const renderer = BACKGROUNDS[norm] || BACKGROUNDS.house;
  return renderer;
}
