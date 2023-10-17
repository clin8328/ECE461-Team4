/*
  Original Author: Chuhan Lin
  Date edit: 9/21/2023
  File description: Test netScore function
*/

import { net_score } from "./netScore";

describe("Net Score function", () => {
  // Test case 1
  it("All valid inputs", () => {
    const metrics = {
      URL: "123.com",
      NET_SCORE: -1,
      RAMP_UP_SCORE: 1,
      CORRECTNESS_SCORE: 1,
      BUS_FACTOR_SCORE: 1,
      RESPONSIVE_MAINTAINER_SCORE: 1,
      LICENSE_SCORE: 1,
    };

    const result = net_score(metrics);

    expect(result).toBe(1);
  });

  it("invalid inputs", () => {
    const metrics = {
      URL: "123.com",
      NET_SCORE: -1,
      RAMP_UP_SCORE: "1",
      CORRECTNESS_SCORE: "1",
      BUS_FACTOR_SCORE: "1",
      RESPONSIVE_MAINTAINER_SCORE: "1",
      LICENSE_SCORE: "1",
    };

    const result = net_score(metrics);

    expect(result).toBe(0);
  });

  it("test regular score", () => {
    const metrics = {
      URL: "123.com",
      NET_SCORE: -1,
      RAMP_UP_SCORE: 0.8,
      CORRECTNESS_SCORE: 0.8,
      BUS_FACTOR_SCORE: 0.8,
      RESPONSIVE_MAINTAINER_SCORE: 0.5,
      LICENSE_SCORE: 1,
    };

    const result = net_score(metrics);

    expect(result).toBe(0.68);
  });
});
