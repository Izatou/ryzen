const MOVING_AVG_LEN = 7; // 7 data average length
const TEMPERATURE_DIFF = 5;
const HUMIDITY_DIFF = 5;

const { DATA_NUM } = window.bridge.values;

/**
 * @param {{ deltaTemperature: number;deltaHumidity: number;temperature: number;humidity: number;}} onData
 */
const waitUntilSensorStable = onData => {
    // For counting Temp
    let temperatureArray = [];
    let movingAvgTemperatureLast = null;

    // For counting Humid
    let humidityArray = [];
    let movingAvgHumidityLast = null;

    return new Promise((accept, reject) => {
        let onSensorData = (event, incomingData) => {
            let floatArray = new Float32Array(incomingData.buffer).subarray(
                0,
                DATA_NUM,
            );

            let temperature = floatArray[9];
            let humidity = floatArray[10];

            let deltaTemperature = null;
            let deltaHumidity = null;

            // Count Temperature
            temperatureArray.push(temperature);
            if (temperatureArray.length > MOVING_AVG_LEN) {
                temperatureArray.shift();
                let movingAvgTemperature =
                    temperatureArray.reduce((p, c, i) => p + c, 0) /
                    MOVING_AVG_LEN;
                if (movingAvgTemperatureLast === null) {
                    movingAvgTemperatureLast = movingAvgTemperature;
                } else {
                    deltaTemperature = Math.abs(
                        movingAvgTemperatureLast - movingAvgTemperature,
                    );
                    movingAvgTemperatureLast = movingAvgTemperature;
                }
            }

            // Count Humidity
            humidityArray.push(humidity);
            if (humidityArray.length > MOVING_AVG_LEN) {
                humidityArray.shift();
                let movingAvgHumidity =
                    humidityArray.reduce((p, c, i) => p + c, 0) /
                    MOVING_AVG_LEN;
                if (movingAvgHumidityLast === null) {
                    movingAvgHumidityLast = movingAvgHumidity;
                } else {
                    deltaHumidity = Math.abs(
                        movingAvgHumidityLast - movingAvgHumidity,
                    );
                    movingAvgHumidityLast = movingAvgHumidity;
                }
            }

            onData &&
                onData({
                    deltaTemperature,
                    deltaHumidity,
                    temperature,
                    humidity,
                    movingAvgTemperatureLast,
                });

            const temperatureIsInRange =
                temperature !== null && temperature >= -10 && temperature < 60;
            const humidityIsInRange =
                humidity !== null && humidity >= 5 && humidity < 95;

            if (
                deltaTemperature !== null &&
                deltaHumidity !== null &&
                deltaTemperature < TEMPERATURE_DIFF &&
                deltaHumidity < HUMIDITY_DIFF
            ) {
                stopListening();
                accept();
            }
        };

        let stopListening = window.ipc.on("sensor-data", onSensorData);
    });
};

export default waitUntilSensorStable;
