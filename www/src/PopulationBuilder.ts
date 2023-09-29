import {
  uuidv4,
  addClasses,
  removeClasses,
  getElement,
  validateBaseElement,
  createBaseElement,
  OTCostSatisfied,
  enableButton,
  disableButton,
} from "./utils.js";
import {
  OTCostType,
  Population,
  RawMaterial,
  BaseElement,
} from "./interfaces.js";
import { globals } from "./index.js";
import { generateCardsManager, CardManager } from "./CardResolver.js";
import * as Const from "./const.js";

function createPopulation(data): Population {
  validateBaseElement(data);
  const base: BaseElement = createBaseElement(data.name, data.amount);

  const validAutoCost: RawMaterial[] = data.raw.map((primary) => {
    const ref = globals.resourceList.filter((resource) => {
      return resource.name === primary.name;
    })[0];
    const res: RawMaterial = {
      name: primary.name,
      costRate: primary.costRate,
      ref: ref,
    };
    return res;
  });

  const validOTCost: OTCostType[] = data.otcost.map((primary) => {
    const ref = globals.resourceList.filter((resource) => {
      return resource.name === primary.name;
    })[0];
    const res: OTCostType = {
      name: primary.name,
      amount: primary.amount,
      ref: ref,
    };
    return res;
  });

  return {
    ...base,
    max: data.max,
    total: data.total,
    cost: validOTCost,
    autoCost: validAutoCost,
  };
}

function populationCardCreation(
  templateFragment: any,
  pop: Population
): HTMLElement {
  templateFragment.getElementById(`title`).textContent = pop.name;
  templateFragment.getElementById(`amount`).id = `amount ${pop.id}`;
  templateFragment.getElementById(`total`).id = `total ${pop.id}`;
  templateFragment.getElementById(`max`).textContent = pop.max;
  templateFragment.getElementById(`max`).id = `max ${pop.id}`;
  // templateFragment.getElementById(`rate`).id = `rate ${pop.id}`;
  templateFragment.getElementById(`working-bar`).style["width"] =
    (((pop.total - pop.amount) * 100) / pop.max).toString() + "%";

  templateFragment.getElementById(`working-bar`).id = `working-bar ${pop.id}`;
  templateFragment.getElementById(`idle-bar`).style.width =
    ((pop.amount * 100) / pop.max).toString() + "%";

  templateFragment.getElementById(`idle-bar`).id = `idle-bar ${pop.id}`;

  const buttonContainer = (templateFragment.getElementById(
    `button-container`
  ).id = `button-container ${pop.id}`);

  const consumeNode = templateFragment.getElementById("consume-container");

  pop.autoCost.map((cost) => {
    const newConsume = document.createElement("div");
    addClasses(newConsume, ["bg-blue-200", "my-2", "mx-2"]);
    document.createElement("p");
    document.createElement("p");
    newConsume.textContent = cost.name;
    consumeNode.appendChild(newConsume);
  });

  return templateFragment;
}

function updateDisplay(pop: Population) {
  getElement(`amount ${pop.id}`).textContent = pop.amount.toString();
  getElement(`total ${pop.id}`).textContent = pop.total.toString();
  getElement(`working-bar ${pop.id}`).style["width"] =
    (((pop.total - pop.amount) * 100) / pop.max).toString() + "%";
  getElement(`idle-bar ${pop.id}`).style.width =
    ((pop.amount * 100) / pop.max).toString() + "%";
  updateButtonWidget(pop);
}

function produceWorkers(pop: Population, amount: number) {
  payOTCost(pop, amount);
  pop.amount += amount;
  pop.total += amount;
  updateDisplay(pop);
}

function checkOTConditions(pop: Population, val: number): boolean {
  const condition = pop.cost.map((otcost) => {
    return OTCostSatisfied(otcost, val);
  });
  return condition.every((cond) => cond);
}

function payOTCost(pop: Population, buySize: number): void {
  pop.cost.map((otcost) => {
    otcost.ref.amount -= buySize * otcost.amount;
  });
}

function checkKeepAliveConditions(pop: Population): boolean {
  const condition = pop.autoCost.map((autoCost) => {
    return autoCost.ref.amount > pop.amount * autoCost.costRate;
  });
  return condition.every((cond) => cond);
}

function payKeepAlive(pop: Population): void {
  pop.autoCost.map((autoCost) => {
    autoCost.ref.amount -= pop.amount * autoCost.costRate;
  });
}

function updateButtonWidget(pop: Population) {
  const buttonsContainer = getElement(`button-container ${pop.id}`);
  Array.from(buttonsContainer.children).map((button) => {
    const val = Number(button.textContent);
    if (checkOTConditions(pop, val) && pop.total + val <= pop.max) {
      enableButton(button);
      return;
    }
    disableButton(button);
    return;
  });
}

function keepWorkersAlive(pop: Population) {
  if (checkKeepAliveConditions(pop)) {
    payKeepAlive(pop);
  } else {
    //make people die
    console.log("People dying");
  }
}

import { populationData } from "./data.mjs";

export function generatePopulations() {
  for (let i = 0; i < populationData.length; i++) {
    globals.populationList.push(createPopulation(populationData[i]));
  }
}

export function producePopulationCardManager(): CardManager {
  return generateCardsManager({
    name: Const.POPULATION_NAME,
    buttonValues: [1, 10, 100],
    elementList: globals.populationList,
    templateCardId: "population-card-template",
    buttonContainedId: "button-container",
    createCardCallback: populationCardCreation,
    tickRecivedCallback: keepWorkersAlive,
    updateDisplayCallback: updateDisplay,
    buttonPayAndGetCallback: produceWorkers,
    updateButtonDisplayCallback: updateButtonWidget,
  });
}
