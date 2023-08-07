module.exports = function (router) {
    router.get('/t/:tag?', require('./blog'));
};
