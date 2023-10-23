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
Object.defineProperty(exports, "__esModule", { value: true });
const rampup_1 = require("../src/rampup");
describe("RampUpTest", () => {
    // Test case 1
    it("good link", () => __awaiter(void 0, void 0, void 0, function* () {
        const RampUpInstance = new rampup_1.RampUp("https://github.com/thockin/test");
        yield RampUpInstance.getGitHubRepoUrl("https://github.com/thockin/test");
        yield RampUpInstance.cloneRepository();
        const output = yield RampUpInstance.rampup();
        yield RampUpInstance.deleteRepository();
        expect(output).toBe(0);
    }));
    it("fake_link", () => __awaiter(void 0, void 0, void 0, function* () {
        const RampUpInstance = new rampup_1.RampUp("https://github.com/Fake/Fake");
        yield RampUpInstance.getGitHubRepoUrl("https://github.com/Fake/Fake");
        yield RampUpInstance.cloneRepository();
        const output = yield RampUpInstance.rampup();
        yield RampUpInstance.deleteRepository();
        expect(output).toBe(0);
    }));
    // it('weaker link', async () => {
    //     const RampUpInstance =  new RampUp("https://www.npmjs.com/package/generate-schema");
    //     await RampUpInstance.getGitHubRepoUrl("https://www.npmjs.com/package/generate-schema");
    //     await RampUpInstance.cloneRepository();
    //     const output = await RampUpInstance.rampup();
    // await RampUpInstance.deleteRepository();
    // expect(output).toBe(0.3172);
    // }, 25000);
});
