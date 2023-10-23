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
const npmlink_1 = require("../src/npmlink");
/*
  Original Author: Will Stonebridge
  Date edit: 9/24/2023
  File description: Tests the npmlink to gain coverage.
*/
describe("Testing npmlink.ts", () => {
    it("getNPMPackageName", () => {
        expect((0, npmlink_1.getNpmPackageName)("https://www.npmjs.com/package/rc-menu")).toBe("rc-menu");
        expect(() => (0, npmlink_1.getNpmPackageName)("jsdafhajsdghakshdflaskj")).toThrow(Error);
    });
    it("npmToGitRepoUrl", () => __awaiter(void 0, void 0, void 0, function* () {
        let gitUrl = yield (0, npmlink_1.npmToGitRepoUrl)("https://www.npmjs.com/package/rc-menu");
        expect(gitUrl).toBe("https://github.com/react-component/menu.git");
    }), 15000);
    it("npmToGitRepoUrl", () => __awaiter(void 0, void 0, void 0, function* () {
        let gitUrl = yield (0, npmlink_1.npmToGitRepoUrl)("www.npmjs.com/package/browserify");
        expect(gitUrl).toBe("https://github.com/browserify/browserify.git");
    }), 15000);
    // it('get_api_url', async () => {
    //   let apiURL = await get_api_url('https://github.com/WillStonebridge/CycleGan_Reimplementation');
    //   expect(apiURL).toBe('https://api.github.com/repos/WillStonebridge/CycleGan_Reimplementation');
    // }, 12000)
});
