var express = require('express');
var router = express.Router();
const pool = require('../db/db');
const session = require("express-session");
const sessionStore = require("../db/session");

// 로그인 페이지 이동
router.get('/', (req, res) => {
  try {
    if (req.session.uid) {
      // 로그아웃 프로세스 uid 가 있으면 없애고 / 로 돌아기기
      delete req.session.uid;
      console.log("로그아웃 완료");
      return res.redirect('/');
      } else {
        res.render('login');
      }
  } catch (error){
    console.log(error);
  }
  });

// 로그인 프로세스
router.post('/process', async (req, res) => {
  const { userid, userpw } = req.body;
  const query2 = await pool.query('SELECT * FROM user WHERE userid = ? and userpw = ?;', [userid, userpw]);
  try{
    if(userpw === query2[0][0].userpw){
      req.session.uid = userid;
      res.redirect("/");
      console.log("로그인 완료");
    } else {
      res.redirect('/login');
      console.log('로그인 실패');
    }
  } catch(error){
    console.log(error);
  }
});

module.exports = router;

