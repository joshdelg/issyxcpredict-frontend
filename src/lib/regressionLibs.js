import regression from "regression";

export function buildModel(predictionData) {
    const model = regression.linear(predictionData);
    return model;
}