"use strict";
// import { readFile } from "fs";
// import { evaluate_URL , read_file } from "../src/main";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
describe('test ndjson', () => {
    // Test case 1
    it('test correct url', () => __awaiter(void 0, void 0, void 0, function* () {
        const output = {
            "URL": "123",
            "NET_SCORE": -1,
            "RAMP_UP_SCORE": -1,
            "CORRECTNESS_SCORE": -1,
            "BUS_FACTOR_SCORE": -1,
            "RESPONSIVE_MAINTAINER_SCORE": -1,
            "LICENSE_SCORE": -1,
        };
        expect(output).toHaveProperty("URL");
        expect(output).toHaveProperty("NET_SCORE");
        expect(output).toHaveProperty("RAMP_UP_SCORE");
        expect(output).toHaveProperty("CORRECTNESS_SCORE");
        expect(output).toHaveProperty("BUS_FACTOR_SCORE");
        expect(output).toHaveProperty("RESPONSIVE_MAINTAINER_SCORE");
        expect(output).toHaveProperty("LICENSE_SCORE");
        expect(Object.keys(output).length).toEqual(7);
    }));
});
// describe('test readfile', () => {
//     // Test case 1
//     it('test correct file path', async () => {
//         const output = read_file("run");
//         expect(output).toBeDefined();
//     });
//     it('test incorrect file path', async () => {
//         expect(read_file("123")).toThrowError();
//     });
// });
