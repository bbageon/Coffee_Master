var express = require('express');
var router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    const query = await pool.query("select user_point from user where userid = ? ",[req.session.uid]);
    console.log("@@@" , query[0]);
    res.render('menudetail');
});


module.exports = router;

router.post('/detailorder', async (req, res) => {
    try {
        const point = req.body.price;
        console.log(point);

        // 현재시간
        let today = new Date();
        // 입력한 수량
        const quantity = Number(req.body.quantity);
        if (quantity === 0) {
            return res.send(`<script type = "text/javascript" >alert("수량을 입력해주세요"); location.href ="/menu"; </script>`);
        }
        // 현재 상세보기한 메뉴
        const menu =  JSON.parse(req.body.menu);
        console.log("%%%" , menu);
        const price = menu.menuprice*quantity;
        // console.log(menu.menuid);
        // console.log(price);
        // 재고 검사
        const query = await pool.query("select * from ingredient_has_menu inner join ingredient on ing_name = ingredient_ing_name where menu_menuid = ?",
        [menu.menuid]);
        const query2 = await pool.query("select * from menu where rec_menu = 1");
        for (y=0; y<query[0].length; y++){
            if (query[0][y].ing_qua < Number(query[0][y].ingredient_qua) * quantity){
                console.log(query[0][y].ing_name, "재고없음");
                return res.send(`<script type = "text/javascript" >alert("재고 부족"); location.href ="/menu"; </script>`);
            } else {
                // 추천메뉴 재고 검사
                if (query2[0][0].menuid == menu.menuid) { 
                    if (query[0][y].ing_qua < Number(query[0][y].ingredient_qua) * 30) {
                        console.log("추천메뉴 재고 부족 ");
                    } 
                }
            }
        }
        
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
            const query23 = await pool.query("insert into orders (ordermethod, orderdate, user_userid, order_price) values(?,?,?,?);",
            [cash, today, req.session.uid, price]);
            // 주문아이디 검색 query24[0].orderid
            const query24 = await pool.query("select * from orders where orderdate = ? ",[today]);
            const query25 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_quam in_price) values(?,?,?,?)",
            [menu.menuid, query24[0][0].orderid, quantity, price]);
            // 재고 업데이트
            // 현재 주문한 메뉴 재료 검색
            const query = await pool.query("select * from ingredient_has_menu where menu_menuid = ?",
            [menu.menuid]);
            for (y=0; y<query[0].length; y++){
                // 검색된 재료 개수 만큼 재고 감소를 수행
                const query2 = await pool.query("update ingredient set ing_qua = ing_qua - ? where ing_name = ?",
                [Number(query[0][y].ingredient_qua) * quantity, query[0][y].ingredient_ing_name]);
            }
            return res.send(`<script type = "text/javascript" >alert("현금 구매 완료"); location.href ="/"; </script>`);
        } 
        // 신용카드 결재시
        if (creditcard) {
            // 주문 삽입
            const query23 = await pool.query("insert into orders (ordermethod, orderdate, user_userid, order_price) values(?,?,?,?);",
            [creditcard, today, req.session.uid, price]);
            // 주문아이디 검색 query24[0].orderid
            const query24 = await pool.query("select * from orders where orderdate = ? ",[today]);
            // 메뉴 가져와서 주문 테이블 삽입
            const query25 = await pool.query("insert into menu_has_order (menu_menuid, order_orderid, order_qua, in_price) values (?,?,?,?)",
            [menu.menuid, query24[0][0].orderid, quantity, price]);
            // 현재 주문한 메뉴 재료 검색
            const query = await pool.query("select * from ingredient_has_menu where menu_menuid = ?",
            [menu.menuid]);
            for (y=0; y<query[0].length; y++){
                // 검색된 재료 개수 만큼 재고 감소를 수행
                const query2 = await pool.query("update ingredient set ing_qua = ing_qua - ? where ing_name = ?",
                [Number(query[0][y].ingredient_qua) * quantity, query[0][y].ingredient_ing_name]);
            }
            return res.send(`<script type = "text/javascript" >alert("신용 카드 구매 완료"); location.href ="/"; </script>`);
        }
        // 적립금 사용

    } catch (error) {
        console.log(error);
    }
});