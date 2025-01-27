/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+.tsx?$": ["ts-jest", {}],
    },
    testTimeout: 90000,
    setupFilesAfterEnv: ['./jest.setup.ts'],
    maxWorkers: 1,

};