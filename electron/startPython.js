const spawn = require("child_process").spawn;
const path = require("path");
const {
    modelLocation,
    predictPythonFile,
    pythonSensorType,
} = require("../res/values");
const { verbose, warn } = require("electron-log");
const pythonDir = path.resolve(__dirname, "..", "python");

/**
 * Start a python program
 * @typedef {{
 * name: string;
 * callback: (child: import("child_process").ChildProcessWithoutNullStreams) => void;
 * }} PythonProgram
 * @param {PythonProgram[]} programs
 */
exports.startPython = programs => {
    const listOfPromise = [];

    programs.forEach(program => {
        listOfPromise.push(
            new Promise((accept, reject) => {
                let child = spawn("python3", [
                    path.resolve(pythonDir, program.name + ".py"),
                ]);
                verbose(
                    "Starting Python",
                    path.resolve(pythonDir, program.name + ".py"),
                );
                program.callback(child);

                child.stderr.on("data", err => {
                    const reason = err.toString();
                    reject(`Python [${program}] error: ${reason}`);
                    warn("Python Error.", program, reason);
                    throw err;
                });

                child.on("exit", code => {
                    reject(`Python [${program}] exited: ${code}`);
                    verbose("Python Exited", program);
                    program = null;
                    child.removeAllListeners();
                    child = null;
                });

                // Wait 1s before confirming python is running
                setTimeout(() => {
                    if (child && !child.killed) {
                        if (child.exitCode === 0 || child.exitCode === null) {
                            accept();
                        } else {
                            verbose("Start Python Exit Code", child.exitCode);
                            reject("Cannot start python");
                        }
                    }
                }, 1000);
            }),
        );
    });

    return Promise.all(listOfPromise);
};

/**
 * Start a python predict model
 * @param {(child: import("child_process").ChildProcessWithoutNullStreams) => void} callback
 */
exports.startPredictModelPython = callback =>
    new Promise(async (accept, reject) => {
        verbose("Mulai menjalankan model python");
        while (true) {
            let child = spawn(
                "python3",
                [path.resolve(modelLocation, predictPythonFile)],
                {
                    cwd: modelLocation,
                },
            );

            child.stderr.on("data", err => {
                const reason = err.toString();
                warn("Python Model STDERR =>", reason);
            });

            const failedStart = await new Promise(accept => {
                child.on("exit", () => {
                    verbose("Python model exited");
                    child.removeAllListeners();
                    child = null;
                    accept(true);
                });
                setTimeout(() => accept(false), 1000);
            });

            if (failedStart) {
                verbose("Python Predict Exit Code", child && child.exitCode);

                await new Promise(accept => setTimeout(accept, 30000));
                verbose("Retrying start python model");
            } else {
                callback(child);
                accept();
                break;
            }
        }
    });

let sensor_type_cache = null;
exports.checkSensorType = () =>
    new Promise(resolve => {
        if (sensor_type_cache !== null) {
            resolve(sensor_type_cache);
        } else {
            let child = spawn("python3", [
                path.resolve(pythonDir, pythonSensorType + ".py"),
            ]);

            verbose(
                "Starting Python",
                path.resolve(pythonDir, pythonSensorType + ".py"),
            );

            child.stdout.on("data", chunk => {
                resolve((sensor_type_cache = Number(chunk.toString())));
            });
        }
    });
