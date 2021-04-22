const fs = require("fs");
const core = require("@actions/core");

const alerts = require("./alerts");

async function run() {
  try {
    const repositoriesString = core.getInput("repositories");
    const repositories = JSON.parse(repositoriesString);
    const token = core.getInput("token");
    core.setSecret(token);
    const output = core.getInput("output");
    var repo;
    var results;
    const allResults = JSON.parse('[]');
    for (repo in repositories) {
      core.info(`Fetching dependabot alerts from Github on ${repo} ...`);
      results = await alerts(repo, token);
      allResults.push(results.repository);
    }
    fs.writeFileSync(output, JSON.stringify(allResults));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();