var express = require('express');
var router = express.Router();
const pool = require('../db/db');

router.get('/', (req, res) => {
    res.render('menudetail');
});


module.exports = router;

router.post('/detailorder', async (req, res) => {
    try {
        // 현재시간
        let today = new Date();
        // 입력한 수량
        const quantity = Number(req.body.quantity);
        if (quantity === 0) {
            return res.send(`<script type = "text/javascript" >alert("수량을 입력해주세요"); location.href ="/menu"; </script>`);
        }
        // 현재 상세보기한 메뉴
        const menu =  JSON.parse(req.body.menu);
        // 체크박스 체크 되었는지
        const cash = req.body.cash;
        const creditcard =  req.body.creditcard;
        console.log(cash , creditcard);
        if (creditcard == undefined && cash == undefined) {
            return res.send(`<script type = "text/javascript" >alert("체크 박스를 선택해주세요"); location.href ="/menu"; </script>`);
        }
        // 현금 결재시
        if (cash) {
            // 주문 삽입
            const query23 = await pool.query("insert into orders (ordermethod, orderdate, user_userid) values(?,?,?);",
            [cash, today, req.session.uid]);
            // 주문아이디 검색 query24[0].orderid
            const query24 = await pool.query("select * from orders where orderdate = ? ",[today]);
            const query25 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_qua) values(?,?,?)",
            [menu.menuid, query24[0][0].orderid, quantity]);
            return res.send(`<script type = "text/javascript" >alert("구매 완료"); location.href ="/"; </script>`);
        } 
        if (creditcard) {
            // 주문 삽입
            const query23 = await pool.query("insert into orders (ordermethod, orderdate, user_userid) values(?,?,?);",
            [creditcard, today, req.session.uid]);
            // 주문아이디 검색 query24[0].orderid
            const query24 = await pool.query("select * from orders where orderdate = ? ",[today]);
            // 메뉴 가져와서 주문 테이블 삽입
            const query25 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_qua) values (?,?,?)",
            [menu.menuid, query24[0][0].orderid, quantity]);
            return res.send(`<script type = "text/javascript" >alert("구매 완료"); location.href ="/"; </script>`);
        }
        
        console.log("@@@",creditcard, cash);
        console.log("!!!", menu);
    } catch (error) {
        
    }
});