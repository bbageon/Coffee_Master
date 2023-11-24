var express = require('express');
var router = express.Router();
const pool = require('../db/db');

router.get('/', async (req, res) => {
    try {
        const query24 = await pool.query("select orderid from orders where user_userid = ?",[req.session.uid]);
        temp = [];
        data = [];
        user = req.session.uid;
        for (i=0; i<query24[0].length; i++){
            const query25 = await pool.query("SELECT menu_menuid,order_orderid,order_qua,in_price,menuprice FROM menu_has_order inner join menu on menu_menuid = menuid where order_orderid =?;",[query24[0][i].orderid]);
            temp.push(query25[0]);
            for (j=0; j<temp[i].length; j++){
                data.push(temp[i][j]);
                console.log(temp[i][j].order_qua, temp[i][j].menuprice);
                let price = temp[i][j].order_qua * temp[i][j].menuprice;
            }
        }
        const query29 = await pool.query("select * from orders where user_userid = ? ",[req.session.uid]);
        console.log("!!!", query29[0]);
        res.render('orderpage', {
            data : data, 
            user : user,
            orderdata : query29[0]
        });

    } catch (error) {
        console.log(error);
    }

});


module.exports = router;