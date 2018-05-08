'use strict';

exports.isAllowed = function (req, res, next) {
    if (req.user || req.method === 'GET') {
        return next();
    } else {
        return res.status(403).json({
            status: 403,
            message: 'User is not authorized'
        });
    }
};