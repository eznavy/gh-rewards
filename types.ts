export type DataOfInterest = {
    username: string;
    totalContributionCount: number;
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

export type Achievement = {
    title: string;
    description: string;
    amount: number;
    next: number;
}

export let achievements: Achievement[] = [
    //totalPullRequestCount
    {
        title: "Collaborative Spirit",
        description: "Have created {{ amount }} pull requests in total",
        amount: 0,
        next: 0
    },
    //maxPullRequestCount
    {
        title: "Merge Enthusiast",
        description: "Have created {{ amount }} pull requests in a single repository",
        amount: 0,
        next: 0
    },
    //totalIssueCount
    {
        title: "Troubleshooter",
        description: "Have created {{ amount }} issues in total",
        amount: 0,
        next: 0
    },
    //maxIssueCount
    {
        title: "Issue Opener",
        description: "Have created {{ amount }} issues in a single repository",
        amount: 0,
        next: 0
    },
    //totalCommitCount
    {
        title: "Contributor",
        description: "Have created {{ amount }} commits in total",
        amount: 0,
        next: 0
    },
    //maxCommitCount
    {
        title: "Committed Developer",
        description: "Have created {{ amount }} commits in a single repository",
        amount: 0,
        next: 0
    },
    //repositoryCount
    {
        title: "Repository Explorer",
        description: "Have contributed to {{ amount }} repositories",
        amount: 0,
        next: 0
    },
    //totalContributionCount
    {
        title: "Influencer",
        description: "Have {{ amount }} contributions in total",
        amount: 0,
        next: 0
    }
]