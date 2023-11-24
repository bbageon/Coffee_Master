var express = require('express');
var router = express.Router();
const pool = require('../db/db');

// 관리자 번호
const adminnum = 999;
/* GET home page. */
router.get('/', async (req, res) => {
  const query27 = await pool.query("SELECT order_orderid, sum(in_price) as in_price FROM menu_has_order group by order_orderid;");
  console.log(query27[0][0].in_price);
  try {
    if(req.session.uid){
      log = "로그아웃"
      log2 = "장바구니"
      log3 = "주문목록"
    } else{
      log = "로그인"
      log2 =""
      log3 =""
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
      admin : admin,
      orderlist : log3
     });
  } catch (error){
    console.log(error);
  };  
});


module.exports = router;
