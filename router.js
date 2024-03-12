const { pathToRegexp, match } = require("path-to-regexp");
class Router {
    _stack;
    constructor() {
        this._stack = [];
    }
    on(path, ...handlers) { //path: string, handler: (Request * Response) -> null
        this._stack.push({
          regexp: path === "*" ? null : pathToRegexp(path, [], {
            sensitive: true,
            strict: false,
          }),
          match: path === "*"
            ? function () {
              return true;
            }
            : match(path, { encode: encodeURI, decode: decodeURIComponent }),
          handlers: handlers,
          fast_star: path === "*",
        });
    }
}

module.exports = Router;