import type { GameState } from "../App";
import { ToggleHeading } from "./ToggleHeading";
import { useState } from "react";

export default function GameComponent(props: {game: GameState}) {
  const [turnCounter, setTurnCounter] = useState(props.game.turn);
  return (
    <>
      <h1>DND Settlement Manager</h1>
      <p>Turn: {turnCounter}</p>
      <button onClick={() => {
        const events = props.game.resolveTurn();
        alert(`Turn ${turnCounter} resolved.\nEvents:\n${events.join("\n")}`);
        setTurnCounter(props.game.turn);
        if(!props.game.Save()) {
          alert("Game save failed.");
        }
      }}>Resolve Turn</button>
      <h2>Buildings</h2>
      {props.game.constructs.map((construct, index) => {
        return (
          <div key={index}>
              <ToggleHeading title={construct.name} content={construct.display()}/>
          </div>
        )
      })}
    </>
  );
}