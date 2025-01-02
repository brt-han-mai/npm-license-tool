import { readFile } from "fs/promises";
import { createWriteStream } from "fs";
import { stringify as createCsvStringifier } from "csv-stringify";
import { NpmScraper } from "./npm-scraper";

export interface LicenseCheckerOptions {
    inputFilePath: string;
    outputFilePath: string;
    ignoreDev: boolean;
}

export class LicenseChecker {
    private packageSet = new Set<string>();

    constructor(private options: LicenseCheckerOptions) { }

    public async check() {
        const text = await readFile(this.options.inputFilePath, { encoding: "utf-8" });
        const { dependencies, packages } = JSON.parse(text);
        const scraper = new NpmScraper();
        const csvStringifier = createCsvStringifier();
        const stream = createWriteStream(this.options.outputFilePath, { encoding: "utf-8" });
        csvStringifier.pipe(stream);
        const columnHeaders = ["Package", "License", "Repository Url", "Remark"];
        csvStringifier.write(columnHeaders);

        const listObj = dependencies || packages;
        delete listObj[""];

        const total = Object.keys(listObj).length;
        let i = 0;
        let devCount = 0;

        for (const key in listObj) {
            const packageLocalInfo = listObj[key];
            const packageName = this.extractPackageName(key);
            console.log(`[${++i}/${total}] Checking license information for package "${packageName}"...`);

            if (this.packageSet.has(packageName)) {
                console.log("[Dubplicate] Skip checked package.\n");
            } else {
                this.packageSet.add(packageName);
            }

            if (!this.options.ignoreDev || !packageLocalInfo.dev) {
                const packageRemoteInfo = await scraper.getPackage(packageName);
                console.log("Result:", packageRemoteInfo?.license || "", "\n");

                csvStringifier.write([
                    packageName,
                    packageRemoteInfo?.license,
                    packageRemoteInfo?.repository?.url || packageLocalInfo.resolved,
                    packageLocalInfo.dev ? "dev" : "",
                ]);
            } else {
                devCount++;
                console.log("Skip dev package.\n");
            }
        }

        console.log("Checked:", this.packageSet.size - devCount, "package(s)");
        console.log("Skipped:", devCount, "package(s)");
        csvStringifier.destroy();
        stream.destroy();
    }

    private extractPackageName(packageKey: string) {
        // Example: node_modules/finalhandler/node_modules/on-finished
        const lastIndex = packageKey.lastIndexOf("node_modules/");

        if (lastIndex < 0) {
            return packageKey;
        }

        return packageKey.substring(lastIndex + "node_modules/".length);
    }
}
