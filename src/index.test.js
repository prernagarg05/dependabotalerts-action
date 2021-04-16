const nock = require('nock');

const alerts = require("./alerts");


describe("fetch dependabot alerts from a Github repository", () => {

  beforeEach(() => {
    nock.disableNetConnect();
  });

  test("should return alerts", async () => {
   const expectedJson = '{"data":{"repository":{"vulnerabilityAlerts":{"totalCount":2,"nodes":[{"dismissedAt":null,"createdAt":"2021-03-20T19:17:10Z","securityVulnerability":{"severity":"HIGH","package":{"name":"is-svg"}}},{"dismissedAt":null,"createdAt":"2021-03-20T19:23:10Z","securityVulnerability":{"severity":"HIGH","package":{"name":"ssri"}}}]}}}}';
    nock('https://api.github.com', {
      reqheaders: {
        authorization: "token test-token"
      }
    }).post('/graphql').reply(200, expectedJson);

    const results = await alerts("octocat/hello-world", "test-token");
    expect(results).toEqual(expectedJson);
  });

  test("should return error bad credentials", async () => {
   const expectedJson = {
      "message": "Bad credentials",
      "documentation_url": "https://docs.github.com/graphql"
    };
    nock('https://api.github.com', {
      reqheaders: {
        authorization: "token wrong-token"
      }
    }).post('/graphql').reply(200, expectedJson);

    const results = await alerts("octocat/hello-world", "wrong-token");
    expect(results).toEqual(expectedJson);

  });
  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});