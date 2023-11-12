var express = require('express');
var router = express.Router();
const pool = require('../db/db');

// 장바구니 일괄구매
router.post('/', async (req, res) => {
    try {
        const {menuid, menuname, menuprice, menuclass} = req.body;
        value3 = [];
        for(var i = 0; i< menuid.length; i++){
        value3.push({
            menuid: menuid[i],
            menuname: menuname[i],
            menuprice: menuprice[i],
            menuclass: menuclass[i],
        })
    }
        // 체크박스 체크 되었는지
        const cash = req.body.cash;
        const creditcard =  req.body.creditcard;
        if (creditcard == undefined && cash == undefined) {
            return res.send(`<script type = "text/javascript" >alert("체크 박스를 선택해주세요"); location.href ="/basket"; </script>`);
        }

        // 현재 시각 출력
        let today = new Date();

        // 현금선택시
        if(cash) {
            // 주문 만들기
            const query17 = await pool.query("insert into orders (ordermethod, orderdate, user_userid) values (?,?,?)",
            [cash, today, req.session.uid]);
            // 현재 주문아이디출력
            const query21 = await pool.query("select * from orders where orderdate = ? and user_userid = ?",[today, req.session.uid])
            // basket id 에 해당하는 값 출력
            const query20 = await pool.query("SELECT * FROM menu_has_basket where basket_basket_id = ?;",
            [req.session.uid]);
            for (i=0; i<value3.length; i++){
                // 장바구니 일괄주문
                const query19 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_qua) values (?,?,?);",
                [value3[i].menuid, query21[0][0].orderid, query20[0][i].basket_amount]);
            }
            const query22 = await pool.query("delete from menu_has_basket where basket_basket_id = ?",
                [req.session.uid]);
                return res.send(`<script type = "text/javascript" >alert("주문 완료"); location.href ="/basket";</script>`);
        }
        // 신용카드 선택시 
        else {
            // 주문 만들기
            const query18 = await pool.query("insert into orders (ordermethod, orderdate, user_userid) values (?,?,?)",
            [creditcard, today, req.session.uid]);
            //현재 주문 아이디 출력
            const query21 = await pool.query("select * from orders where orderdate = ? and user_userid = ?",[today, req.session.uid]);
            // basket id 에 해당하는 값 출력
            const query20 = await pool.query("SELECT * FROM menu_has_basket where basket_basket_id = ?;",
            [req.session.uid]);
            for (i=0; i<value3.length; i++){
                const query19 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_qua) values (?,?,?);",
                [value3[i].menuid, query21[0][0].orderid, query20[0][i].basket_amount]);
            }
            const query22 = await pool.query("delete from menu_has_basket where basket_basket_id = ?",
            [req.session.uid]);
            return res.send(`<script type = "text/javascript" >alert("주문 완료"); location.href ="/basket";</script>`);
        }
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
