import axios from "axios";

export class NpmScraper {
    public static readonly REGISTRY_URL = "https://registry.npmjs.com";

    public async getPackage(packageName: string) {
        try {
            const res = await axios.get(`${NpmScraper.REGISTRY_URL}/${packageName}`);

            if (res.status >= 400) {
                throw new Error("Failure response.");
            }

            return res.data;
        } catch (ex) {
            console.error(`Error occurred while fetching information of "${packageName}" package.`, ex);
        }
    }
}
