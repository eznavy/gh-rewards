# Rewards for GitHub Contributions

## Description
![Example image of a generated achievement banner](https://github.com/eznavy/gh-rewards/blob/master/generated/overview.svg)

This project uses [GitHub Actions](https://github.com/features/actions) to generate achievements to display on your GitHub profile.
The achievements are calculated based on your GitHub contributions and are updated daily. 
The data is fetched from the [GitHub GraphQL API](https://docs.github.com/en/graphql) using a personal access token.

## Disclaimer
The current implementation is not optimal, as the queries used only allow to fetch the public repositories contributed to within the last year. However, the contributions fetched for each of the found repositories are not restricted to one year. The achievements therefore cover some of the past contributions, but not all.
In addition, a dark mode version of the banner is currently missing.

## What data is used?
The following data is used to calculate the achievements:
- username
- public repositories contributed to by the user
- total number of commits, pull requests and issues of each public repository contributed to by the user

## About the personal access token
The personal access token is required to fetch the necessary data from the GitHub GraphQL API.
It is not used for any other purpose and is not shared with any third party. 
The token is stored as a secret in the GitHub repository and is only accessible to the owner of the repository, which will be you if you want to use this project.
If set up correctly, the token can only be used to read public data from the GitHub GraphQL API.

### How to create a personal access token with the right permissions
1. Follow the instructions on [this page](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) to create a personal access token.
Create a fine-grained personal access token as described in the section "Creating a token".
The default settings are sufficient for this project. They only allow read access to public repositories.
As by now, the default settings are:
   1. Repository Access: Public Repositories (read-only)
   2. Permissions: Account permissions: None
   3. Overview: 0 permissions for none of your repositories, 0 Account permissions

## How to use
1. Create a copy of this repository by clicking [here](https://github.com/eznavy/gh-rewards/generate).
2. Go to the "Secrets" section in the Settings of your new repository.
3. Create a new secret with the name `ACCESS_TOKEN` and store your personal access token as the value.
4. You can now manually start the workflow in the "Actions" section of your repository to generate the achievement banner. The job will also run automatically at 12pm every 24 hours.
5. To showcase the banner in your GitHub profile, add the following link to your [profile README](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/customizing-your-profile/managing-your-profile-readme): \
`![](https://raw.githubusercontent.com/eznavy/gh-rewards/master/generated/overview.svg)`


## Related Projects
The project is inspired by [jstrieb/github-stats](https://github.com/jstrieb/github-stats)
