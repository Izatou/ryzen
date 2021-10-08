const { spawn } = require('child_process');
const { verbose, warn } = require('electron-log');

// TODO: Temporary
const randomStr = (length, characters) => {
    let result = '';
    characters = characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const startKTPPolling = (onKTPDetected) => {
    let child = spawn("nfc-inose");

    let buffer = "";
    child.stdout.on("data", chunk => {
        buffer += chunk.toString();
        verbose("KTP detected")
        verbose(buffer)

        let rebuffer = "";
        let line = buffer.split(/(?<=DONE)/g).filter(v => !!v);
        verbose(line)
        
        for (let i = 0; i < line.length; i++) {
            let info = line[i];
            if (!info.startsWith("error")) {
                if (info.endsWith("DONE")) {
                    let infos = info.split(/\r?\n/);
                    if (infos[0].startsWith("ISO/IEC 14443A")) {
                        let hexString = infos[2].trim().split(":")[1].split(" ").join("");
                        onKTPDetected({
                            // TODO: Implementasi ekstrak nomor KTP
                            serial: hexString,
                            ktp: ''
                        });
                    } else if (infos[0].startsWith("ISO/IEC 14443B")) {
                        // TODO: Temporary
                        let str = randomStr(7);
                        onKTPDetected({
                            // TODO: Implementasi ekstrak nomor KTP
                            serial: str,
                            ktp: ''
                        });
                    }
                } else {
                    rebuffer += info;
                }
            }
        }

        buffer = rebuffer;
    });

    return child;
}

exports.startKTPPolling = (onKTPDetected) => {   
    return new Promise((accept, reject) => {
        let child = startKTPPolling(onKTPDetected);

        child.stderr.on("data", err => {
            const reason = err.toString();
            reject(`KTP Scanner error: ${reason}`);
            warn("KTP Scanner Error.", reason);
            throw err;
        });

        child.on("exit", () => {
            // On killed wait 1s, then restart
            setTimeout(() => {
                child = startKTPPolling(onKTPDetected);
            }, 1000);
        });

        // Wait 1s before confirming python is running
        setTimeout(() => {
            if (child && !child.killed) {
                accept();
            }
        }, 2000);
    })   
}