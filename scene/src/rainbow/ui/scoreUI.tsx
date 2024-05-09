import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'
import resources from '../helpers/resources'

export let show = false
export let scoreUI = new CustomCounter( 4, 4, 25, 'center', "images/customCounter/number_sheet.png")

export function displayScoreUI(value: boolean) {
    show = value

    if(value){
        scoreUI.show()
      
    }else{
        scoreUI.hide()
    }
}

export function ScoreUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "scoring-ui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 'auto',
                height: 'auto',
                positionType: 'absolute',
                position:{right:'5%', top:'20%'}
            }}
        >

        <UICounter customCounter={scoreUI} />

        </UiEntity>
       
    )
}