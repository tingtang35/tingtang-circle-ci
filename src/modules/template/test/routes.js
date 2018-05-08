'use strict';
var request = require('supertest'),
    assert = require('assert'),
    mongoose = require('mongoose'),
    _model = require('../models/model').model,
    app = require('../../../config/express'),
    Model = mongoose.model(_model);

var item,
    token;

describe(_model + ' CRUD routes tests', function () {

    before(function (done) {
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdE5hbWUiOiJ0ZXN0IiwibGFzdE5hbWUiOiJ0ZXN0IiwiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSIsInByb2ZpbGVJbWFnZVVSTCI6Imh0dHA6Ly9yZXMuY2xvdWRpbmFyeS5jb20vaGZsdmxhdjA0L2ltYWdlL3VwbG9hZC92MTQ4NzgzNDE4Ny9nM2h3eWllYjdkbDd1Z2RnajN0Yi5wbmciLCJyb2xlcyI6WyJ1c2VyIl0sIl9pZCI6IjVhZDk3MGM3NTQwY2RiMDY1MDkzYTYyYSIsInVzZXJuYW1lIjoidGVzdCIsImNyZWF0ZWQiOiIyMDE4LTA0LTIwVDA0OjQ3OjAzLjY3MloiLCJwcm92aWRlciI6ImxvY2FsIiwiZGlzcGxheU5hbWUiOiJ0ZXN0IHRlc3QiLCJfX3YiOjAsImxvZ2luVG9rZW4iOiIifQ.pclJ4vdoEdU81Or3cTX_fN-WEsGP2gALU1JJSbJt5w4';
        item = {
            name: 'name'
        };
        done();
    });

    it('should be ' + _model + ' get', function (done) {

        request(app)
            .get('/api/' + _model)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 400);
                assert.equal(resp.data.length, 0);
                done();
            });

    });

    it('should be ' + _model + ' get by id', function (done) {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(item)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .get('/api/' + _model + '/' + resp.data._id)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, item.name);
                        done();
                    });
            });

    });

    it('should be ' + _model + ' post use token', function (done) {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(item)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                assert.equal(resp.status, 200);
                assert.equal(resp.data.name, item.name);
                done();
            });

    });

    it('should be ' + _model + ' put use token', function (done) {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(item)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/' + _model + '/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .send(update)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) {
                            return done(err);
                        }
                        var resp = res.body;
                        assert.equal(resp.status, 200);
                        assert.equal(resp.data.name, update.name);
                        done();
                    });
            });

    });

    it('should be ' + _model + ' delete use token', function (done) {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(item)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/' + _model + '/' + resp.data._id)
                    .set('Authorization', 'Bearer ' + token)
                    .expect(200)
                    .end(done);
            });

    });

    it('should be ' + _model + ' post not use token', function (done) {

        request(app)
            .post('/api/' + _model)
            .send(item)
            .expect(403)
            .expect({
                status: 403,
                message: 'User is not authorized'
            })
            .end(done);

    });

    it('should be ' + _model + ' put not use token', function (done) {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(item)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                var update = {
                    name: 'name update'
                }
                request(app)
                    .put('/api/' + _model + '/' + resp.data._id)
                    .send(update)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    it('should be ' + _model + ' delete not use token', function (done) {

        request(app)
            .post('/api/' + _model)
            .set('Authorization', 'Bearer ' + token)
            .send(item)
            .expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                var resp = res.body;
                request(app)
                    .delete('/api/' + _model + '/' + resp.data._id)
                    .expect(403)
                    .expect({
                        status: 403,
                        message: 'User is not authorized'
                    })
                    .end(done);
            });

    });

    afterEach(function (done) {
        Model.remove().exec(done);
    });

});