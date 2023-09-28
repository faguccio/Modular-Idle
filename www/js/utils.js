import * as Const from "./const.js";
import { globals } from "./index.js";
export function uuidv4() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr)
        .map((n) => {
        return n.toString(16);
    })
        .join("");
}
export function addClasses(node, classList) {
    classList.map((classSingleton) => {
        node.classList.add(classSingleton);
    });
}
export function removeClasses(node, classList) {
    classList.map((classSingleton) => {
        node.classList.remove(classSingleton);
    });
}
export function getElement(id) {
    const element = document.getElementById(id);
    if (element == null)
        throw new Error(`getting element by ID: ${id} failed,`);
    return element;
}
export function createBaseElement(name, amount) {
    const id = uuidv4();
    return { id: id, name: name, amount: amount };
}
export function validateBaseElement(el) {
    const errmsg = `Creating a base element of "${el.name}", `;
    if (typeof el.name !== "string")
        throw new Error(errmsg + "Invalid name");
    if (typeof el.amount !== "number" || el.amount < 0) {
        console.warn(errmsg + "amount not valid, set to 0");
        el.amount = 0;
    }
}
export function generatePlaceHolder() {
    const container = getElement(Const.screenId);
    const screen = globals.currentScreen;
    const div = document.createElement("div");
    div.textContent = screen;
    container.appendChild(div);
}
export function rawMaterialStaisfied(primary, computeCostCallback) {
    const primaryAmount = primary.ref.amount;
    const amountToBeConsumed = computeCostCallback(primary.costRate, primary.ref);
    return !(primaryAmount < amountToBeConsumed);
}
export function OTCostSatisfied(primary, multiplier) {
    const primaryAmount = primary.ref.amount;
    if (primary.workerRequirement != undefined) {
        const type = primary.workerRequirement.type;
        if (primary.workerRequirement.amount >
            globals.populationList.filter((pop) => pop.name === type)[0].amount)
            return false;
    }
    const amountToBeConsumed = primary.amount * multiplier;
    return amountToBeConsumed <= primaryAmount;
}
