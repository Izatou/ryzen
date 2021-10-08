import setupSamplingSaveDirectory from "./setupSamplingSaveDirectory";

const { screeningAPIURL } = window.bridge.values;
let uploadingInProgress = false;
let lastError = "Unknown error";

const doUpload = async (backupDir, uploadedDir, files) => {
    let data = [];
    let moveFiles = [];

    for (let i = 0; i < files.length; i++) {
        const filename = files[i];
        switch (filename) {
            case ".":
            case "..":
                break;
            default:
                // debugger
                if (filename.endsWith(".inoseimage")) {
                    try {
                        let buffer = await window.fs.readFile(
                            backupDir + "/" + filename,
                        );
                        let blob = new Blob([new Uint8Array(buffer.buffer)]);
                        data.push(blob);
                        moveFiles.push(filename);
                    } catch (error) {
                        window.log.warn("FAILED TO PREPARE SYNC", filename, error);
                    }
                }
        }
    }

    console.log("HAHA", data);
    try {
        const body = new FormData();
        body.append(
            "serial_number",
            await window.bridge.getDeviceSerialNumber(),
        );
        body.append("num", data.length);
        for (let i = 0; i < data.length; i++) {
            const blob = data[i];
            body.append(
                "file" + i,
                new File([blob], "inose_" + i + ".inoseimage"),
            );
        }
        let resp = await fetch(screeningAPIURL + "/syncDataBinary", {
            method: "POST",
            body,
        });
        
        if (data.length < 1) {
            lastError = "Tidak ada data yang disinkron";
            return false;
        }

        if (resp.ok && resp.headers.get("content-type") == "application/json") {
            let { status, message } = await resp.json();
            window.log.verbose("Response sync data", message);
            if (status === 200) {
                for (let i = 0; i < moveFiles.length; i++) {
                    const file = moveFiles[i];
                    await window.fs.rename(
                        backupDir + "/" + file,
                        uploadedDir + "/" + file,
                    );
                }
                return true;
            } else if (status == 500) {
                window.log.error("Error response sync data", message);
                lastError = "Data mismatch";
                return false;
            }
        } else {
            lastError = "Server response unexpected";
            return false;
        }
    } catch (error) {
        lastError = error.message;
    }
    return false;
};

const syncData = async () => {
    if (uploadingInProgress) {
        return;
    }
    uploadingInProgress = true;
    lastError = "Unknown error";
    const [backupDir, uploadedDir] = await setupSamplingSaveDirectory();
    let result = true;

    let files = await window.fs.readdir(backupDir);
    let i,
        j,
        chunkedFiles,
        chunk = 10; //Chunk every 10 data
    for (i = 0, j = files.length; i < j; i += chunk) {
        chunkedFiles = files.slice(i, i + chunk);
        result =
            result && (await doUpload(backupDir, uploadedDir, chunkedFiles));

        if (!result) {
            window.dialog.showMessage(
                "Sinkronisasi Gagal",
                `Data tidak dapat terkirim. Mohon untuk mencoba kembali.\n\nTerkirim: ${i}/${files.length-1} data\nError: ${lastError}`,
            );
            uploadingInProgress = false;
            return result;
        }
    }

    window.dialog.showMessage(
        "Sinkronisasi Berhasil",
        "Terimakasih telah mengirimkan data kepada i-nose c19.\nData Anda berarti untuk meningkatkan akurasi dari i-nose c19.",
    );

    uploadingInProgress = false;
    return result;
};

export default syncData;
