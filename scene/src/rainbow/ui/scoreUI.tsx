import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { CustomCounter, UICounter } from '../../ui_components/UICounter'
import resources from '../helpers/resources'
import { CustomUIText, UISpriteText } from '../../ui_components/UISpriteText'

export let show = true

export let pigScore = new CustomCounter( 4, 4, 55, 'center', "images/customCounter/number_sheet.png")
export let pigText = new CustomUIText(8,8, 45, 'center', "images/customCounter/alpha_sheet.png")
pigText.setText("PIGS FLOWN")

export let targetScore = new CustomCounter( 4, 4, 55, 'center', "images/customCounter/number_sheet.png")
export let targetText = new CustomUIText(8,8, 45, 'center', "images/customCounter/alpha_sheet.png")
targetText.setText("TARGETS HIT")

export function displayScoreUI(value: boolean) {
    show = value

    if(value){
        pigScore.show()
        pigText.show()
        targetScore.show()
        targetText.show()
    }else{
        pigScore.hide()
        pigText.hide()
        targetScore.hide()
        targetText.hide()
    }
}

export function updatePlayerUIScore(score:any){
    pigScore.setNumber(score.pigs)
    targetScore.setNumber(score.targets)
    displayScoreUI(true)
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
                width: '35%',
                height: '100%',
                positionType: 'absolute',
            }}
        >

            {/* pigs flown row */}
        <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >
        <UISpriteText customText={pigText} />
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
        >
            <UICounter customCounter={pigScore} />
        </UiEntity>

              
            </UiEntity>

      
            {/* targets hit row */}
            <UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '10%',
            }}
        >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '50%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.Green()}}
        >
        <UISpriteText customText={targetText} />
        </UiEntity>

        <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20%',
                height: '100%',
            }}
        >
            <UICounter customCounter={targetScore} />
        </UiEntity>

              
            </UiEntity>

        </UiEntity>
       
    )
}