const express = require("express");
const ExpressError = require("../expressError")
const db = require("../db");


let router = new express.Router();
// GET / list of invoices

router.get("/", async function (req, res, next) {
    try {
      const result = await db.query(
            `SELECT id, comp_code
             FROM invoices 
             ORDER BY id`
      );
  
      return res.json({"invoices": result.rows});
    }
  
    catch (err) {
      return next(err);
    }
  });

  //GET // invoice details

router.get("/:id", async(req, res, next)=>{
    try{
        let id = req.params.id;
        
        const answer = await db.query(`SELECT i.id, 
        i.comp_code, 
        i.amt, 
        i.paid, 
        i.add_date, 
        i.paid_date, 
        c.name, 
        c.description 
 FROM invoices AS i
   INNER JOIN companies AS c ON (i.comp_code = c.code)  
 WHERE id = $1
        `,[id]);
       
        if (answer.rows.length === 0){
            throw new ExpressError(`no invoice found: ${id}`, 404)
        }
        const data = answer.rows[0];
        const invoice = {
            id: data.id,
            company: {
                code: data.comp_code,
                name: data.name,
                description: data.description
            },
            amt: data.amount,
            paid: data.paid,
            add_date: data.add_date,
            paid_date: data.paid_date,
        };
        return res.json({"invoice": invoice});
    }
     
    catch(err){
        return next(err);
    }
});
//POST / add invoice
router.post("/", async(req,res, next)=>{
    try{
        let {comp_code, amt} = req.body;

        const answer = await db.query(`
        INSERT INTO invoices (comp_code, amt)
        VALUES ($1,$2)
        RETURNING id,comp_code,amt,paid,add_date,paid_date`,
        [comp_code,amt]);

        return res.json({invoice: answer.rows[0]});
    }
    catch(err){
        return next(err);
    }
});
//PUT /update invoice
router.put("/:id", async (req,res,next)=>{
    try{
        let {amt,paid} = req.body;
        let id =req.params.id;
        let paidDate = null;

        const currAnswer = await db.query(`
        SELECT paid
        FROM invoices
        WHERE id = $1`, [id]);
        
        if (currAnswer.rows.length === 0){
            throw new ExpressError(`Can not find invoice: ${id}`, 404);
        }
        const currPaid_date = currAnswer.rows[0].paid_date;

        if (!currPaid_date && paid){
            paidDate = new Date();
        }else if (!paid){ 
            paidDate =null;
        }else{
            paidDate =currPaid_date;
        }

        const answer = await db.query(`
        UPDATE invoices
        SET amt=$1, paid=$2, paid_date=$3
        WHERE id = $4
        RETURNING id, comp_code, amt, paid, paid_date`,
        [amt, paid, paidDate, id]
        );

        return res.json({invoice: answer.rows[0]});
    }
    catch(err){
        return next(err);
    }
})
//DELETE // delete invoice

router.delete("/:id", async function (req, res, next) {
    try {
      let id = req.params.id;
  
      const result = await db.query(
            `DELETE FROM invoices
             WHERE id = $1
             RETURNING id`,
          [id]);
  
      if (result.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
      }
  
      return res.json({"status": "deleted"});
    }
  
    catch (err) {
      return next(err);
    }
  });
  
  module.exports = router;