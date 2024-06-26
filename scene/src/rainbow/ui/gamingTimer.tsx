import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'

export let showGamingTimer = false
export let gameCountdownTimerDisplay = new CustomCounter( 4, 4, 60, 'center', "images/customCounter/number_sheet.png")

export function displayGamingTimer(value: boolean, reset?:any) {
    if(reset){
        gameCountdownTimerDisplay.setNumber(reset)    
    }

    showGamingTimer = value
    
    if(value){
        gameCountdownTimerDisplay.show()
      
    }else{
        gameCountdownTimerDisplay.hide()
    }
}

export function GamingTimer() {
    return (
        <UiEntity
            key={"iwbgamingtimer"}
            uiTransform={{
                display: showGamingTimer ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{left:'50%', top:'10%'}
            }}
            // uiBackground={{color:Color4.Green()}}
        >

        <UICounter customCounter={gameCountdownTimerDisplay} />

        </UiEntity>
       
    )
}