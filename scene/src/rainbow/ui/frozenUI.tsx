import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'
import resources from '../helpers/resources'
import { sizeFont } from './ui'
import { gameRoom } from '../components/server'
import { CustomUIText, UISpriteText } from '../../ui_components/UISpriteText'

export let show = false

export let customText = new CustomUIText(8,8, 75, 'center', "images/customCounter/alpha_sheet.png")
customText.setText("Frozen!")

export function displayFrozenUI(value: boolean) {
    show = value

    if(value){
        customText.show()
    }else{
        customText.hide()
    }
}

export function FrozenUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "frozen-ui"}
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

        <UISpriteText customText={customText} />

        </UiEntity>
       
    )
}