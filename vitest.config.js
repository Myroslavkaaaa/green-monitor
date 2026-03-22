import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'v8',  // або 'istanbul'
            reporter: ['text', 'html', 'lcov']
        },
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test-setup.js']
    },
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: []
    }
});