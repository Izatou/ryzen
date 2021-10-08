const os = require("os");
const path = require("path");
const fs = require("fs");

const CONFIG_DIR = path.resolve(os.homedir(), ".enose-api");
const CONFIG_PATH = path.resolve(CONFIG_DIR, "config.json");

/**
 * @typedef {"" |
 *  "process1" |
 *  "process2" |
 *  "process3" |
 *  "positiveResult" |
 *  "negativeResult" |
 *  "kirimWaTextShow" |
 *  "nfcKTPTextShow" |
 *  "screeningMode" |
 *  "anovaSelangDetection"
 * } ConfigKeys
 */

const READONLY_CONFIG = ['version'];

const DEFAULT_CONFIG = {
    version: "1.0",
    process1: 10,
    process2: 10,
    process3: 10,
    positiveResult: 'Positif',
    negativeResult: 'Negatif',
    kirimWaTextShow: true,
    nfcKTPTextShow: true,
    screeningMode: 0, // 0: default screening, 1: pengumpulan data 
    anovaSelangDetection: false,
    thresholdPositive: 0.5,
    ignoreInvalid: false,
};

let CURRENT_CONFIG = null;

const flushConfig = () => {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR);
    }

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(CURRENT_CONFIG));
};

/**
 * @param {ConfigKeys} key 
 */
const readConfig = (key) => CURRENT_CONFIG[key];

/**
 * @param {ConfigKeys} key 
 */
const writeConfig = (key, value) => {
    if (READONLY_CONFIG.indexOf(key) !== -1) {
        throw new ReferenceError(`Cannot write config. "${key}" is a read-only variables`);
    }

    CURRENT_CONFIG[key] = value;
    flushConfig();
}

const prepareConfig = async () => {
    if (!CURRENT_CONFIG) {
        try {
            let rawText = fs.readFileSync(CONFIG_PATH).toString();
            let json = JSON.parse(rawText);
            CURRENT_CONFIG = { ...DEFAULT_CONFIG, ...json };
        } catch (error) {
            CURRENT_CONFIG = { ...DEFAULT_CONFIG };
        }
    }
}

prepareConfig();

module.exports = {
    readConfig,
    writeConfig
}