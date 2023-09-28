import { uuidv4, addClasses, removeClasses } from "../utils.js";
//import { globals } from "../index.js";
/*


  

  modifyWorkers(wAmount) {
    //wamount comes singed
    const val = Number(wAmount);
    const gWorkers = globals.workers;
    gWorkers.simpleWorkers -= val;
    this.workersAmount += val;
    console.log(gWorkers);

    globals.resourceList.map((res) => {
      res.updateDisplay();
      res.workersWidgetUpdate();
    });
  }

  workersWidgetUpdate() {
    document.getElementById(`workers-amount ${this.id}`).textContent =
      this.workersAmount;

    const wbuttonContainer = document.getElementById(
      `workers-button-container ${this.id}`
    );

    Array.from(wbuttonContainer.children).map((wbutton) => {
      const val = Number(wbutton.textContent);
      const freeWorkers = globals.workers.simpleWorkers;

      if (val < 0) {
        if (this.workersAmount >= -val) {
          removeClasses(wbutton, ["bg-slate-400"]);
          addClasses(wbutton, ["bg-slate-100"]);
          wbutton.disabled = false;
          return;
        }
      } else {
        if (freeWorkers >= val) {
          removeClasses(wbutton, ["bg-slate-400"]);
          addClasses(wbutton, ["bg-slate-100"]);
          wbutton.disabled = false;
          return;
        }
      }

      removeClasses(wbutton, ["bg-slate-100"]);
      addClasses(wbutton, ["bg-slate-400"]);
      wbutton.disabled = true;
    });
  }
}*/
// type workerType = "simple" | "special"
function createBaseElement(name, amount) {
    const id = uuidv4();
    return { id: id, name: name, amount: amount };
}
function validateBaseElement(el) {
    const errmsg = `Creating a base element of "${el.name}", `;
    if (typeof el.name !== "string")
        throw new Error(errmsg + "Invalid name");
    if (typeof el.savedAmount !== "number" || el.savedAmount < 0) {
        console.warn(errmsg + "amount not valid, set to 0");
        el.savedAmount = 0;
    }
}
function validateResource(res) {
    let validWorkerAmount = res.savedWorkerAmount;
    validateBaseElement(res);
    const errmsg = `Creating a Resource of ${res.name}, `;
    if (typeof res.savedMaxAmount !== "number")
        throw new Error(errmsg + "no max amount");
    if (res.incRate == null || res.incRate < 0)
        throw new Error(errmsg + "incRate not valid, set");
    if (typeof res.savedWorkerAmount !== "number" || res.savedWorkerAmount < 0) {
        console.warn(errmsg + "workers amount not valid, set to 0");
        validWorkerAmount = 0;
    }
    if (typeof res.savedMaxWorkerAmount !== "number")
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
export function createResource(data, resourceList) {
    //validate data which is imported (from a json ideally)
    validateResource(data);
    const common = createBaseElement(data.name, data.savedAmount);
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
    return Object.assign(Object.assign({}, common), { max: data.savedMaxAmount, incRate: data.incRate, workerAmount: data.savedWorkerAmount, maxWorker: data.savedMaxWorkerAmount, cost: data.cost, previousAmount: 0 });
}
const computeRealAuto = (val, res) => {
    return val * res.workerAmount;
};
const costDependenciesStaisfied = (res) => {
    const condition = res.cost.map((primary) => {
        const primaryAmount = primary.ref.amount;
        const amountToBeConsumed = computeRealAuto(primary.costRate, primary.ref);
        return !(primaryAmount < amountToBeConsumed);
    });
    return condition.every((cond) => cond);
};
export const autoIncrease = (res) => {
    res.previousAmount = res.amount;
    if (res.amount >= res.max) {
        res.amount = res.max;
        return;
    }
    if (!costDependenciesStaisfied(res))
        return;
    res.amount += computeRealAuto(res.incRate, res);
    if (!!res.cost) {
        res.cost.map((dep) => {
            dep.ref.amount -= computeRealAuto(dep.costRate, res);
        });
    }
};
export function updateDisplay(res) {
    const amountNode = document.getElementById(`amount ${res.id}`);
    if (amountNode)
        amountNode.textContent = this.amount.toFixed(2);
    const barNode = document.getElementById(`bar ${res.id}`);
    if (barNode)
        barNode.style.width = (this.amount * 100) / this.maxAmount + "%";
    const rateNode = document.getElementById(`rate ${this.id}`);
    const rate = (this.amount - this.previousAmount).toFixed(2);
    if (rateNode != null)
        rateNode.textContent = rate;
    removeClasses(rateNode, ["bg-green-400", "bg-red-400"]);
    if (Number(rate) >= 0) {
        addClasses(rateNode, ["bg-green-400"]);
    }
    else {
        addClasses(rateNode, ["bg-red-400"]);
    }
}
