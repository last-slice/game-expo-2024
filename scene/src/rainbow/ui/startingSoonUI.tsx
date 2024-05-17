import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../helpers/resources'
import { dimensions, sizeFont } from './ui'
import { gameRoom } from '../components/server'
import { Color4 } from '@dcl/sdk/math'
import { CustomUIText, UISpriteText } from '../../ui_components/UISpriteText'

export let show = false

export let customText = new CustomUIText(8,8, 75, 'center', "images/customCounter/alpha_sheet.png")
customText.setText("WAITING ON OTHER PLAYERS")

export function displayStartingSoonUI(value: boolean, text:string) {
    show = value
    customText.setText(text)

    if(value){
        customText.show()
    }else{
        customText.hide()
    }
    
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
                position:{top:'5%', right:'25%'},
            }}
            // uiBackground={{color:Color4.Green()}}
        >

            <UISpriteText customText={customText} />

        </UiEntity>
       
    )
}