var express = require('express');
var router = express.Router();
const pool = require('../db/db');

//관리자 페이지 이동
router.get('/', async (req, res) => {
    const query21 = await pool.query("select * from menu");
    console.log(query21[0]);
    res.render('admin', {
        menu : query21[0],
    });
})

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
module.exports = router;