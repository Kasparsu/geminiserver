const fs = require('fs');
const gemini = require('gemini-server');
const nunjucks = require('nunjucks');
const { pathToRegexp, match } = require("path-to-regexp");
const { STATUS } = require("gemini-server/utils.js");
const mime = require("mime");
const options = {
  cert: fs.readFileSync('cert.pem'),
  key: fs.readFileSync('key.pem')
};
let env = nunjucks.configure('views', {
    autoescape: true
});


//Create gemini instance with cert and key
const app = gemini(options);
const sessions = require('./session.js');
app.use(sessions);

app.router = (router) => {
    app._stack.push(...router._stack);
};

app.use((req, res, next) => {
    res.render = (name, context={}) => {
        res._body = nunjucks.render(name,context);
        res.status(STATUS._20);
        res._setMeta(mime.getType(name));
        return res;      
    }
    env.addGlobal('req', req);
    next();
});


app.router(require('./controllers/HomeController.js'));
app.router(require('./controllers/AuthController.js'));



//Request input from the user
app.on('/input', (req, res) => {
  if(req.query){
    res.data('you typed ' + req.query);
  }else{
    res.input('type something');
  }
});

//Route params
app.on('/paramTest/:foo', (req, res) => {
  res.data('you went to ' + req.params.foo);
})

app.on('/testMiddlewear', gemini.requireInput("enter something"), (req, res) => {
  res.data('thanks. you typed ' + req.query);
});

app.on('/other', (req, res) => {
  res.data('welcome to the other page');
})

app.on('/test', gemini.static('./public/things'));

app.on('/redirectMe', gemini.redirect('/other'));

app.on('/cert', (req, res) => {
  if(!req.fingerprint){
    res.certify();
  } else {
    res.data(JSON.stringify(req.cert));
  }
});

app.on('/name', gemini.requireCert, (req, res) => {
    if(req.query){
        req.session.name = req.query;
        res.redirect('/')
    }else{
        res.input('type something');
    }
});

app.on('/protected', gemini.requireCert, (req, res) => {
  res.data('only clients with certificates can get here');
});

//start listening. Optionally specify port and callback
app.listen(() => {
  console.log("Listening...");
});