export type DataOfInterest = {
    repositoryCount: number;
    totalIssueCount: number;
    totalPullRequestCount: number;
    totalCommitCount: number;
    maxCommitCount: number;
    maxIssueCount: number;
    maxPullRequestCount: number;
}

export type Repository = {
    owner: string;
    name: string;
    label?: string;
}