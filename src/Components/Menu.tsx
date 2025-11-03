import { game } from "../App";
export default function Menu() {
    return (
        <>
            <menu>
                <button onClick={game.resolveTurn}>Resolve Turn</button>
            </menu>
        </>
    )
}