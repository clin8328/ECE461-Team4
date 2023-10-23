"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGithubLink = exports.isNpmLink = void 0;
function isNpmLink(input) {
    const pattern = /^https:\/\/www\.npmjs\.com\/package\/.*$/;
    const pattern2 = /^npmjs\.com\/package\/.*$/;
    return pattern.test(input) || pattern2.test(input);
}
exports.isNpmLink = isNpmLink;
function isGithubLink(input) {
    const pattern = /^https:\/\/github\.com\/.*\/.*$/;
    const pattern2 = /^github\.com\/.*\/.*$/;
    return pattern.test(input) || pattern2.test(input);
}
exports.isGithubLink = isGithubLink;
