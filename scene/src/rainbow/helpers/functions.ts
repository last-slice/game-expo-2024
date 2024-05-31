import { getRealm } from "~system/Runtime";
import {Animator, ColliderLayer, engine, Entity, GltfContainer, Transform} from "@dcl/sdk/ecs";
import { ReadOnlyVector3 } from "~system/EngineApi";
import { Quaternion, Vector3 } from "@dcl/sdk/math";
import resources, { alphabet } from "./resources";

export let HQParcels:any[] = ["0,0", "0,1", "1,0", "1,1"]

export function paginateArray(array:any[], page:number, itemsPerPage:number){
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex)
}

export function formatSize(size: number | undefined) {
  if (!size) return "0"

  return (size / (1024 ** 2)).toFixed(2)
}

export function sceneSizeLimit(){
  
}

export function roundVector(object:Vector3, to:number){
  let x = object.x
  let y = object.y
  let z = object.z
  return Vector3.create(parseFloat(x.toFixed(to)), parseFloat(y.toFixed(to)), parseFloat(z.toFixed(to)))
}

export function roundQuaternion(object:Quaternion, to:number){
  let eulers = Quaternion.toEulerAngles(object)
  let x = eulers.x
  let y = eulers.y
  let z = eulers.z
  return Quaternion.fromEulerDegrees(parseFloat(x.toFixed(to)), parseFloat(y.toFixed(to)), parseFloat(z.toFixed(to)))
}

export function formatDollarAmount(amount: number, decimal?:number): string {
  return amount.toLocaleString('en-US', { maximumFractionDigits: decimal ? decimal : 0 });
}

// export function convertETHNumber(amount:any){
//   return new eth.BigNumber(eth.fromWei(amount, "ether")).toFormat(2)
// }

export function getRandomIntInclusive(min:any, max:any) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


export function getRandomString(length:number) {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
}

export function getDistance(pos1:any, pos2:any){
  return Math.sqrt(
    Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z- pos2.z, 2)
  );
}

export let isPreview = false
export async function getPreview(){
    const realm = await getRealm({});
    isPreview = realm.realmInfo?.isPreview || false
}

export function log(...args:any){
  if(isPreview){
    console.log(JSON.stringify(args))
  }
}

export function isJSON(object:any){
  try {
   const jsonObject = JSON.parse(object);
   return true;
 } catch (error) {
   return false;
 }
}


export function addAnimator(entity:Entity, animations:any[], playings:boolean[], loops:boolean[]){
    let states:any[] = []
    animations.forEach((animation,i)=>{
        states.push({name:animation, clip:animation, playing:playings[i], loop:loops[i]})
    })

    Animator.createOrReplace(entity, {
        states:states
    })
}

export function playAnimation(ent:Entity, anim:string, reset?:boolean, loop?:boolean){
  Animator.playSingleAnimation(ent,anim,reset)
}

export function turn(entity:Entity, target: ReadOnlyVector3){
	const transform = Transform.getMutable(entity)
	const difference = Vector3.subtract( target, transform.position)
	const normalizedDifference = Vector3.normalize(difference)
	transform.rotation = Quaternion.lookRotation(normalizedDifference)
}

export async function getData(url:string){
  let response = await fetch(url)
  let json = await response.json()
  return json
}

export function addLineBreak(text:string, bubble?:boolean, lineCount?:number){
  return lineBreak(text,lineCount ? lineCount : 20)
}

function lineBreak(text: string, maxLineLength: number): string {
  const words = text.split(' ');
  let currentLine = '';
  const lines = [];

  for (const word of words) {
    if (currentLine.length + word.length + 1 <= maxLineLength) {
      currentLine += `${word} `;
    } else {
      lines.push(currentLine.trim());
      currentLine = `${word} `;
    }
  }
  lines.push(currentLine.trim());
  return lines.join('\n');
}

export function setUVs(rows: number, cols: number) {
  return [
    // North side of unrortated plane
    0, //lower-left corner
    0,

    cols, //lower-right corner
    0,

    cols, //upper-right corner
    rows,

    0, //upper left-corner
    rows,

    // South side of unrortated plane
    cols, // lower-right corner
    0,

    0, // lower-left corner
    0,

    0, // upper-left corner
    rows,

    cols, // upper-right corner//
    rows,
  ]
}

export function getFrontOfPlayerPosition() {
  const playerPosition = Transform.get(engine.PlayerEntity)
  const cameraPosition = Transform.get(engine.PlayerEntity)
  return Vector3.add(playerPosition!.position, Vector3.rotate(Vector3.create(0, -1, 1), cameraPosition!.rotation))
}

export function add3DText(array:any, parent:Entity, text:string, xStart:number, yStart:number, center?:boolean, colliders?:boolean){
  let digitOffset = 0.45
  let digits = text.toLowerCase().split('')

  let offset = xStart
  if(center){
      let middle = digits.length / 2
      offset -= middle * digitOffset
  }

  digits.forEach((digit:string, index:number)=>{
      if(digit === " "){
          offset += digitOffset
      }else{
          let letterIndex = alphabet.findIndex(letter => letter === digit)
          if(letterIndex >= 0){
              let ent = engine.addEntity()
              GltfContainer.create(ent, {src: resources.models.directory + "alphaNum/" + alphabet[letterIndex] + ".glb", visibleMeshesCollisionMask:ColliderLayer.CL_NONE, invisibleMeshesCollisionMask:ColliderLayer.CL_NONE})
              Transform.create(ent, {parent:parent, scale:Vector3.create(1,1,1), position: Vector3.create(offset, yStart, 0), rotation:Quaternion.fromEulerDegrees(0,180,0)})
              offset += digitOffset
              array.push(ent)
          }
      }
  })
}

export function clear3DText(array:any){
  array.forEach((entity:Entity)=>{
    engine.removeEntity(entity)
  })
  array.length = 0
}