export const resourceData = [
    {
        name: "stick",
        savedAmount: 5,
        savedMaxAmount: 10,
        incRate: 0.1,
        savedWorkerAmount: 1,
        savedMaxWorkerAmount: 10,
        cost: [],
    },
    {
        name: "stones",
        savedAmount: 2,
        savedMaxAmount: 5,
        savedWorkerAmount: 1,
        savedMaxWorkerAmount: 10,
        incRate: 0.1,
        cost: [],
    },
    {
        name: "tools",
        savedAmount: 0,
        savedMaxAmount: 10,
        savedWorkerAmount: 1,
        savedMaxWorkerAmount: 10,
        incRate: 0.05,
        cost: [
            {
                name: "stick",
                costRate: 0.3,
            },
            {
                name: "stones",
                costRate: 0.3,
            },
        ],
    },
];
export const populationData = [
    { name: "simpleWorker", savedAmount: 10 },
    { name: "totalWorker", savedAmount: 13 },
];
