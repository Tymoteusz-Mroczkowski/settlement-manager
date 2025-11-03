import { game } from "../App";

export default function BuildView() {
    return (
        <>
            <button onClick={game.startBuild}>Add Building</button>
            <h1>Modify Buildings</h1>
            {game.constructs.map((construct, index) => {
                return (
                <li key={index}>
                    {construct.display()}
                </li>);
            })}
        </>
    )
}