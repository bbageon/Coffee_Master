var express = require('express');
var router = express.Router();

// 관리자 번호
const adminnum = 999;
/* GET home page. */
router.get('/', (req, res) => {
  try {
    if(req.session.uid){
      log = "로그아웃"
      log2 = "장바구니"
    } else{
      log = "로그인"
      log2 =""
    };
    if(req.session.uid == adminnum){
      admin = "관리자 페이지" 
    } else {
      admin = ""
    }
    // console.log(req.body);
    res.render("index",{
      title : "메인페이지",
      login : log,
      basket : log2,
      admin : admin
     });
  } catch (error){
    console.log(error);
  };  
});


module.exports = router;
