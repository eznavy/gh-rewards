import * as apiRequests from "./apirequests";
import * as generateBanner from "./generate_banner";
import {DataOfInterest} from "./types";

if(!process.env.GITHUB_ACTIONS) require('dotenv').config();

let dataOfInterest: DataOfInterest = {
    username: "",
    repositoryCount: 0,
    totalIssueCount: 0,
    totalPullRequestCount: 0,
    totalCommitCount: 0,
    maxCommitCount: 0,
    maxIssueCount: 0,
    maxPullRequestCount: 0
};

main();

async function main() {
    if(process.env.ACCESS_TOKEN && process.env.GITHUB_ACTOR) {
        dataOfInterest.username = process.env.GITHUB_ACTOR;
        console.log("Starting to fetch data...")
        await apiRequests.init(dataOfInterest);
        await apiRequests.repositoriesContributedTo();
        await apiRequests.getCounts();
        generateBanner.generateBanner(dataOfInterest);
    } else {
        throw new Error("ACCESS_TOKEN and GITHUB_ACTOR must be set");
    }
}