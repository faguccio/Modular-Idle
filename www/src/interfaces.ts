import * as Const from "./const.js";
import { CardManager } from "./CardResolver.js";
export interface SavedElement {
  name: string;
  amount: number;
}

export interface SavedCost {
  name: string;
  costRate: number;
}

export interface SavedResource extends SavedElement {
  max: number;
  incRate: number;
  workerAmount: number;
  workerType: string;
  maxWorker: number;
  cost: SavedCost[];
}

export interface BaseElement {
  id: string;
  name: string;
  amount: number;
}

export interface RawMaterial {
  name: string;
  costRate: number;
  ref: Resource;
}

export interface Resource extends BaseElement {
  max: number;
  incRate: number;
  workers: WorkForce;
  cost: RawMaterial[];
  previousAmount: number;
}

export interface gameData {
  currentScreen: string;
  resourceList: Resource[];
  populationList: Population[];
}

interface WorkForce {
  amount: number;
  type: string;
  max?: number;
}

export interface Population extends BaseElement {
  cost: OTCostType[];
  autoCost: RawMaterial[];
  max: number;
  total: number;
}

export interface OTCostType {
  name: string;
  amount: number;
  ref: Resource;
  workerRequirement?: WorkForce;
}

export interface StorageElement extends BaseElement {
  OTCost: OTCostType[];
  capacity: number;
  target: Resource | Population;
}

export interface ProductionFacility extends BaseElement {
  OTCost: OTCostType[];
  capacity: number;
  targetResource: string;
}

export type GeneralElement = Resource | Population;
