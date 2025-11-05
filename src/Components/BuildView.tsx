import { type GameState } from "../App";
import { ToggleHeading } from "./ToggleHeading";

export default function BuildView(props: {game: GameState}) {
    return (
        <>
            <button onClick={props.game.startBuild}>Add Building</button>
            <h1>Modify Buildings</h1>
            {props.game.constructs.map((construct, index) => {
                return (
                    <div key={index}>
                        <ToggleHeading title={construct.name} content={construct.display()}/>
                    </div>
                )
            })}
        </>
    )
}