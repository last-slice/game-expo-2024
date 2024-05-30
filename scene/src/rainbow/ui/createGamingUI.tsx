import ReactEcs, { Button, Label, ReactEcsRenderer, UiEntity, Position, UiBackgroundProps } from '@dcl/sdk/react-ecs'
import { GamingTimer, displayGamingTimer } from './gamingTimer'
import { GamingCountdown, displayGamingCountdown } from './gamingCountdown'
import { ScoreUI, displayScoreUI } from './scoreUI'
import { GamingBorderUI, displayGamingBorderUI } from './gamingborderUI'
import resources from '../helpers/resources'
import { WinnerUI } from './winnerUI'
import { LeaderboardUI } from './leaderboardUI'
import { ReservationUI } from './reservationUI'
import { StartingSoonUI, displayStartingSoonUI } from './startingSoonUI'
import { FrozenUI } from './frozenUI'
import { PlayButtonUI } from './buttonsUI'


export let showGaming = true

export function displayGamingUI(value: boolean) {
    showGaming = value
}

export function resetAllGamingUI(){
    displayScoreUI(false)
    displayGamingBorderUI(false)
    displayGamingTimer(false, 0)
    displayGamingCountdown(false, 0)
    displayStartingSoonUI(false, "")
}

export function createGamingUI() {
    return (
        <UiEntity
            key={"" + resources.slug + "gaming-ui"}
            uiTransform={{
                display: showGaming ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType: 'absolute',
            }}
        >
            <PlayButtonUI/>
            <FrozenUI/>
            <StartingSoonUI/>
            <ReservationUI/>
            <LeaderboardUI/>
            <WinnerUI/>
            <GamingBorderUI/>
            <GamingCountdown/>
            <GamingTimer/>
            <ScoreUI/>
        </UiEntity>
       
    )
}