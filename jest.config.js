module.exports = {
    displayName: "@neo4j/cypher-builder",
    setupFilesAfterEnv: ["jest-extended/all"],
    roots: ["<rootDir>/src/", "<rootDir>/tests/"],
    coverageDirectory: "<rootDir>/coverage/",
    prettierPath: null,
    snapshotFormat: {
        escapeString: true,
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
