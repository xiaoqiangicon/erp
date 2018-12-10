
const jsonRefactor = require('json-refactor');

module.exports = req => {
    req.img = [];
    req.covers.forEach(url => {
        req.img.push({url});
    });

    delete req.covers;

    jsonRefactor(req.specs, [{
        benison: 'desc',
        indexImg: 'icon'
    }]);
};