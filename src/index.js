const fs = require("fs");
const core = require("@actions/core");

const alerts = require("./alerts");

async function run() {
  try {
    const repositoriesString = core.getInput("repositories");
    const repositories = JSON.parse(repositoriesString.toString());
    core.info(`Repositories JSON as ${JSON.stringify(repositories)} ...`);
    const token = core.getInput("token");
    core.setSecret(token);
    const output = core.getInput("output");
    const allResults = JSON.parse('[]');
    repositories.map(async (repo) => {
      var results = await alerts(repo, token);
      allResults.push(results.repository);
    });
    fs.writeFileSync(output, JSON.stringify(allResults));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();