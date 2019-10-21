var fs = require('fs');
var mjml = require('mjml');
var path = require('path');

function toBase64(file) {
    return fs.readFileSync(file, 'base64');
}

exports.toBase64 = toBase64;

exports.defaultAttachments = [{
    ContentType: 'image/png',
    Filename: 'logo.png',
    ContentID: "logo",
    Base64Content: toBase64(path.join(__dirname, '../../../../app/img/logo.png'))
}, {
    ContentType: 'image/png',
    Filename: 'marianne.png',
    ContentID: "marianne",
    Base64Content: toBase64(path.join(__dirname, '../../../../app/img/marianne.png'))
}];

exports.mjml = function(template) {
    return mjml(template, {
        fonts: {}
    });
};
