import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../helpers/resources'
import { dimensions, sizeFont } from './ui'
import { gameRoom } from '../components/server'
import { Color4 } from '@dcl/sdk/math'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'
import { activationPods, expandPodLock, resetPodLock } from '../components/environment'

export let show = false

export let counter = new CustomCounter( 4, 4, 75, 'center', "images/customCounter/number_sheet.png")

export function displayReservationUI(index:number, value: boolean) {
    show = value

    if(!value){
        counter.hide()
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
        uiText={{value:"Reserving Spot", fontSize:sizeFont(65,35), textAlign:'middle-center', color:Color4.White()}}
        />

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
        }}
        >
            <UICounter customCounter={counter} />
        </UiEntity>
    )
}