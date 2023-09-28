import { addClasses, removeClasses, getElement, validateBaseElement, createBaseElement, OTCostSatisfied, } from "./utils.js";
import { globals } from "./index.js";
import { generateCardsManager } from "./CardResolver.js";
import * as Const from "./const.js";
function createPopulation(data) {
    validateBaseElement(data);
    const base = createBaseElement(data.name, data.amount);
    const validAutoCost = data.raw.map((primary) => {
        const ref = globals.resourceList.filter((resource) => {
            return resource.name === primary.name;
        })[0];
        const res = {
            name: primary.name,
            costRate: primary.costRate,
            ref: ref,
        };
        return res;
    });
    const validOTCost = data.otcost.map((primary) => {
        const ref = globals.resourceList.filter((resource) => {
            return resource.name === primary.name;
        })[0];
        const res = {
            name: primary.name,
            amount: primary.amount,
            ref: ref,
        };
        return res;
    });
    return Object.assign(Object.assign({}, base), { max: data.max, total: data.total, cost: validOTCost, autoCost: validAutoCost });
}
function populationCardCreation(templateFragment, pop) {
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
    const buttonContainer = (templateFragment.getElementById(`button-container`).id = `button-container ${pop.id}`);
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
function updateDisplay(pop) {
    getElement(`amount ${pop.id}`).textContent = pop.amount.toString();
    getElement(`total ${pop.id}`).textContent = pop.total.toString();
    updateButtonWidget(pop);
}
function produceWorkers(pop, amount) {
    console.log(amount);
}
function updateButtonWidget(pop) {
    const buttonsContainer = getElement(`button-container ${pop.id}`);
    Array.from(buttonsContainer.children).map((button) => {
        const val = Number(button.textContent);
        const condition = pop.cost.map((otcost) => {
            return OTCostSatisfied(otcost, val);
        });
        if (condition.every((cond) => cond)) {
            if (button.classList.contains("bg-slate-100"))
                return;
            removeClasses(button, ["bg-slate-400"]);
            addClasses(button, ["bg-slate-100"]);
            //@ts-ignore
            button.disabled = false;
            return;
        }
        if (button.classList.contains("bg-slate-400"))
            return;
        removeClasses(button, ["bg-slate-100"]);
        addClasses(button, ["bg-slate-400"]);
        //@ts-ignore
        button.disabled = true;
    });
}
import { populationData } from "./data.mjs";
export function generatePopulations() {
    for (let i = 0; i < populationData.length; i++) {
        globals.populationList.push(createPopulation(populationData[i]));
    }
}
export function producePopulationCardManager() {
    return generateCardsManager({
        name: Const.POPULATION_NAME,
        buttonValues: [1, 10, 100],
        elementList: globals.populationList,
        templateCardId: "population-card-template",
        buttonContainedId: "button-container",
        createCardCallback: populationCardCreation,
        tickRecivedCallback: (pop) => {
            //kill starving man
        },
        updateDisplayCallback: updateDisplay,
        buttonPayAndGetCallback: produceWorkers,
        updateButtonDisplayCallback: updateButtonWidget,
    });
}
