export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const money = (n) => '$' + n.toFixed(2);
