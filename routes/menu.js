var express = require('express');
var router = express.Router();
const pool = require('../db/db');

// 메뉴페이지 이동
router.get('/', async (req, res) => {
    const query4 = await pool.query('SELECT * FROM menu;');
    const id1 = req.session.uid;
    return res.render('menu',
    {
        menu : query4[0],
        id : id1,
    });
  });

router.post("/menudetail/:menuid", async(req, res) => {
    const menunum= req.params.menuid;
    const id = req.session.uid;
    const query5 = await pool.query('SELECT * FROM menu WHERE menuid=?', [menunum])
    
    res.render('menudetail', {
      menu: query5[0][0],
      id : id
    });
  });

// router.post('/delete', async (req, res) => {
//   console.log("작동중");
// })





module.exports = router;
