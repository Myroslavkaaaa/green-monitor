module.exports = {
    testDir: './e2e',
    use: {
        baseURL: 'http://localhost:3000',
        headless: false,  // Бачиш браузер
        screenshot: 'only-on-failure',
        video: 'retain-on-failure'
    },
    reporter: [['html']]  // html-звіт
};