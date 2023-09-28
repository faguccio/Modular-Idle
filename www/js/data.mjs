export const resourceData = [
    {
        name: "wood",
        amount: 5,
        max: 10,
        incRate: 0.1,
        workerAmount: 1,
        maxWorker: 10,
        workerType: "Simple Worker",
        cost: [],
    },
    {
        name: "stones",
        amount: 2,
        max: 5,
        workerAmount: 1,
        maxWorker: 10,
        workerType: "Simple Worker",
        incRate: 0.1,
        cost: [],
    },
    {
        name: "tools",
        amount: 0,
        max: 10,
        workerAmount: 1,
        maxWorker: 10,
        workerType: "Simple Worker",
        incRate: 0.05,
        cost: [
            {
                name: "wood",
                costRate: 0.3,
            },
            {
                name: "stones",
                costRate: 0.3,
            },
        ],
    },
    {
        name: "bread",
        amount: 50,
        max: 100,
        workerAmount: 1,
        maxWorker: 10,
        workerType: "Simple Worker",
        incRate: 0.2,
        cost: [],
    },
];
export const populationData = [
    {
        name: "Simple Worker",
        amount: 10,
        max: 20,
        total: 15,
        raw: [
            {
                name: "bread",
                costRate: 0.1,
            },
        ],
        otcost: [
            {
                name: "bread",
                amount: 1,
            },
        ],
    },
    {
        name: "Simple Builder",
        amount: 10,
        max: 20,
        total: 15,
        raw: [
            {
                name: "bread",
                costRate: 0.1,
            },
        ],
        otcost: [
            {
                name: "bread",
                amount: 1,
            },
        ],
    },
];
export const storageData = [
    {
        name: "Wood Barn",
        amount: 2,
        capacity: 50,
        OTcost: [
            {
                name: "wood",
                amount: 5,
                workerRequirement: { workerType: "Simple Builder", amount: 2 },
            },
        ],
        target: "wood",
    },
    {
        name: "Wood  stones",
        amount: 2,
        capacity: 50,
        OTcost: [
            {
                name: "wood",
                amount: 5,
                workerRequirement: { workerType: "Simple Builder", amount: 2 },
            },
        ],
        target: "stones",
    },
];
export const facilityData = [
    {
        name: "Falegnameria",
        amount: 2,
        capacity: 50,
        OTcost: [
            {
                name: "wood",
                amount: 5,
                workerRequirement: { workerType: "Simple Builder", amount: 2 },
            },
        ],
        target: "wood",
    },
    {
        name: "Stone cave",
        amount: 2,
        capacity: 50,
        OTcost: [
            {
                name: "wood",
                amount: 5,
                workerRequirement: { workerType: "Simple Builder", amount: 2 },
            },
        ],
        target: "stones",
    },
];
