var express = require('express');
var router = express.Router();
const pool = require('../db/db');


// 회원가입 페이지 이동
router.get('/', (req, res) => {
    res.render('signup');
  });

router.post('/proces', async(req, res) => {
    const {userid, userpw, username} = req.body;
    // console.log(userid, userpw, username);
    try {
        const query3 = await pool.query("INSERT INTO user (userid, userpw, username) VALUES (?, ?, ?);",
        [userid, userpw, username]);
        return res.send(`<script type = "text/javascript" >alert("회원가입 완료"); location.href ="/";</script>`);
    }
    catch(error) {
        console.log(error);
    }    
});




module.exports = router;
