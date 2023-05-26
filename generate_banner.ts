import {achievements} from "./types";
import {Achievement} from "./types";
import {dataOfInterest} from "./github_rewards";

let achievement_template = `
      <div class="grid-item">
        <div class="split-container">
          <div class="split-left">
            <img class="split-image" src="{{ src }}" alt="{{ achievement_title }}" />
          </div>
          <div class="split-right">
            <span class="achievement_title">{{ achievement_title }}</span>
            <span class="achievement_description">{{ achievement_description }}</span>
            <span class="next">Next milestone: {{ achievement_next }}</span>
          </div>
        </div>
      </div>
`;

let milestones: number[] = [1, 2, 5, 10, 25, 50, 100, 250, 500, 1000];


/**
 * Replace the placeholders in the banner template with the correct values using regex.
 */
export function generateBanner() {
    console.log("Generating banner...")
    let banner = require("fs").readFileSync("./templates/overview.svg", "utf8");
    let base_height = 350;
    banner = banner.replace(/{{ username }}/g, dataOfInterest.username);

    //calculate all achievements
    achievements.forEach((achievement: Achievement) => {
        switch(achievement.title) {
            case "Collaborative Spirit":
                setAmountAndNext(achievement, dataOfInterest.totalPullRequestCount);
                break;
            case "Merge Enthusiast":
                setAmountAndNext(achievement, dataOfInterest.maxPullRequestCount);
                break;
            case "Troubleshooter":
                setAmountAndNext(achievement, dataOfInterest.totalIssueCount);
                break;
            case "Issue Opener":
                setAmountAndNext(achievement, dataOfInterest.maxIssueCount);
                break;
            case "Contributor":
                setAmountAndNext(achievement, dataOfInterest.totalCommitCount);
                break;
            case "Committed Developer":
                setAmountAndNext(achievement, dataOfInterest.maxCommitCount);
                break;
            case "Repository Explorer":
                setAmountAndNext(achievement, dataOfInterest.repositoryCount);
                break;
            case "Influencer":
                setAmountAndNext(achievement, dataOfInterest.totalContributionCount);
                break;
        }
    });

    //write the achievements to the banner
    let allAchievements = "";
    let achievementCount = 0;
    let roman_numerals = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
    achievements.forEach((achievement: Achievement) => {
        let achievement_string = achievement_template;
        if(achievement.amount !== 0) {
            achievementCount++;
            achievement_string = achievement_string.replace(/{{ src }}/g, `./images/${achievement.title}.svg`);
            let roman_numeral = roman_numerals[milestones.indexOf(achievement.amount)];
            achievement_string = achievement_string.replace(/{{ achievement_title }}/g, `${achievement.title} ${roman_numeral}`);
            achievement_string = achievement_string.replace(/{{ achievement_description }}/g, achievement.description.replace(/{{ amount }}/g, achievement.amount.toString()));
            achievement_string = achievement_string.replace(/{{ achievement_next }}/g, achievement.next.toString());
            allAchievements += achievement_string;
        }
    });
    banner = banner.replace(/{{ achievements }}/g, allAchievements);
    let final_height = base_height; //0, 1, 2 = 350; 3, 4: 525; 5, 6: 700; 7, 8: 875;
    if(achievementCount !== 0) final_height += (Math.floor((achievementCount + 1) / 2) - 1) * 175;

    banner = banner.replace(/{{ height }}/g, `${final_height}`);

    require("fs").writeFileSync("./generated/overview.svg", banner);
}

function setAmountAndNext(achievement: Achievement, amount: number) {
    if(amount == 0) return;
    for(let i = 0; i < milestones.length; i++) {
        if(milestones[i] > amount) {
            achievement.amount = milestones[i-1];
            achievement.next = milestones[i];
            break;
        }
    }
}