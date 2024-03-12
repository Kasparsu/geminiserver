let sessions = {};

module.exports = (req, res, next) => {
    if(req.fingerprint){
        if(!sessions[req.fingerprint]) {
            sessions[req.fingerprint] = {};
        }
        req.session = sessions[req.fingerprint];
        console.log(sessions[req.fingerprint]);
    }
    next();
};