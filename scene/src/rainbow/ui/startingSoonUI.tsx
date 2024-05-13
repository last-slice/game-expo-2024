import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../helpers/resources'
import { dimensions, sizeFont } from './ui'
import { gameRoom } from '../components/server'
import { Color4 } from '@dcl/sdk/math'

export let show = false

export function displayStartingSoonUI(value: boolean) {
    show = value
}

export function StartingSoonUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "starting-soon-ui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * 0.5,
                height: dimensions.height * .2,
                positionType: 'absolute',
                position:{top:'10%', right:'25%'},
            }}
            // uiBackground={{color:Color4.Green()}}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{bottom:'2%'}
        }}
        // uiBackground={{color:Color4.Red()}}
        uiText={{value:"GAME STARTING SOON", fontSize:sizeFont(65,35), textAlign:'middle-center', color:Color4.White()}}
        />

        </UiEntity>
       
    )
}