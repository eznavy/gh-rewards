import {Octokit} from "@octokit/rest";
import { Repository } from "./types";
import {dataOfInterest} from "./github_rewards";

const {graphql} = require("@octokit/graphql");

let queryPresets = {
    commitCount: `
        repository(owner: "OWNER_NAME", name: "REPO_NAME") {
            defaultBranchRef {
                target {
                    ... on Commit {
                        history(author: { id: "NODE_ID" }) {
                            totalCount
                        }
                    }
                }
            }
        }
    `,
    issueCount: `
        search(query: "repo:OWNER_NAME/REPO_NAME type:issue author:USER_NAME", type: ISSUE) {
            issueCount
        }
    `,
    pullRequestCount: `
        search(query: "type:pr author:USER_NAME repo:OWNER_NAME/REPO_NAME is:merged", type: ISSUE, first: 1) {
            issueCount
        }
    `
};

let user: string, node_id: string, token: string, repos: Repository[] = [];

/**
 * Initialize the variables user, token and node_id.
 */
export async function init() {
    user = process.env.GITHUB_ACTOR;
    token = process.env.ACCESS_TOKEN;

    const octokit = new Octokit({
        auth: token
    });
    await octokit.request(`GET /users/${user}`).then((response: any) => {
        node_id = response.data.node_id;
    });
}

/**
 * Get the repositories the user has contributed to.
 */
export async function repositoriesContributedTo() {
    let after = null;
    let hasNextPage = false;

    do {
        let query = `
            query {
                user(login: "${user}") {
                    repositoriesContributedTo(first: 100, includeUserRepositories: true, after: ${after}, contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW, REPOSITORY]) {
                        nodes {
                            name
                            owner {
                                login
                            }
                       }
                       pageInfo {
                            endCursor
                            hasNextPage
                       } 
                    }
                }
            }
        `;
        await graphql(query, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((result: any) => {
            result.user.repositoriesContributedTo.nodes.forEach((repo: any) => {
                if(repo !== null) repos.push({owner: repo.owner.login, name: repo.name}); //private repos are listed as null in the response
            });
            dataOfInterest.repositoryCount = repos.length;
            if(result.user.repositoriesContributedTo.pageInfo.hasNextPage) {
                hasNextPage = true;
                after = JSON.stringify(result.user.repositoriesContributedTo.pageInfo.endCursor);
            }
            else hasNextPage = false;
        });
    }
    while(hasNextPage);
    console.log('Found the following repositories:', repos)
}

/**
 * Get the total counts of commits, issues and pull requests of the user.
 */
export async function getCounts() {
    let countTypes = ["commit", "issue", "pullRequest"];
    let countPreset: string;
    for (const countType of countTypes) {
        let batchquery = `query {`;

        switch(countType) {
            case "commit":
                countPreset = queryPresets.commitCount;
                break;
            case "issue":
                countPreset = queryPresets.issueCount;
                break;
            case "pullRequest":
                countPreset = queryPresets.pullRequestCount;
                break;
            default:
                throw new Error("Invalid count type");
        }

        repos.forEach((repo: Repository) => {
            repo.label =`${repo.owner}${repo.name}`.replace(/[^a-zA-Z0-9_]/g, "");
            batchquery += `\n${repo.label}: ` + countPreset.replace("OWNER_NAME", repo.owner).replace("REPO_NAME", repo.name).replace("NODE_ID", node_id).replace("USER_NAME", user) + '\n';
        })
        batchquery += `}`;

        //send batch request
        await graphql(batchquery, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((result: any) => {
            let max = 0;
            switch(countType) {
                case "commit":
                    repos.forEach((repo: Repository) => {
                        let count = result[repo.label!].defaultBranchRef.target.history.totalCount;
                        if(count > max) max = count;
                        dataOfInterest.totalCommitCount += count;
                    });
                    dataOfInterest.maxCommitCount = max;
                    break;
                case "issue":
                    repos.forEach((repo: Repository) => {
                        let count = result[repo.label!].issueCount;
                        if(count > max) max = count;
                        dataOfInterest.totalIssueCount += count;
                    });
                    dataOfInterest.maxIssueCount = max;
                    break;
                case "pullRequest":
                    repos.forEach((repo: Repository) => {
                        let count = result[repo.label!].issueCount;
                        if(count > max) max = count;
                        dataOfInterest.totalPullRequestCount += count;
                    });
                    dataOfInterest.maxPullRequestCount = max;
                    break;
                default:
                    throw new Error("Invalid count type");
            }
        });
    }
    dataOfInterest.totalContributionCount = dataOfInterest.totalCommitCount + dataOfInterest.totalIssueCount + dataOfInterest.totalPullRequestCount;
    console.log('Found the following counts:', dataOfInterest)
}