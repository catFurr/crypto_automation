// Run Integration Test

import { unstable_dev } from "wrangler";

describe("Worker", () => {
  let worker;

  beforeAll(async () => {
    worker = await unstable_dev("./src/index.js", {
      env: "test",
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
    await worker.waitUntilExit();
  });

  it("should return Completed.", async () => {
    const resp = await worker.fetch();
    const text = await resp.text();
    expect(text).toMatchInlineSnapshot(`"Completed."`);
  });

});

describe("Worker in Test Env", () => {
  let worker;

  beforeAll(async () => {
    worker = await unstable_dev("./src/index.js", {
      env: "blindtest",
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
    await worker.waitUntilExit();
  });

  it("should return an error code.", async () => {
    const resp = await worker.fetch();
    expect(resp.ok).toBeFalsy()
  })
});
