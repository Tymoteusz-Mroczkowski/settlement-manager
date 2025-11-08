/* eslint-disable react-refresh/only-export-components */
import './App.css'
import { PoorLuxury, ModestLuxury, type Luxury } from './Luxury';
import { SmallSize, type SizeCategory } from './Sizes';
import {type ReactElement} from 'react';
import { ToggleHeading } from './Components/ToggleHeading';
import GameComponent from './Components/GameComponent';

export interface Construct {
  name: string;
  size: SizeCategory;
  material: ConstructionMaterial;
  currentLuxury: Luxury | null;
  specialEffects: ConstructEffect[];
  addEffect?: (effect: ConstructEffect) => void;
  display(): ReactElement;
}

export class BaseConstruct implements Construct {
  name: string;
  size: SizeCategory;
  material: ConstructionMaterial;
  currentLuxury: Luxury | null;
  specialEffects: ConstructEffect[];

  constructor(
    name: string,
    size: SizeCategory,
    material: ConstructionMaterial,
    currentLuxury: Luxury | null,
    specialEffects: ConstructEffect[]
  ) {
    this.name = name;
    this.size = size;
    this.material = material;
    this.currentLuxury = currentLuxury;
    this.specialEffects = specialEffects;
  }
  
  public display(): ReactElement {
    return (
      <>
        <span className="bold">Stats</span>
        <ul>
            <li>Size: {this.size.name}</li>
            <li>Material: {this.material.name}</li>
            <li>MaxLuxury: {this.material.maxLuxury.name}</li>
            <li>CurrentLuxury: {this.currentLuxury?.name || "None"}</li>
        </ul>
        <span className="bold">Effects:</span>
        {this.specialEffects.length === 0 && <p>None</p>}
        <ul>
            {this.specialEffects.map((effect, effectIndex) => (
                <li key={effectIndex}>
                    Effect: {effect.name}<br/>
                    Description: {effect.getDescription()}
                </li>
            ))}
        </ul>
      </>
);}}

export class Building extends BaseConstruct {
  rooms: Room[];
  freeSpace: number;
  constructor(
    name: string,
    size: SizeCategory,
    material: ConstructionMaterial,
    specialEffects: ConstructEffect[],
    rooms: Room[]
  ) {
    super(
      name,
      size,
      material,
      null,
      specialEffects,
    );
    this.rooms = rooms;
    this.freeSpace= size.tiles;
    for (const room of this.rooms) {
      room.parentBuilding = this;
      this.freeSpace-= room.size.tiles;
    }
  };

  public AddRoom(room: Room): boolean {
    if (this.freeSpace >= room.size.tiles) {
      this.rooms.push(room);
      room.parentBuilding = this;
      this.freeSpace -= room.size.tiles;
      return true;
    }
    return false;
  }

  display(): ReactElement {
    const content = <>{this.rooms.map(room => (<><p>{room.name}</p>{(room as BaseRoom).display()}</>))}</>;
    return (
      <>
        {super.display()}
        <ToggleHeading title='Rooms' content={content}/>
      </>
    );
  }
}

export class BaseRoom extends BaseConstruct implements Room {
  parentBuilding: Building | null = null;
  capacity: number;
  people: Resident[];
  constructor(
    name: string,
    size: SizeCategory,
    material: ConstructionMaterial,
    currentLuxury: Luxury | null,
    specialEffects: ConstructEffect[],
    capacity: number,
    people: Resident[]
  ) {
    super(
      name,
      size,
      material,
      currentLuxury,
      specialEffects,
    );
    this.capacity = capacity;
    this.people = people;
  }
}

export class Bedroom extends BaseRoom {
  constructor(
    name: string,
    size: SizeCategory,
    material: ConstructionMaterial,
    currentLuxury: Luxury,
    people: Resident[]
  ) {
    super(
      name,
      size,
      material,
      currentLuxury,
      [FullRest],
      size.tiles/4,
      people
    );
  }
}

export interface Room {
  name: string;
  size: SizeCategory;
  parentBuilding: Building | null;
  capacity: number;
  people: Resident[];
}

export interface StorableItem {
  name: string;
  amount: number;
}

export interface ConstructionMaterial {
  name: string;
  maxLuxury: Luxury;
  costPerUnit: number;
  workRequiredPerUnit: number;
}

export const Wood: ConstructionMaterial & StorableItem = {
  name: "Wood",
  maxLuxury: ModestLuxury,
  costPerUnit: 1,
  workRequiredPerUnit: 4,
  amount: 0,
}

export interface ConstructEffect {
  name: string;
  applyEffect: (construct: Construct) => string | void;
  getDescription: () => ReactElement;
}

