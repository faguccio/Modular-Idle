import { globals } from "./index.js";
import * as utils from "./utils.js";
import * as Const from "./const.js";
function validateResource(res) {
    let validWorkerAmount = res.workerAmount;
    utils.validateBaseElement(res);
    const errmsg = `Creating a Resource of ${res.name}, `;
    if (typeof res.max !== "number")
        throw new Error(errmsg + "no max amount");
    if (res.incRate == null || res.incRate < 0)
        throw new Error(errmsg + "incRate not valid, set");
    if (typeof res.workerAmount !== "number" || res.workerAmount < 0) {
        console.warn(errmsg + "workers amount not valid, set to 0");
        validWorkerAmount = 0;
    }
    if (typeof res.maxWorker !== "number")
        throw new Error(errmsg + "no saved max workers amount");
    if (res.cost == null || !Array.isArray(res.cost))
        throw Error(errmsg + "invalid cost, must be an array");
    res.cost.map((primary) => {
        if (primary.name == null)
            throw new Error(errmsg + "no name of a raw material");
        if (primary.costRate == null || primary.costRate < 0)
            throw new Error(errmsg + `invalide cost Rate for ${primary.name}: ${primary.costRate}`);
    });
}
function createResource(data, resourceList) {
    //validate data which is imported (from a json ideally)
    validateResource(data);
    const common = utils.createBaseElement(data.name, data.amount);
    const validCost = data.cost.map((primary) => {
        const ref = resourceList.filter((resource) => {
            return resource.name === primary.name;
        })[0];
        const res = {
            name: primary.name,
            costRate: primary.costRate,
            ref: ref,
        };
        return res;
    });
    return Object.assign(Object.assign({}, common), { max: data.max, incRate: data.incRate, workers: {
            amount: data.workerAmount,
            type: data.workerType,
            max: data.maxWorker,
        }, cost: validCost, previousAmount: common.amount });
}
const computeRealAuto = (val, res) => {
    return val * res.workers.amount;
};
const costDependenciesStaisfied = (res) => {
    const condition = res.cost.map((primary) => {
        const primaryAmount = primary.ref.amount;
        const amountToBeConsumed = computeRealAuto(primary.costRate, primary.ref);
        return !(primaryAmount < amountToBeConsumed);
    });
    return condition.every((cond) => cond);
};
const autoIncrease = (res) => {
    res.previousAmount = res.amount;
    if (res.amount >= res.max) {
        res.amount = res.max;
        return;
    }
    if (!costDependenciesStaisfied(res))
        return;
    res.amount += computeRealAuto(res.incRate, res);
    res.cost.map((dep) => {
        dep.ref.amount -= computeRealAuto(dep.costRate, res);
    });
};
function updateDisplay(res) {
    const amountNode = utils.getElement(`amount ${res.id}`);
    amountNode.textContent = res.amount.toFixed(2);
    const barNode = utils.getElement(`bar ${res.id}`);
    barNode.style.width = (res.amount * 100) / res.max + "%";
    const rateNode = utils.getElement(`rate ${res.id}`);
    const rate = (res.amount - res.previousAmount).toFixed(2);
    if (rateNode.textContent === rate)
        return;
    rateNode.textContent = rate;
    utils.removeClasses(rateNode, ["bg-green-400", "bg-red-400"]);
    if (Number(rate) >= 0) {
        utils.addClasses(rateNode, ["bg-green-400"]);
    }
    else {
        utils.addClasses(rateNode, ["bg-red-400"]);
    }
    workersWidgetUpdate(res);
}
function modifyWorkers(res, wAmount) {
    //wamount comes singed
    const val = wAmount;
    const gWorkers = globals.populationList.filter((pe) => pe.name === res.workers.type)[0];
    console.log(gWorkers);
    gWorkers.amount -= val;
    res.workers.amount += val;
    console.log(gWorkers);
    globals.resourceList.map((res) => {
        updateDisplay(res);
        workersWidgetUpdate(res);
    });
}
function workersWidgetUpdate(res) {
    utils.getElement(`workers-amount ${res.id}`).textContent =
        res.workers.amount.toString();
    const wbuttonContainer = utils.getElement(`workers-button-container ${res.id}`);
    Array.from(wbuttonContainer.children).map((wbutton) => {
        const val = Number(wbutton.textContent);
        const freeWorkers = globals.populationList.filter((pe) => pe.name === res.workers.type)[0];
        if (val < 0) {
            if (res.workers.amount >= -val) {
                utils.removeClasses(wbutton, ["bg-slate-400"]);
                utils.addClasses(wbutton, ["bg-slate-100"]);
                //@ts-ignore
                wbutton.disabled = false;
                return;
            }
        }
        else {
            if (freeWorkers.amount >= val) {
                utils.removeClasses(wbutton, ["bg-slate-400"]);
                utils.addClasses(wbutton, ["bg-slate-100"]);
                //@ts-ignore
                wbutton.disabled = false;
                return;
            }
        }
        utils.removeClasses(wbutton, ["bg-slate-100"]);
        utils.addClasses(wbutton, ["bg-slate-400"]);
        //@ts-ignore
        wbutton.disabled = true;
    });
}
function resourceCardCreation(templateFragment, res) {
    templateFragment.getElementById(`title`).textContent = res.name;
    templateFragment.getElementById(`amount`).id = `amount ${res.id}`;
    templateFragment.getElementById(`max-amount`).textContent = res.max;
    templateFragment.getElementById(`max-amount`).id = `max-amount ${res.id}`;
    templateFragment.getElementById(`rate`).id = `rate ${res.id}`;
    templateFragment.getElementById(`bar`).style["width"] =
        (res.amount * 100) / res.max;
    templateFragment.getElementById(`bar`).id = `bar ${res.id}`;
    templateFragment.getElementById("workers-amount").textContent =
        res.workers.amount;
    templateFragment.getElementById("workers-amount").id = `workers-amount ${res.id}`;
    const buttonContainer = templateFragment.getElementById(`workers-button-container`);
    buttonContainer.id = `workers-button-container ${res.id}`;
    return templateFragment;
}
import { resourceData } from "./data.mjs";
export function generateResources() {
    for (let i = 0; i < resourceData.length; i++) {
        globals.resourceList.push(createResource(resourceData[i], globals.resourceList));
    }
}
import { generateCardsManager } from "./CardResolver.js";
export function produceResourceCardManager() {
    return generateCardsManager({
        name: Const.RESOURCE_NAME,
        buttonValues: [-100, -10, -1, 1, 10, 100],
        elementList: globals.resourceList,
        templateCardId: "resource-card-template",
        buttonContainedId: "workers-button-container",
        createCardCallback: resourceCardCreation,
        tickRecivedCallback: autoIncrease,
        updateDisplayCallback: updateDisplay,
        buttonPayAndGetCallback: modifyWorkers,
        updateButtonDisplayCallback: workersWidgetUpdate,
    });
}
