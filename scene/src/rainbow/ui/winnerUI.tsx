import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'
import resources from '../helpers/resources'
import { sizeFont } from './ui'
import { gameRoom } from '../components/server'

export let show = false
export let scoreUI = new CustomCounter( 4, 4, 25, 'center', "images/customCounter/number_sheet.png")

export function displayWinnerUI(value: boolean) {
    show = value

    // if(value){
    //     scoreUI.show()
      
    // }else{
    //     scoreUI.hide()
    // }
}

export function WinnerUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "winner-ui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{top:'20%'}
            }}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '30%',
        }}
        uiText={{value:'' + (gameRoom && gameRoom.state.winner === "tie" ? "GAME TIED" : 'WINNER IS\n' + (gameRoom && gameRoom.state.winner)), fontSize:sizeFont(80,50), textAlign:'middle-center'}}
        />

        {/* <UICounter customCounter={scoreUI} /> */}

        </UiEntity>
       
    )
}