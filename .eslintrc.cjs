module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    settings: {
        react: {
            version: '18.2'
        }
    },
    env: {
        browser: true,
        es2020: true,
        jest: true
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
        'no-unused-vars': 'warn',
        'react/prop-types': 'off'
    }
};