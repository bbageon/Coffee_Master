var express = require('express');
var router = express.Router();
const pool = require('../db/db');

//관리자 페이지 이동
router.get('/', async (req, res) => {
    try {
        const query = await pool.query("select * from ingredient");
        const query21 = await pool.query("select * from menu");
        return res.render('admin', {
            menu : query21[0],
            ingredient : query[0],
            count : query[0].length
        })
    } catch (error) {
        console.log(error);
    }
});

// 메뉴삭제
router.post('/delete', async (req, res) => {
    try{
        const menuid = req.body.menuid;
        const query25 = await pool.query("delete from menu where menuid = ?",menuid[0]);
        console.log(menuid[0]);
        return res.send(`<script type = "text/javascript" > alert("삭제 완료!"); location.href = "/admin";</script>`);
    } catch (error) {
        console.log(error);
    }
})

// 메뉴 생성
router.post('/create', async (req, res) => {
    try {
        const menu = req.body;
        const query = await pool.query("select * from menu where menuname = ?",[menu.menuname]);
        // 메뉴 생성 입력값이 전부 입력시
        if (menu.menuname && menu.menuprice && menu.menuclass) {
            // 메뉴가 이미 있을때
            if (query[0].length == 1){
                return res.send(`<script type = "text/javascript" > alert("이미존재하는 메뉴입니다!"); location.href = "/admin";</script>`);
            // 새로운 메뉴일때
            } else {
                const query24 = await pool.query("insert into menu (menuid, menuname, menuprice, menuclass) values(?,?,?,?)",
                [null , menu.menuname, menu.menuprice, menu.menuclass]);
                return res.send(`<script type = "text/javascript" > alert("생성완료!"); location.href = "/admin";</script>`);
            }
        } else {
            return res.send(`<script type = "text/javascript" > alert("항목을 다 입력해주세요!"); location.href = "/admin";</script>`);
        }
    } catch (error) {
        console.log(error);
    }
})

// 추천메뉴 선정
router.post('/recmenu', async (req, res) => {
    try {
        temp = req.body;
        console.log(temp.recmenu);
        // 현재 추천메뉴 아이디
        const query2 = await pool.query("select menuid from menu where rec_menu = 1");

        // 현재 추천메뉴가 있을떄
        if (query2[0][0].menuid) {
            const query3 = await pool.query("update menu set rec_menu = null where menuid = ?",[query2[0][0].menuid]);
            const query = await pool.query("update menu set rec_menu = 1 where menuid = ?", [temp.recmenu]);
            return res.send(`<script type = "text/javascript" > alert("추천 메뉴 선정완료!"); location.href = "/admin";</script>`);
        } else {
            const query = await pool.query("update menu set rec_menu = 1 where menuid = ?", [temp.recmenu]);
            return res.send(`<script type = "text/javascript" > alert("추천 메뉴 선정 완료!"); location.href = "/admin";</script>`);
        }
    } catch (error) {
        console.log(error);
    }
})

router.post('/spemenu', async (req, res) => {
    try {
        temp = req.body;
        console.log(temp.recmenu);
        // 현재 대표메뉴 아이디
        const query2 = await pool.query("select menuid from menu where spe_menu = 1");
        // 현재 대표메뉴가 있을떄
        if (query2[0][0].menuid) {
            const query3 = await pool.query("update menu set spe_menu = null where menuid = ?",[query2[0][0].menuid]);
            const query = await pool.query("update menu set spe_menu = 1 where menuid = ?", [temp.spemenu]);
            return res.send(`<script type = "text/javascript" > alert("대표 메뉴 선정 완료!"); location.href = "/admin";</script>`);
        } else {
            const query = await pool.query("update menu set spe_menu = 1 where menuid = ?", [temp.spemenu]);
            return res.send(`<script type = "text/javascript" > alert("대표 메뉴 선정 완료!"); location.href = "/admin";</script>`);
        }
    } catch (error) {
        console.log(error);
    }
    
});

router.post('/update', async (req, res) => {
    try {
        temp = req.body;
        console.log(temp);
        console.log(temp.length)
        if (temp.menuid && temp.ingredient && temp.ingredient_qua){
            // 메뉴 재료 연결 코드
            const query = await pool.query("insert into ingredient_has_menu (ingredient_ing_name, menu_menuid, ingredient_qua) values(?,?,?)",
            [temp.ingredient, Number(temp.menuid), temp.ingredient_qua]);
            return res.send(`<script type = "text/javascript" >alert("연결 완료"); location.href ="/admin";</script>`);
        } else {
            return res.send(`<script type = "text/javascript" >alert("입력 항목을 확인해주세요"); location.href ="/admin";</script>`);
        }
    } catch (error){
        console.log(error);
    }
});

router.post('/require', async (req, res) => {
    let today = new Date();

    const query = await pool.query("SELECT menu_menuid , sum(order_qua) as qua FROM coffeestore.orders INNER JOIN coffeestore.menu_has_order ON orders.orderid = menu_has_order.order_orderid WHERE orderdate > '2023-11-01' AND orderdate < '2023-11-30' group by menu_menuid order by sum(order_qua) desc;");
    console.log(query[0]);
    for (i=0; i<2; i++){
        const query10 = await pool.query("select * from menu where menuid = ?",[query[0][0].menu_menuid])
        console.log(query10[0][0])
        const query2 = await pool.query("insert into maxmenu values (?,?,?,?,?)",
        [today, i+1 , query[0][0].qua, query[0][0].menu_menuid, "11월"])
      }
      
});

router.post('/require2', async (req, res) => {
    let today = new Date();
    const query = await pool.query("SELECT menu_menuid , sum(order_qua) as qua FROM coffeestore.orders INNER JOIN coffeestore.menu_has_order ON orders.orderid = menu_has_order.order_orderid WHERE orderdate > '2023-10-01' AND orderdate < '2023-10-30' group by menu_menuid order by sum(order_qua) desc;");
    console.log(query[0]);
    for (i=0; i<2; i++){
        const query10 = await pool.query("select * from menu where menuid = ?",[query[0][0].menu_menuid])
        console.log(query10[0][0])
        const query2 = await pool.query("insert into maxmenu values (?,?,?,?,?)",
        [today, i+1 , query[0][0].qua, query[0][0].menu_menuid, "10월"])
      }
});
module.exports = router;