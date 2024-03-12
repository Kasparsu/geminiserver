let Router = require('../router.js');
let router = new Router();

router.on('/', (req, res) => {
    res.render('test.gemini', {var: '\x1b[33m\u{1F622}'});
});
module.exports = router;