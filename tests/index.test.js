// Run Integration Test

import { unstable_dev } from "wrangler";

import custom_worker from "../src/index"

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

  it("should return an error code.", async () => {
    const resp = await custom_worker.fetch(null, {}, null)
    expect(resp.ok).toBeFalsy()
  })
});
