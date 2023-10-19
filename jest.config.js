module.exports = {
    displayName: "@neo4j/cypher-builder",
    setupFilesAfterEnv: ["jest-extended/all"],
    roots: ["<rootDir>/src/", "<rootDir>/tests/"],
    coverageDirectory: "<rootDir>/coverage/",
    snapshotFormat: {
        escapeString: true,
    },
    prettierPath: null,
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                tsconfig: "<rootDir>/tsconfig.json",
            },
        ],
    },
};
