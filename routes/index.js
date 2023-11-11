var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  try {
    if(req.session.uid){
      log = "로그아웃"
      log2 = "장바구니"
    } else{
      log = "로그인"
      log2 =""
    };
    // console.log(req.body);
    res.render("index",{
      title : "메인페이지",
      login : log,
      basket : log2
     });
  } catch (error){
    console.log(error);
  };  
});


module.exports = router;
