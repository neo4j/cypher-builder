module.exports = {
    displayName: "@neo4j/cypher-builder",
    setupFilesAfterEnv: ["jest-extended/all"],
    roots: ["<rootDir>/src/", "<rootDir>/tests/"],
    coverageDirectory: "<rootDir>/coverage/",
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
            statements: 95,
        },
    },
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
