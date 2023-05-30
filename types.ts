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
    badge: string;
    amount: number;
    next: number;
}

export let achievements: Achievement[] = [
    //totalPullRequestCount
    {
        title: "Collaborative Spirit",
        description: "Have created {{ amount }} pull requests in total",
        badge: "badge_2",
        amount: 0,
        next: 0
    },
    //maxPullRequestCount
    {
        title: "Merge Enthusiast",
        description: "Have created {{ amount }} pull requests in a single repository",
        badge: "badge_2",
        amount: 0,
        next: 0
    },
    //totalIssueCount
    {
        title: "Troubleshooter",
        description: "Have created {{ amount }} issues in total",
        badge: "badge_1",
        amount: 0,
        next: 0
    },
    //maxIssueCount
    {
        title: "Issue Opener",
        description: "Have created {{ amount }} issues in a single repository",
        badge: "badge_1",
        amount: 0,
        next: 0
    },
    //totalCommitCount
    {
        title: "Contributor",
        description: "Have created {{ amount }} commits in total",
        badge: "badge_3",
        amount: 0,
        next: 0
    },
    //maxCommitCount
    {
        title: "Committed Developer",
        description: "Have created {{ amount }} commits in a single repository",
        badge: "badge_3",
        amount: 0,
        next: 0
    },
    //repositoryCount
    {
        title: "Repository Explorer",
        description: "Have contributed to {{ amount }} repositories",
        badge: "badge_4",
        amount: 0,
        next: 0
    },
    //totalContributionCount
    {
        title: "Influencer",
        description: "Have {{ amount }} contributions in total",
        badge: "badge_5",
        amount: 0,
        next: 0
    }
]