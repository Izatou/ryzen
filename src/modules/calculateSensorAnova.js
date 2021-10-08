import { oneWay } from "ml-anova";
const { anovaNASensorIndex } = window.bridge.values;

const ALPHA = 0.05;

/**
 * @param {Float32Array} sensor1
 * @param {Float32Array} sensor2
 * @param {number} dataNumber
 * @return {boolean}
 */
const calculateSensorAnova = (sensor1, sensor2, dataNumber) => {
    let nSensor1 = sensor1.length / dataNumber;
    let nSensor2 = sensor2.length / dataNumber;

    if (nSensor1 !== nSensor2) {
        throw new RangeError(
            "Data number in sensor 1 not match with data number in sensor 2",
        );
    }

    let anovaResultAccepted = Array(nSensor1).fill(true);
    let anovaResultAcceptedVal = Array(nSensor1).fill(0);
    for (let i = 0; i < dataNumber; i++) {
        if (anovaNASensorIndex.indexOf(i) !== -1) {
            anovaResultAccepted[i] = true;
            anovaResultAcceptedVal[i] = 0;
        } else {
            // Generating data and class
            let data = [];
            let classes = [];
            for (let j = 0; j < nSensor1; j++) {
                data.push(sensor1[j * dataNumber + i]);
                classes.push(0);
            }
            for (let j = 0; j < nSensor2; j++) {
                data.push(sensor2[j * dataNumber + i]);
                classes.push(1);
            }

            window.log.verbose("ANOVA DATA", i, data, classes);
            let pValue = oneWay(data, classes, { alpha: ALPHA }).pValue;
            if (isNaN(pValue)) pValue = 1;
            anovaResultAccepted[i] = pValue < ALPHA;
            anovaResultAcceptedVal[i] = pValue;
        }
    }

    window.log.verbose("ANOVA", anovaResultAccepted, anovaResultAcceptedVal);
    return anovaResultAccepted.filter(v => !v).length < 3;
};

export default calculateSensorAnova;
