"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCounts = exports.repositoriesContributedTo = exports.init = void 0;
var rest_1 = require("@octokit/rest");
var github_rewards_1 = require("./github_rewards");
var graphql = require("@octokit/graphql").graphql;
var queryPresets = {
    commitCount: "\n        repository(owner: \"OWNER_NAME\", name: \"REPO_NAME\") {\n            defaultBranchRef {\n                target {\n                    ... on Commit {\n                        history(author: { id: \"NODE_ID\" }) {\n                            totalCount\n                        }\n                    }\n                }\n            }\n        }\n    ",
    issueCount: "\n        search(query: \"repo:OWNER_NAME/REPO_NAME type:issue author:USER_NAME\", type: ISSUE) {\n            issueCount\n        }\n    ",
    pullRequestCount: "\n        search(query: \"type:pr author:USER_NAME repo:OWNER_NAME/REPO_NAME is:merged\", type: ISSUE, first: 1) {\n            issueCount\n        }\n    "
};
var user, node_id, token, repos = [];
/**
 * Initialize the variables user, token and node_id.
 */
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var octokit;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = process.env.GITHUB_ACTOR;
                    token = process.env.ACCESS_TOKEN;
                    octokit = new rest_1.Octokit({
                        auth: token
                    });
                    return [4 /*yield*/, octokit.request("GET /users/".concat(user)).then(function (response) {
                            node_id = response.data.node_id;
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.init = init;
/**
 * Get the repositories the user has contributed to.
 */
function repositoriesContributedTo() {
    return __awaiter(this, void 0, void 0, function () {
        var after, hasNextPage, query;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    after = null;
                    hasNextPage = false;
                    _a.label = 1;
                case 1:
                    query = "\n            query {\n                user(login: \"".concat(user, "\") {\n                    repositoriesContributedTo(first: 100, includeUserRepositories: true, after: ").concat(after, ", contributionTypes: [COMMIT, ISSUE, PULL_REQUEST, PULL_REQUEST_REVIEW, REPOSITORY]) {\n                        nodes {\n                            name\n                            owner {\n                                login\n                            }\n                       }\n                       pageInfo {\n                            endCursor\n                            hasNextPage\n                       } \n                    }\n                }\n            }\n        ");
                    return [4 /*yield*/, graphql(query, {
                            headers: {
                                authorization: "Bearer ".concat(token)
                            }
                        }).then(function (result) {
                            result.user.repositoriesContributedTo.nodes.forEach(function (repo) {
                                if (repo !== null)
                                    repos.push({ owner: repo.owner.login, name: repo.name }); //private repos are listed as null in the response
                            });
                            github_rewards_1.dataOfInterest.repositoryCount = repos.length;
                            if (result.user.repositoriesContributedTo.pageInfo.hasNextPage) {
                                hasNextPage = true;
                                after = JSON.stringify(result.user.repositoriesContributedTo.pageInfo.endCursor);
                            }
                            else
                                hasNextPage = false;
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    if (hasNextPage) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4:
                    console.log('Found the following repositories:', repos);
                    return [2 /*return*/];
            }
        });
    });
}
exports.repositoriesContributedTo = repositoriesContributedTo;
/**
 * Get the total counts of commits, issues and pull requests of the user.
 */
function getCounts() {
    return __awaiter(this, void 0, void 0, function () {
        var countTypes, countPreset, _loop_1, _i, countTypes_1, countType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    countTypes = ["commit", "issue", "pullRequest"];
                    _loop_1 = function (countType) {
                        var batchquery;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    batchquery = "query {";
                                    switch (countType) {
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
                                    repos.forEach(function (repo) {
                                        repo.label = "".concat(repo.owner).concat(repo.name).replace(/[^a-zA-Z0-9_]/g, "");
                                        batchquery += "\n".concat(repo.label, ": ") + countPreset.replace("OWNER_NAME", repo.owner).replace("REPO_NAME", repo.name).replace("NODE_ID", node_id).replace("USER_NAME", user) + '\n';
                                    });
                                    batchquery += "}";
                                    //send batch request
                                    return [4 /*yield*/, graphql(batchquery, {
                                            headers: {
                                                authorization: "Bearer ".concat(token)
                                            }
                                        }).then(function (result) {
                                            var max = 0;
                                            switch (countType) {
                                                case "commit":
                                                    repos.forEach(function (repo) {
                                                        var count = result[repo.label].defaultBranchRef.target.history.totalCount;
                                                        if (count > max)
                                                            max = count;
                                                        github_rewards_1.dataOfInterest.totalCommitCount += count;
                                                    });
                                                    github_rewards_1.dataOfInterest.maxCommitCount = max;
                                                    break;
                                                case "issue":
                                                    repos.forEach(function (repo) {
                                                        var count = result[repo.label].issueCount;
                                                        if (count > max)
                                                            max = count;
                                                        github_rewards_1.dataOfInterest.totalIssueCount += count;
                                                    });
                                                    github_rewards_1.dataOfInterest.maxIssueCount = max;
                                                    break;
                                                case "pullRequest":
                                                    repos.forEach(function (repo) {
                                                        var count = result[repo.label].issueCount;
                                                        if (count > max)
                                                            max = count;
                                                        github_rewards_1.dataOfInterest.totalPullRequestCount += count;
                                                    });
                                                    github_rewards_1.dataOfInterest.maxPullRequestCount = max;
                                                    break;
                                                default:
                                                    throw new Error("Invalid count type");
                                            }
                                        })];
                                case 1:
                                    //send batch request
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, countTypes_1 = countTypes;
                    _a.label = 1;
                case 1:
                    if (!(_i < countTypes_1.length)) return [3 /*break*/, 4];
                    countType = countTypes_1[_i];
                    return [5 /*yield**/, _loop_1(countType)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    github_rewards_1.dataOfInterest.totalContributionCount = github_rewards_1.dataOfInterest.totalCommitCount + github_rewards_1.dataOfInterest.totalIssueCount + github_rewards_1.dataOfInterest.totalPullRequestCount;
                    console.log('Found the following counts:', github_rewards_1.dataOfInterest);
                    return [2 /*return*/];
            }
        });
    });
}
exports.getCounts = getCounts;
