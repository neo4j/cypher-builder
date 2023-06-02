// const globalConf = require("../../jest.config.base");

module.exports = {
    // ...globalConf,
    displayName: "@neo4j/cypher-builder",
    setupFilesAfterEnv: ["jest-extended/all"],
    roots: ["<rootDir>/src/", "<rootDir>/tests/"],
    coverageDirectory: "<rootDir>/packages/cypher-builder/coverage/",
    snapshotFormat: {
        escapeString: true,
        // printBasicPrototype: true,
    },
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.json",
            },
        ],
    },
};
