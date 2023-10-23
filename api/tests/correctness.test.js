"use strict";
/*
  Original Author: Will Stonebridge
  Date edit: 9/21/2023
  File description: Tests the correctness metric.
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const correctness_1 = require("../src/correctness");
describe("Testing Correctness", () => {
    // beforeAll(async () => {
    //   // Code to run before all test cases start
    //   // For example, you can set up test data, initialize resources, or perform setup tasks
    //   await repoHandler.cloneRepository();
    // });
    // afterAll(async () => {
    //   // Code to run before all test cases start
    //   // For example, you can set up test data, initialize resources, or perform setup tasks
    //   const repoHandler = new License(repoLink, repoName);
    //   await repoHandler.deleteRepository();
    // });
    it("Lints Correctly", () => {
        const expected_errors = 6;
        (0, correctness_1.lintFile)("src/testing/custom_test_output.ts").then((observed_errors) => {
            expect(observed_errors).toBe(expected_errors);
        });
    });
    it("Lint Failure on non-code files", () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, correctness_1.lintFile)("src/testing/unlintable.txt")).rejects.toThrow();
    }));
    it("Evaluate setIncludes", () => __awaiter(void 0, void 0, void 0, function* () {
        expect((0, correctness_1.setIncludes)("12312345678765434567654", ["12"])).toBe(true);
        expect((0, correctness_1.setIncludes)("12312345678765434567654", ["9", "91"])).toBe(false);
    }));
    // it('Evaluate Metric (curr Repo)', async () => {
    //   let metric = new Correctness('https://github.com/KillianLucas/open-interpreter/', '../');
    //   metric.getGitHubRepoUrl('https://github.com/KillianLucas/open-interpreter/');
    //   let value = await metric.getMetric();
    //   expect(value).toBeLessThanOrEqual(1);
    //   expect(value).toBeGreaterThanOrEqual(0);
    // });
    it("Evaluate Metric (git url)", () => __awaiter(void 0, void 0, void 0, function* () {
        let metric = new correctness_1.Correctness("https://www.npmjs.com/package/form-data");
        yield metric.getGitHubRepoUrl("https://www.npmjs.com/package/form-data");
        yield metric.cloneRepository();
        let value = yield metric.getMetric();
        yield metric.deleteRepository();
        expect(value).toBe(0.95);
    }), 200000);
});
