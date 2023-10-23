"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
};
exports.default = config;
