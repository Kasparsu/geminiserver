let Router = require('../router.js');
const gemini = require('gemini-server');
let router = new Router();

router.on('/register/username', gemini.requireCert, (req, res) => {
    if(req.query){
        req.session.username = req.query;
        res.redirect('/register/email')
    } else{
        res.input('Enter desired username');
    }
});

router.on('/register/email', gemini.requireCert, (req, res) => {
    if(req.query){
        req.session.email = req.query;
        res.redirect('/')
    } else{
        res.input('Enter email');
    }
});

module.exports = router;