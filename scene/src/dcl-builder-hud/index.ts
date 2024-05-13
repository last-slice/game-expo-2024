import { Entity, Transform } from "@dcl/sdk/ecs"
import { Quaternion } from "@dcl/sdk/math"

export interface SelectedItem {
  modifier: EDIT_MODIFIERS
  factor: number
  entity:Entity
  enabled:boolean
}

export enum EDIT_MODES {
  GRAB,
  EDIT
}

export enum EDIT_MODIFIERS {
  POSITION,
  ROTATION,
  SCALE
}

export let selectedItem:SelectedItem
export let builderHUDEntities:any[] = [null]
export let builderHUDLabels:any[] =["Select Entity"]

export function getEntityList(){
  return builderHUDLabels
}

export function addBuilderHUDAsset(entity:Entity, label:string){
  if(Transform.has(entity) && !builderHUDEntities.find((e) => e === entity)){
    builderHUDEntities.push(entity)
    builderHUDLabels.push(label)
    console.log('added object to builder hud', builderHUDEntities, builderHUDLabels)
  }
}

export function selectAsset(index:number){
  if(index > 0){
    selectedItem = {
      modifier:EDIT_MODIFIERS.POSITION,
      factor:1,
      entity: builderHUDEntities[index],
      enabled:true
  }
  }else{
    selectedItem.enabled = false
  }
}

export function createBuilderHud(admins?:string[]){
}

export function transformObject(axis:string, direction:number){
  if(selectedItem.enabled){
    let transform = Transform.getMutable(selectedItem.entity)

    switch(selectedItem.modifier){
        case EDIT_MODIFIERS.POSITION:
            let pos:any = transform.position
            pos[axis] = pos[axis] + (direction * selectedItem.factor)
            break;
  
        case EDIT_MODIFIERS.ROTATION:
            let rot:any = Quaternion.toEulerAngles(transform.rotation)
            rot[axis] = rot[axis] + (direction * selectedItem.factor)
            transform.rotation = Quaternion.fromEulerDegrees(rot.x ,rot.y, rot.z)
            break;
  
        case EDIT_MODIFIERS.SCALE:
            let scale:any = transform.scale
            scale[axis] =  scale[axis] + (direction * selectedItem.factor)
            break;
    }
  }
}

export function toggleModifier(){
  switch(selectedItem.modifier){
      case EDIT_MODIFIERS.POSITION:
          case EDIT_MODIFIERS.SCALE:
              if(selectedItem.factor === 1){
                  selectedItem.factor = 0.1
              }else if(selectedItem.factor === 0.1){
                  selectedItem.factor = 0.01
              }else if(selectedItem.factor === 0.01){
                  selectedItem.factor = 0.001
              }
              else if(selectedItem.factor === 0.001){
                  selectedItem.factor = 1
              }
          break;


      case EDIT_MODIFIERS.ROTATION:
          if(selectedItem.factor === 90){
              selectedItem.factor = 45
          }else if(selectedItem.factor === 45){
              selectedItem.factor = 15
          }else if(selectedItem.factor === 15){
              selectedItem.factor = 5
          }else if(selectedItem.factor === 5){
              selectedItem.factor = 1
          }
          else if(selectedItem.factor === 1){
              selectedItem.factor = 90
          }
          break;
  }
}

export function toggleEditModifier(modifier?:EDIT_MODIFIERS){
  if(modifier){
      selectedItem.modifier = modifier
  }else{
      if(selectedItem.modifier === EDIT_MODIFIERS.POSITION){
          selectedItem.modifier = EDIT_MODIFIERS.ROTATION
          selectedItem.factor = 90
      }
      else if(selectedItem.modifier === EDIT_MODIFIERS.ROTATION){
          selectedItem.modifier = EDIT_MODIFIERS.SCALE
          selectedItem.factor = 1
      }
      else if(selectedItem.modifier === EDIT_MODIFIERS.SCALE){
          selectedItem.modifier = EDIT_MODIFIERS.POSITION
          selectedItem.factor = 1
      }
  }
}
