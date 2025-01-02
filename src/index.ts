import { LicenseChecker } from "./license-checker";

function printHelp() {
    console.log("[npm-license-tool] Check license information of NPM packages from package-lock.json input file and write to CSV output file.\n");
    console.log("Usage:", "npm start -- [[options]...] <input file> <output file>\n");
    console.log("Options:");
    console.log("\t--help                  Print this help.");
    console.log("\t--skip-dev=<true|false> Skip checking for dev dependencies. Default is false.\n");
}

async function main(): Promise<number> {
    let ignoreDev = false;

    for (const r of process.argv) {
        const option = r.trim();

        if (option === "--help") {
            printHelp();
            return 0;
        }

        if (option === "--skip-dev=true") {
            ignoreDev = true;
        }
    }

    if (process.argv.length < 3) {
        printHelp();
        return 1;
    }

    const inputFilePath = process.argv[process.argv.length - 2];
    const outputFilePath = process.argv[process.argv.length - 1];

    const checker = new LicenseChecker({
        inputFilePath,
        outputFilePath,
        ignoreDev,
    });

    await checker.check();
    return 0;
}

main()
    .then((exitCode) => console.log("SUCCESSFUL!!! Exit code:", exitCode))
    .catch((reason) => console.error("FAILED!!! Exception:", reason))
    .finally(() => console.log("Done. Bye!"));
