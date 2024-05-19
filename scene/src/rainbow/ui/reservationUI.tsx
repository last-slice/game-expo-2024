import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../helpers/resources'
import { dimensions, sizeFont } from './ui'
import { gameRoom } from '../components/server'
import { Color4 } from '@dcl/sdk/math'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'
import { CustomUIText, UISpriteText } from '../../ui_components/UISpriteText'

export let show = false

export let counter = new CustomCounter(4, 4, 75, 'center', "images/customCounter/number_sheet.png")
export let customText = new CustomUIText(8,8, 75, 'center', "images/customCounter/alpha_sheet.png")
customText.setText("Reserving Spot")

export function displayReservationUI(index:number, value: boolean) {
    show = value

    if(!value){
        customText.hide()
        counter.hide()
    }else{
        customText.show()
    }
}

export function updateReservationCounter(index:number, value:number){
    counter.setNumber(value)

    // if(value > 0){
    //     expandPodLock(index, value)
    // }//
}


export function ReservationUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "reservation-ui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * 0.5,
                height: dimensions.height * .2,
                positionType: 'absolute',
                position:{top:'20%', right:'25%'},
            }}
            // uiBackground={{color:Color4.Green()}}
        >

        <UISpriteText customText={customText} />

        {gameRoom && getDisplay()}


        </UiEntity>
       
    )
}

function getDisplay(){
    counter.show()
    return(
        <UiEntity
        key={resources.slug + "-reservation-display"}
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30%',
            height: '30%',
            margin:{top:"5%"}
        }}
        >
            <UICounter customCounter={counter} />
        </UiEntity>
    )
}