const express = require('express');
const ash = require('express-async-handler');
const router = module.exports = express.Router();
const log = require('../util/req-log')('ta:ctrl:user');
const {Validator} = require('node-input-validator');

const db = require('../db');
const utilmisc = require('../util/misc');

const ReqWrapper = require('../wrapper/req');

router.get('/1', ash(async (req, res, next) => {
    const rw = new ReqWrapper(req, res, next);
    res.set({'Content-Type': 'application/json; charset=utf-8'}).send(200, JSON.stringify(await rw.get_course_status(1810097), undefined, '  '));
    //res.json(await rw.get_course_status(1810097));
}));
router.get('/2', ash(async (req, res, next) => {
    const rw = new ReqWrapper(req, res, next);
    await rw.new_ticket(1810097, 25212880, {this_is_the_note:"123"});
    res.json("ok");
}));
router.get('/3', ash(async (req, res, next) => {
    const rw = new ReqWrapper(req, res, next);
    await rw.upd_ticket_helping("1810097:25212880", 25212880);
    res.json("ok");
}));
router.get('/4', ash(async (req, res, next) => {
    const rw = new ReqWrapper(req, res, next);
    await rw.upd_ticket_resolved("1810097:25212880");
    res.json("ok");
}));

router.get('/get', ash(async (req, res, next) => {
    res.json({
        a: await db.users.geta("123"),
        a1: await db.users.geta("1234"),
        //b: await db.users.geta("1233"),
        //c: await db.users.byEmail.geta("123"),
        d: await db.users.byEmail.geta("456"),
        e: await db.users.byEmail.geta("4567"),
        g: await db.users.byTag.get_all_async('1'),
        h: await db.users.byTag.get_all_async('2')
    });
}));
router.get('/test', ash(async (req, res, next) => {
    const user = {
        username: "123",
        email: "456",
        tag: "1"
    };
    await db.users.putAsync("123", user);
    await db.users.putAsync("1234", {
        username: "1234",
        email: "4567",
        tag: "1"
    });
    await db.users.putAsync("a", {
        username: "a",
        email: "b",
        tag: "2"
    });

    res.json("OK");

    // clearAuth(req);
    // const valid = await new Validator(req.body, {
    //     name: 'required|ascii|maxLength:128|minLength:1',
    //     email: 'email',
    // }).check();
    // if (!valid) {
    //     return res.json({code: 404, msg: 'Invalid data', reqid: req.reqid});
    // }
    //
    // let user = await db.student.get(req.body.name);
    // log(req, 'Got from db[%o], %o', req.body.name, user);
    // if (!user) {
    //     user = {
    //         username: req.body.name,
    //         email: req.body.email
    //     };
    //     modelStudent.putStudent(user);
    //     req.session.student = utilmisc.clone(user);
    //     return res.json({code: 0, msg: 'Ok', newStudent: true, student: user, reqid: req.reqid});
    // } else {
    //     req.session.student = utilmisc.clone(user);
    //     return res.json({code: 0, msg: 'Ok', newStudent: false, student: user, reqid: req.reqid});
    // }
}));

router.get('/all', ash(async (req, res, next) => {
    res.json(await utilmisc.streamToObject(db._db.createReadStream()));
}));