import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        name: "@neo4j/cypher-builder",
        globals: true,
        include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
        coverage: {
            provider: "v8",
            reporter: ["text", "lcov"],
            reportsDirectory: "./coverage",
        },
        reporters: ["default"],
    },
});