export const FullRest: ConstructEffect = {
  name: "Full Rest",
  applyEffect(construct: Construct): string | void {
    if (construct instanceof BaseRoom) {
      (construct as BaseRoom).people.forEach(resident => {resident.upkeepCost -= 1;})
      return `${construct as BaseRoom}.capacity party member can get a Full Rest at ${construct.currentLuxury?.name} level.`;
    }
  },
  getDescription(): ReactElement {
    return (<p>Allows residents to fully rest and recover energy.</p>)
  }
}

export interface Workplace {
  workers: Resident[];
  capacity: number;
  assignWorker(Worker: Resident): void;
  removeWorker(Worker: Resident): void;
  display(): ReactElement;
}

export class BaseWorkplace implements Workplace {
  name: string = "Base Workplace";
  capacity: number=0;
  workers: Resident[] = [];
  Workplace(capacity: number) {
    this.capacity = capacity;
  }
  assignWorker(Worker: Resident): void {
    this.workers.push(Worker);
    Worker.workplace = this;
  }
  removeWorker(Worker: Resident): void {
    this.workers = this.workers.filter(worker => worker !== Worker);
    Worker.workplace = null;
  }
  display() {
    return (
    <>
      <p>Capacity: {this.workers.length}/{this.capacity}</p>
      <p>Workers Assigned:</p>
      <ul>
        {this.workers.map((worker, index) => (
          <li key={index}>{worker.name}
          <button onClick={() => {
            this.removeWorker(worker);
          }}>Remove Worker</button>
          <button onClick={() => {
            for (const resident of game.residents) {
              if (resident.workplace === null) {
                this.assignWorker(resident);
                break;
              }
          }}}>Assign Worker</button>
          </li>
        ))}
      </ul>
    </>
    );
  }
}

export class UnderConstruction implements ConstructEffect{
  name = "Under Construction";
  getDescription(): ReactElement {return <>
    <p>"This construct is still being built.{this.workDone}/{this.workNeeded} work completed. {this.workplace.workers.length} workers assigned"</p>
    <summary>Workers Assigned:</summary>
    <details>
      <ul>
        {this.workplace.display()}
      </ul>
    </details>
    </>};
  workNeeded: number;
  workDone: number;
  workplace: BaseWorkplace;
  constructor(construct: Construct, workers?: Resident[]) {
    this.workNeeded = (construct.size.tiles * construct.material.workRequiredPerUnit);
    this.workDone = 0;
    this.workplace = new BaseWorkplace();
    if (workers) {
      for (const worker of workers) {
        this.workplace.assignWorker(worker);
      }
    }
  };
  applyEffect(construct: Construct): string | void {
    this.workDone+= this.workplace.workers.length*8; // Each worker contributes 8 work units per turn (day)
    if (this.workDone >= this.workNeeded) {
      construct.specialEffects = construct.specialEffects.filter(effect => effect.name !== this.name);
      for (const worker of this.workplace.workers) {
        worker.workplace = null;
      }
      return `${construct.name} construction completed!`;
    }
    return `${construct.name} is still under construction.`;
  };
}

export interface Resident {
  name: string;
  workplace: BaseWorkplace | null;
  upkeepCost: number;
}

export class GameState {
  turn = 0;
  storage: { [key: string]: number } = {};
  constructs: Construct[] = [];
  residents: Resident[] = [];

  public Save(): boolean {
    /*
    const saveString = JSON.stringify(this);
    if(!saveString) { return false; }
    localStorage.setItem('savegame', saveString);
    return true;
    */
    return false;
    // todo
  }
  public Load(): boolean {
    const saveString = localStorage.getItem('savegame');
    if (saveString) {
      const savedState = JSON.parse(saveString);
      this.turn = savedState.turn;
      this.storage = savedState.storage;
      this.constructs = savedState.constructs;
      this.residents = savedState.residents;
      return true;
    }
    return false;
  }

  public resolveTurn(): string[] {
    this.turn += 1;
    const turnEvents: string[] = [];
    
    return turnEvents;
  }
  public startBuild(): string | null {
    return null;
  }
};

export const game = new GameState();

if (!game.Load()) {  
    game.constructs.push(new Building(
      "House 1",
      SmallSize,
      Wood,
      new Array<ConstructEffect>(),
      [new Bedroom(
        "Bedroom 1",
        SmallSize,
        Wood,
        PoorLuxury,
        []  // special effects array
      )],
  ));
  alert("Game load failed, starting new game.");
}

if(!game.Save()) {
  alert("Game save failed.");
}

function App() {
  return (
    <>
      <GameComponent game={game}/>
    </>
  );
}

export default App
