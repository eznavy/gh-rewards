import {DataOfInterest} from "./types";

/**
 * Replace the placeholders in the banner template with the correct values using regex.
 */
export function generateBanner(dataOfInterest: DataOfInterest) {
    let banner = require("fs").readFileSync("./templates/overview.svg", "utf8");

    banner = banner.replace(/{{username}}/g, dataOfInterest.username);
    banner = banner.replace(/{{repositoryCount}}/g, dataOfInterest.repositoryCount.toString());
    banner = banner.replace(/{{totalIssueCount}}/g, dataOfInterest.totalIssueCount.toString());
    banner = banner.replace(/{{totalPullRequestCount}}/g, dataOfInterest.totalPullRequestCount.toString());
    banner = banner.replace(/{{totalCommitCount}}/g, dataOfInterest.totalCommitCount.toString());
    banner = banner.replace(/{{maxCommitCount}}/g, dataOfInterest.maxCommitCount.toString());
    banner = banner.replace(/{{maxIssueCount}}/g, dataOfInterest.maxIssueCount.toString());
    banner = banner.replace(/{{maxPullRequestCount}}/g, dataOfInterest.maxPullRequestCount.toString());

    require("fs").writeFileSync("./generated/overview.svg", banner);
}