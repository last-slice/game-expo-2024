import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import resources from '../helpers/resources'
import { getImageAtlasMapping, sizeFont } from './ui'
import { gameRoom } from '../components/server'
import { Color4 } from '@dcl/sdk/math'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'
import { localPlayer } from '../components/player'
import { playGameSound } from '../components/sounds'

export let show = true

let counterSize:number = 20

export let positionCounters:any[] = [
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
]

export let scoreCounters:any[] = [
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
    new CustomCounter( 4, 4, counterSize, 'center', "images/customCounter/number_sheet.png"),
]

export let visibleItems:any[] = []

export function displayLeaderboardUI(value: boolean, test?:boolean) {
    show = value

    updateLeaderboard(test)

    if(!value){
        positionCounters.forEach((counter)=>{
            counter.hide()
        })

        scoreCounters.forEach((counter)=>{
            counter.hide()
        })
    }
}

export function updateLeaderboard(test?:boolean){
    if(test){
        visibleItems.length = 0
        visibleItems = [
            {name:"Test Name 1", score: 90, locked:true},
            {name:"Test Name 2", score: 80, locked:true},
            {name:"Test Name 3", score: 70, locked:true},
            {name:"Test Name 4", score: 60, locked:true},
            {name:"Test Name 5", score: 50, locked:true},
            {name:"Test Name 6", score: 40, locked:true},
            {name:"Test Name 7", score: 30, locked:true},
            {name:"Test Name 8", score: 20, locked:true},
        ]
    }
    else{
        let lastLeader = visibleItems.length > 0 ? visibleItems[0].id : ""
        visibleItems.length = 0
        visibleItems = [...gameRoom.state.pods].sort((a,b) => b.score - a.score)
    
        let currentLeader = visibleItems[0].id
        if(lastLeader !== currentLeader && currentLeader === localPlayer.userId){
            playGameSound("leader")
        }
    }
}

const leaderboardPic = "images/leaderboard.jpeg"
const newLeaderboardPic = "images/leaderboard.png"

export function LeaderboardUI() {
    return (
        <UiEntity
        key={"" + resources.slug + "leaderboard-ui"}
            uiTransform={{
                display: show ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '40%',
                positionType: 'absolute',
                position:{bottom:'1%', right:'1%'},
            }}
            uiBackground={{
                textureMode:'stretch',
                texture: {
                  src: newLeaderboardPic
                },
            }}
        >

            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '90%',
                    height: '60%',
                }}
            >

            {generateRows()}
            </UiEntity>


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
        uiText={{value:"" + data.item.name, fontSize:sizeFont(30,20), textAlign:'middle-center', color:Color4.White()}}
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