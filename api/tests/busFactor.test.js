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
const busFactor_1 = require("../src/busFactor");
test("test_1 Bus Factor", () => __awaiter(void 0, void 0, void 0, function* () {
    let url = "https://github.com/davisjam/safe-regex";
    let bus = new busFactor_1.Bus(url);
    bus.getGitHubRepoUrl(url);
    const output = yield bus.Bus_Factor(url);
    expect(output).toBeGreaterThan(0); // Corrected the usage of toBe()
}));
test("test_2 Bus Factor", () => __awaiter(void 0, void 0, void 0, function* () {
    let url = "https://github.com/cloudinary/cloudinary_npm";
    let bus = new busFactor_1.Bus(url);
    bus.getGitHubRepoUrl(url);
    const output = yield bus.Bus_Factor(url);
    expect(output).toBeGreaterThan(0); // Corrected the usage of toBe()
}));
test("fake github", () => __awaiter(void 0, void 0, void 0, function* () {
    let url = "https://github.com/cloudinory/fakerepo";
    let bus = new busFactor_1.Bus(url);
    bus.getGitHubRepoUrl(url);
    const output = yield bus.Bus_Factor(url);
    expect(output).toBe(-1); // Corrected the usage of toBe()
}));
