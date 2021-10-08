const { DATA_NUM } = window.bridge.values;

const checkSensorRange = sensors => {
    const inRange = new Array(DATA_NUM);
    inRange[0] = sensors[0] >= 150 && sensors[0] < 300;
    inRange[1] = sensors[1] >= 300 && sensors[1] < 450;
    inRange[2] = sensors[2] >= 400 && sensors[2] < 550;
    inRange[3] = sensors[3] >= 500 && sensors[3] < 800;
    inRange[4] = sensors[4] >= 600 && sensors[4] < 900;
    inRange[5] = sensors[5] >= 500 && sensors[5] < 800;
    inRange[6] = sensors[6] >= 300 && sensors[6] < 450;
    inRange[7] = sensors[7] >= 300 && sensors[7] < 450;
    inRange[8] = true;
    inRange[9] = sensors[9] >= -10 && sensors[9] < 55;
    inRange[10] = sensors[10] >= 5 && sensors[10] < 95;

    const allSensorValid = inRange.every(v => !!v);
    window.log.debug("SENSOR_VALID", inRange);
    return allSensorValid;
};

export default checkSensorRange;
