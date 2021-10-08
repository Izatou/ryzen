const { warn } = require("electron-log");
const fs = require("fs");
const NodeRSA = require("node-rsa");
const publicKey = require("../../res/rsa");
// const {DATA_NUM} = require('../../res/values');
const DATA_NUM = 11;

/**
 *
 * @param {string} nik
 * @param {string} device_id
 * @param {number} covid_status
 * @param {number} sampling_id
 * @param {Float32Array} data1
 * @param {Float32Array} data2
 * @param {Float32Array} data3
 * @param {string} outputFile
 */
function write(
    nik,
    device_id,
    covid_status,
    sampling_id,
    created_at,
    accuracy,
    sensor_type,
    data1,
    data2,
    data3,
    outputFile,
) {
    const header = Buffer.alloc(0x70 + 1);
    header.write("INOSE2", 0, "utf-8");
    header.write(nik.slice(0, 16), 0x10, "utf-8");
    header.write(device_id.slice(0, 64), 0x21, "utf-8");
    header.writeUInt8(covid_status, 0x61);
    header.writeUInt16LE(sampling_id, 0x62);
    header.writeBigUInt64LE(BigInt(created_at), 0x64);
    header.writeFloatLE(accuracy, 0x6C);
    header.writeUInt8(sensor_type, 0x70);

    const data1buffer = Buffer.from(
        Uint16Array.from([
            data1.length / DATA_NUM,
            ...data1.filter((value, index) => {
                return index % DATA_NUM < 8;
            }),
        ]).buffer,
    );

    const data2buffer = Buffer.from(
        Uint16Array.from([
            data2.length / DATA_NUM,
            ...data2.filter((value, index) => {
                return index % DATA_NUM < 8;
            }),
        ]).buffer,
    );

    const data3buffer = Buffer.from(
        Uint16Array.from([
            data3.length / DATA_NUM,
            ...data3.filter((value, index) => {
                return index % DATA_NUM < 8;
            }),
        ]).buffer,
    );

    const temperatureHumidityLengthBuffer = Buffer.from(
        Uint16Array.from([
            (data1.length + data2.length + data3.length) / DATA_NUM,
        ]).buffer,
    );

    const tempHumidBuffer = Buffer.from(
        Float32Array.from([
            ...data1.filter((value, index) => {
                return index % DATA_NUM > 8;
            }),
            ...data2.filter((value, index) => {
                return index % DATA_NUM > 8;
            }),
            ...data3.filter((value, index) => {
                return index % DATA_NUM > 8;
            }),
        ]).buffer,
    );

    const data = Buffer.concat([
        header,
        data1buffer,
        data2buffer,
        data3buffer,
        temperatureHumidityLengthBuffer,
        tempHumidBuffer,
    ]);

    const key = new NodeRSA(publicKey);

    const chunkSize = key.getMaxMessageSize();
    const chunkNumber = Math.ceil(data.length / chunkSize);
    const encrypteds = [];
    for (let chunk = 0; chunk < chunkNumber; chunk++) {
        try {
            const chunkBuffer = data.slice(
                chunk * chunkSize,
                (chunk + 1) * chunkSize,
            );
            const encryptedChunkBuffer = key.encrypt(chunkBuffer);
            encrypteds.push(encryptedChunkBuffer);
        } catch (error) {
            warn("ERROR OCCURED WHILE ENCRYPTING", sampling_id, error);
        }
    }

    const encryptionHeader = Buffer.alloc(2 * 2);
    encryptionHeader.writeUInt16LE(encrypteds.length);
    encryptionHeader.writeUInt16LE(encrypteds[0].byteLength, 2);
    const fd = fs.openSync(outputFile, "w");
    fs.writeSync(fd, encryptionHeader);
    fs.writeSync(fd, Buffer.concat(encrypteds));
    fs.closeSync(fd);
}

module.exports = {
    write,
};
