// Run Integration Test

import { unstable_dev } from "wrangler";

describe("Worker", () => {
  let worker;

  beforeAll(async () => {
    worker = await unstable_dev("./src/index.js", {
      experimental: { disableExperimentalWarning: true },
    });
  });

  afterAll(async () => {
    await worker.stop();
  });

  it("should return Completed.", async () => {
    const resp = await worker.fetch();
    const text = await resp.text();
    expect(text).toMatchInlineSnapshot(`"Completed."`);
  });
});
