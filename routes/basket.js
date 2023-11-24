var express = require('express');
var router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    try {
        // 이떄 req.session.uid == 현재 접속중이 userid 와 같음
        const query13 = await pool.query("select * from basket where user_userid = ?", [req.session.uid]);
        // 현재 장바구니 아이디에 해당하는 모든 메뉴 출력
        const query14 = await pool.query("select * from menu_has_basket where basket_basket_id = ?",[query13[0][0].basket_id]);
        let temp = [];
        let temp2 = [];
        let sum = 0;
        console.log("@@@", query14[0]);
        if(query14[0].length==0){
            // 장바구니에 물건이 없을때
            return res.send(`<script type = "text/javascript" >alert("장바구니에 물건이 없습니다"); location.href ="/";</script>`);
        }
        for (i=0; i<query14[0].length; i++) {
            // 메뉴검색 
            const query16 = await pool.query("select * from menu where menuid = ?",[query14[0][i].menu_menuid]);
            temp.push(query16[0]);
            // console.log("!!!", query16[0]);
            temp2.push(query14[0][i].basket_amount);
            sum = sum + (Number(query16[0][0].menuprice)*query14[0][i].basket_amount);
            console.log("!!!" ,  query16[0][0]);
        }
        console.log("@@@",sum);
        return res.render('basket', {
            basket: temp,
            amount : temp2,
            sum : sum
        });
    } catch (error){
        console.log(error);
        return res.send(`<script type = "text/javascript" >alert("장바구니에 물건이 없노"); location.href ="/";</script>`);

    }
});

router.post('/', async(req, res) => {
    // 현재 상세보기 한 메뉴 값
    const {menuid} = req.body;
    console.log(menuid);
    try {
        // 현재 접속중인 유저 검색
        const query15 = await pool.query("select * from user where userid = ?",[req.session.uid]);
        // 현재 메뉴값 출력
        const query7 = await pool.query("select * from menu where menuid = ?",[
            menuid
        ]);
        // 장바구니 존재하는지 조회
        const query9 = await pool.query("select * from basket where user_userid =?",[req.session.uid]);
        // 장바구니 없을때 장바구니 생성
        if (query9[0][0] === undefined ) {
            const query8 = await pool.query("insert into basket (basket_id,user_userid) values (?,?) ",
            [query15[0][0].userid, req.session.uid]);  // 현재 userid 삽입 
        } else {
            // 장바구니 있을때 메뉴를 찾는다.
            const query10 = await pool.query("select * from menu_has_basket where menu_menuid = ? and basket_basket_id = ?",
            [query7[0][0].menuid, query9[0][0].basket_id]);
            if (query10[0].length === 0){ // 없는 메뉴일경우 추가
                const query12 = await pool.query(
                    "insert into menu_has_basket (menu_menuid, basket_basket_id, basket_amount) values (?,?,?)",
                     [query7[0][0].menuid, query9[0][0].basket_id,1]); // 현재메뉴의 아이디 ,현재 장바구니의 id, 1
                // 있는 메뉴이면 수량 +1 
            } else {
                const query11 = await pool.query("update menu_has_basket set basket_amount = basket_amount+1 where menu_menuid = ? and basket_basket_id = ?",
                [query7[0][0].menuid, query9[0][0].basket_id,1]);
            }
        }
    } catch (error) {
        console.log(error);
        res.send(`<script type = "text/javascript" > alert("????"); location.href = "/";</script>`);
    }
})


module.exports = router;