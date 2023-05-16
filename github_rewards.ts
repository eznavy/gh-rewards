import * as apiRequests from "./apirequests";

main();

async function main() {
    if(process.env.ACCESS_TOKEN && process.env.GITHUB_ACTOR) {
        await apiRequests.init();
        await apiRequests.repositoriesContributedTo();
        await apiRequests.getCounts();
    } else {
        throw new Error("ACCESS_TOKEN and GITHUB_ACTOR must be set");
    }
}