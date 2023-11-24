var express = require('express');
var router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    try {
        // 현재 재료 항목
        const query = await pool.query("select * from ingredient");
        // 현재 공급 업체 항목
        const query2 = await pool.query("select * from supply");
        return res.render('ingri',{
            ingredient : query[0],
            count : query[0].length,
            supply : query2[0],
            supcount : query2[0].length
        });
        
    } catch (error) {
        console.log(error);
    }
});

// 재료 생성
router.post('/', async (req, res) => {
    try {
        temp = req.body;
        const query = await pool.query("insert into ingredient values (?,?,?)",[temp.menuname,temp.menuprice,temp.menuunit]);
        console.log("생성완료");
        return res.send(`<script type = "text/javascript" >alert("재료 생성 완료"); location.href ="/ingri";</script>`);
    } catch (error) {
        console.log(error);
    }
});

// 공급 업체 추가
router.post('/supply', async (req, res) => {
    try {
        console.log(req.body.supid);
        const query = await pool.query("insert into supply values(?,?,?);",[req.body.supid, req.body.supname, req.body.supadd])
        return res.send(`<script type = "text/javascript" >alert("공급업체 생성 완료"); location.href ="/ingri";</script>`);
    } catch (error) {
        console.log(error);
    }
})

// 재료주문
router.post('/supplyment', async (req, res) => {
    try {
        const value = req.body;
        // 현재 시각 출력
        let today = new Date();
        // 현재 공급업체 아이디에 해당하는 품목 출력
        const query = await pool.query("select * from supplyinf where supply_supid = ? and ing_name = ?",[value.supid, value.ingredient]);
        console.log(query[0]);
        if (value.ingredient && value.supid && value.sup_qua) {
            // 재료 주문
            const query2 = await pool.query("insert into supplyment (ingredient_ing_name, supply_supid, sup_qua, sup_price, sup_date) values (?,?,?,?,?) ",
            [value.ingredient, value.supid, value.sup_qua, Number(query[0][0].ing_price) * value.sup_qua, today]);
            const query3 = await pool.query("update ingredient set ing_qua = ing_qua + ? where ing_name = ?",
            [value.sup_qua,value.ingredient])
            return res.send(`<script type = "text/javascript" >alert("재료 주문 완료"); location.href ="/ingri";</script>`);
        } else {
            return res.send(`<script type = "text/javascript" >alert("항목을 다 입력해주세요"); location.href ="/ingri";</script>`);
        }
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;