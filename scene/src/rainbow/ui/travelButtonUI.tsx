import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { UICounter } from '../../ui_components/UICounter'
import resources from '../helpers/resources'
import { UISpriteText } from '../../ui_components/UISpriteText'
import { Color4 } from '@dcl/sdk/math'
import { calculateImageDimensions, getImageAtlasMapping } from './ui'
import { movePlayerTo } from '~system/RestrictedActions'

export let show = true
let playButtonMode = 'game'
let infoPanelVisible = false

export function updateUITravelButton(value:string){
    playButtonMode = value
}

export function PlayButtonUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "play-button-ui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
            }}
        >

            {/* info button */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(10, 1024/362).width,
                height: calculateImageDimensions(10, 1024/362).height,
                positionType: 'absolute',
                position:{left: '0%', top:'25%'}
            }}
            uiBackground={{
                textureMode:'stretch',
                texture: {
                  src: 'images/instructions.png'
                },
                uvs: getImageAtlasMapping({
                    atlasWidth:1024,
                    atlasHeight:1024,
                    sourceHeight:362,
                    sourceWidth:1024,
                    sourceTop:0,
                    sourceLeft:0
                })
            }}
            onMouseDown={()=>{
                infoPanelVisible = !infoPanelVisible
            }}
        />

        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(13, 1024/662).width,
                height: calculateImageDimensions(13, 1024/662).height,
                positionType: 'absolute',
                position:{left: '0.5%', top:'33%'},
                display: infoPanelVisible ? "flex" : "none"
            }}
            uiBackground={{
                textureMode:'stretch',
                texture: {
                  src: 'images/instructions.png'
                },
                uvs: getImageAtlasMapping({
                    atlasWidth:1024,
                    atlasHeight:1024,
                    sourceHeight:662,
                    sourceWidth:1024,
                    sourceTop:362,
                    sourceLeft:0
                })
            }}
            onMouseDown={()=>{
            }}
        />


            {/* play button */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: calculateImageDimensions(10, 256/128).width,
                height: calculateImageDimensions(10, 256/128).height,
                positionType: 'absolute',
                position:{right: '6%', top:'1%'}
            }}
            uiBackground={{
                textureMode:'stretch',
                texture: {
                  src: 'images/teleportButtons.png'
                },
                uvs: getImageAtlasMapping(playButtonMode === "game" ? 
                {
                    atlasWidth:256,
                    atlasHeight:256,
                    sourceHeight:128,
                    sourceWidth:256,
                    sourceTop:0,
                    sourceLeft:0
                }

                :

                {
                    atlasWidth:256,
                    atlasHeight:256,
                    sourceHeight:128,
                    sourceWidth:256,
                    sourceTop:128,
                    sourceLeft:0
                }
            
            )
            }}
            onMouseDown={()=>{
                playButtonMode = playButtonMode === "game" ? "ground" : "game"

                if(playButtonMode === "game"){
                    movePlayerTo({newRelativePosition:{x:41.5, y:2, z:34}, cameraTarget:{x:31.5, y:5, z:41.79}})
                }
                else{
                    movePlayerTo({newRelativePosition:{x:33.84, y:29, z:51.7}, cameraTarget:{x:33.84, y:29, z:16.5}})
                }
            }}
        />


        </UiEntity>
       
    )
}