import { createGameModels } from './gameModels';
import './polyfill'
import { init } from "./rainbow/init"
export function main(){
  init();
  createGameModels()
}