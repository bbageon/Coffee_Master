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

        
        // 재고 검사
        for (i=0; i<value3.length; i++) {
            // 현재 장바구니에 있는 메뉴아이디를 이용해 재료 출력
            const query = await pool.query("SELECT * FROM ingredient_has_menu inner join ingredient on ingredient_ing_name = ing_name where menu_menuid = ?;",
            [value3[i].menuid]);
            const query2 = await pool.query("select basket_amount from menu_has_basket where menu_menuid= ?;",[value3[i].menuid]);

            temp = [];
            temp.push( query2[0][0].basket_amount, query[0][0].ingredient_qua, query[0][0].ing_qua );
            if ((temp[0] * temp[1]) > temp[2]) {
                console.log("재고가 없습니다");
                return res.send(`<script type = "text/javascript" >alert("재고 부족"); location.href ="/"; </script>`);
            } else {
                // 추천메뉴 재고검사
                if (temp[1] * 1 > temp[2] ) {
                    console.log("추천메뉴 재고 부족");
                    return res.send(`<script type = "text/javascript" >alert("추천 메뉴 재고 부족"); location.href ="/admin"; </script>`);
                }
            }
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
            const query20 = await pool.query("SELECT basket_basket_id,basket_amount,menuprice FROM menu_has_basket inner join menu on menu_menuid = menuid where basket_basket_id = ?;",
            [req.session.uid]);
            for (i=0; i<value3.length; i++){
                // 장바구니 일괄주문
                const query19 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_qua, in_price) values (?,?,?,?);",
                [value3[i].menuid, query21[0][0].orderid, query20[0][i].basket_amount, query20[0][i].menuprice*query20[0][i].basket_amount]);
                // 현재 주문한 메뉴 재료 검색
                const query = await pool.query("SELECT * FROM ingredient_has_menu inner join menu_has_basket on menu_has_basket.menu_menuid = ingredient_has_menu.menu_menuid where basket_basket_id = ? and menu_has_basket.menu_menuid = ?; ",
                [req.session.uid, value3[i].menuid]);
                for (y=0; y<query[0].length; y++){
                    // 검색된 재료 개수 만큼 재고 감소를 수행
                    const query2 = await pool.query("update ingredient set ing_qua = ing_qua - ? where ing_name = ?",
                    [Number(query[0][y].ingredient_qua) * query[0][y].basket_amount, query[0][y].ingredient_ing_name]);
                }
            }
            // 주문가격 입력
            const query27 = await pool.query("SELECT order_orderid, sum(in_price) as in_price FROM menu_has_order where order_orderid = ? group by order_orderid;",
            [query21[0][0].orderid]);
            const query28 = await pool.query("update orders set order_price = ?",[query27[0][0].in_price]);
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
            const query20 = await pool.query("SELECT basket_basket_id,basket_amount,menuprice FROM menu_has_basket inner join menu on menu_menuid = menuid where basket_basket_id = ?;",
            [req.session.uid]);
            for (i=0; i<value3.length; i++){
                const query19 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_qua, in_price) values (?,?,?,?);",
                [value3[i].menuid, query21[0][0].orderid, query20[0][i].basket_amount, query20[0][i].menuprice*query20[0][i].basket_amount]);
                // 현재 주문한 메뉴 재료 검색
                const query = await pool.query("SELECT * FROM ingredient_has_menu inner join menu_has_basket on menu_has_basket.menu_menuid = ingredient_has_menu.menu_menuid where basket_basket_id = ? and menu_has_basket.menu_menuid = ?; ",
                [req.session.uid, value3[i].menuid]);
                for (y=0; y<query[0].length; y++){
                    // 검색된 재료 개수 만큼 재고 감소를 수행
                    const query2 = await pool.query("update ingredient set ing_qua = ing_qua - ? where ing_name = ?",
                    [Number(query[0][y].ingredient_qua) * query[0][y].basket_amount, query[0][y].ingredient_ing_name]);
                }
            }
            // 주문가격 지정 입력
            const query27 = await pool.query("SELECT order_orderid, sum(in_price) as in_price FROM menu_has_order where order_orderid = ? group by order_orderid;",
            [query21[0][0].orderid])
            const query28 = await pool.query("update orders set order_price = ?",[query27[0][0].in_price]);
            const query22 = await pool.query("delete from menu_has_basket where basket_basket_id = ?",
            [req.session.uid]);
            return res.send(`<script type = "text/javascript" >alert("주문 완료"); location.href ="/basket";</script>`);
        }
    } catch (error) {
        console.log(error);
    }
});


module.exports = router;
