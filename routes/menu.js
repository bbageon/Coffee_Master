var express = require('express');
var router = express.Router();
const pool = require('../db/db');

// 메뉴페이지 이동
router.get('/', async (req, res) => {
    const query4 = await pool.query('SELECT * FROM menu;');
    const id1 = req.session.uid;
    const menuname = req.body.menuname;
    const recmenu = []
    const spemenu = []
    const bestmenu = []
    const bestmenu2 = []
    for (i=0; i<query4[0].length; i++) {
      if (query4[0][i].spe_menu == 1){
        spemenu.push(query4[0][i].menuname);
      }
      if (query4[0][i].rec_menu == "1") {
        recmenu.push(query4[0][i].menuname);
      };
    }
    const query = await pool.query("SELECT menu_menuid, sum(order_qua) FROM coffeestore.orders inner join menu_has_order on order_orderid = orderid group by menu_menuid order by sum(order_qua) desc");
    console.log(query[0][1].menu_menuid)
    for (y=0; y<2; y++) {
      bestmenu.push(query[0][y].menu_menuid)
    }
    console.log("!!!", bestmenu[1]);
    for (i=0; i<bestmenu.length; i++){
      const query10 = await pool.query("select * from menu where menuid = ?",[bestmenu[i]])
      console.log(query10[0][0])
      bestmenu2.push(query10[0][0].menuname);
    }
    console.log("@@@", bestmenu2);
   
    return res.render('menu',
    {
      menu : query4[0],
      id : id1,
      recmenu : recmenu,
      spemenu : spemenu,
      bestmenu2 : bestmenu2
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

router.post("/search", async (req, res) => {
  try {
    const id1 = req.session.uid;
    const menuname = req.body.menuname;
    console.log(menuname);
    // 메뉴 검색
    const query23 = await pool.query("select * from menu where menuname like ?;","%"+[menuname]+ "%");
    const searchlength = query23[0].length;
    return res.render('menu', {
      menu : query23[0],
      id : id1,
    })
  } catch (error) {
    console.log(error);
  }
  
});



module.exports = router;
