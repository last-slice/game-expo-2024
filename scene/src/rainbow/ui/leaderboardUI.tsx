import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../helpers/resources'
import { sizeFont } from './ui'
import { gameRoom } from '../components/server'
import { Color4 } from '@dcl/sdk/math'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'

export let show = false

export let positionCounters:any[] = [
    new CustomCounter( 4, 4, 75, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 70, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 65, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 60, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 55, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 50, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 45, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 40, 'center', "images/customCounter/number_sheet.png"),
]

export let scoreCounters:any[] = [
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, 20, 'center', "images/customCounter/number_sheet.png"),
]

export let visibleItems:any[] = []

export function displayLeaderboardUI(value: boolean) {
    show = value

    updateLeaderboard()

    if(!value){
        positionCounters.forEach((counter)=>{
            counter.hide()
        })

        scoreCounters.forEach((counter)=>{
            counter.hide()
        })
    }
}

export function updateLeaderboard(){
    visibleItems.length = 0
    visibleItems = [...gameRoom.state.pods].sort((a,b) => b.score - a.score)
}

export function LeaderboardUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "leaderboard-ui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '15%',
                height: '40%',
                positionType: 'absolute',
                position:{bottom:'1%', right:'1%'},
            }}
            // uiBackground={{color:Color4.Teal()}}
        >

            {gameRoom && gameRoom.state.started && generateRows()}


        </UiEntity>
       
    )
}

function generateRows(){
    let arr:any[] = []
    let count = 0

    visibleItems.forEach((pod:any, i:number)=>{
        if(pod.locked){
            arr.push(<LeaderboardRow item={pod} count={count} pCounter={positionCounters[count]} sCounter={scoreCounters[count]}/>)
            count++
        }
    })
    return arr
}

function LeaderboardRow(data:any){
    data.pCounter.show()
    data.pCounter.setNumber(data.count + 1)

    data.sCounter.show()
    data.sCounter.setNumber(Math.floor(data.item.score / 180 * 100))

    return(
        <UiEntity
        key={resources.slug + "-leaderboard-row-" + data.count}
        uiTransform={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '15%',
            margin:{top:"1%", bottom:'1%'}
        }}
        // uiBackground={{color:Color4.Teal()}}
        >

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Yellow()}}
        >
            <UICounter customCounter={data.pCounter} />
        </UiEntity>

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '70%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Red()}}
        uiText={{value:"Name: " + data.item.name, fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
        />

        <UiEntity
        uiTransform={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '15%',
            height: '100%',
        }}
        // uiBackground={{color:Color4.Blue()}}//
        >
            <UICounter customCounter={data.sCounter} />
        </UiEntity>



        </UiEntity>
    )
}