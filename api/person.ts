import express from "express";
import { conn } from "../dbconnect";
import { Person } from "../model/responePerson";
import { Movie } from "../model/responeMovie";
import mysql from "mysql";

export const router = express.Router();

//เรียกข้อมูลคนทั้งหมด
router.get("/", (req, res) => {
  conn.query("SELECT * FROM `person`", (err, result) => {
    res.json(result);
  });
});

//เพิ่มข้อมูลคน
router.post("/insert", (req, res) => {
  let person: Person = req.body;
  let sql =
    "INSERT INTO `person`(`pname` , `pimage` , `ptype` , `pbirthday`) VALUES (?, ?, ?, ?)";
  sql = mysql.format(sql, [
    person.pname,
    person.pimage,
    person.ptype,
    person.pbirthday,
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRow, last_pid: result.insertId });
  });
});

//ลบข้อมูลบุคคล
router.delete("/:pid", (req, res) => {
  let pid = +req.params.pid;
  conn.query("DELETE FROM person where pid = ?", [pid], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

//เพิ่มข้อมูลของคน และ ดารา
router.post("/insertstar/:mid", (req, res) => {
  let person: Person = req.body;
  const midId = req.params.mid;

  let Msql = "SELECT * FROM `movie` WHERE `mid` = ?";
  conn.query(Msql, [midId], (MovieErr, MovieResult) => {
    if (MovieErr) {
      throw MovieErr;
    }
    if (MovieResult.length == 0) {
      return res
        .status(200)
        .json({ success: false, message: "Not Have movie" });
    }

    let sql =
      "INSERT INTO `person`(`pname` , `pimage` , `ptype` , `pbirthday`) VALUES (?, ?, ?, ?)";
    sql = mysql.format(sql, [
      person.pname,
      person.pimage,
      person.ptype,
      person.pbirthday,
    ]);

    conn.query(sql, (err, result) => {
      if (err) throw err;

      const pidId = result.insertId;
      let Ssql = "INSERT INTO `star`(`mid_fk`,`pid_fk`) VALUES ( ? , ? )";
      Ssql = mysql.format(Ssql, [midId, pidId]);
      conn.query(Ssql, (StarErr, StarResult) => {
        if (StarErr) throw StarErr;

        res.status(201).json({
          success: true,
          result,
          StarResult,
          message: "Insert Successful",
        });
      });
    });
  });
});

//ลบข้อมูลดาราออกจากหนัง
router.delete("/deletestar/:mid_fk/:pid_fk", (req, res) => {
  let sid = req.params.pid_fk;
  let mid = req.params.mid_fk;

  let Msql = "SELECT * FROM `movie` WHERE `mid` = ?";
  conn.query(Msql, [mid], (MovieErr, MovieResult) => {
    if (MovieErr) {
      throw MovieErr;
    }
    if (MovieResult.length == 0) {
      return res
        .status(200)
        .json({ success: false, message: "Not Have movie" });
    }
    let sql = "DELETE from star where mid_fk = ? AND pid_fk = ?";
    conn.query(sql, [mid, sid], (err, result) => {
      if (err) throw err;
      {
        res
          .status(200)
          .json({
            affected_row: result.affectedRow,
            last_sid: result.insertId,
          });
      }
    });
  });
});

//เพิ่มข้อมูลของคน และ ผู้สร้าง
router.post("/insertcreater/:mid", (req, res) => {
    let person: Person = req.body;
    const midId = req.params.mid;
  
    let Msql = "SELECT * FROM `movie` WHERE `mid` = ?";
    conn.query(Msql, [midId], (MovieErr, MovieResult) => {
      if (MovieErr) {
        throw MovieErr;
      }
      if (MovieResult.length == 0) {
        return res
          .status(200)
          .json({ success: false, message: "Not Have movie" });
      }
  
      let sql =
        "INSERT INTO `person`(`pname` , `pimage` , `ptype` , `pbirthday`) VALUES (?, ?, ?, ?)";
      sql = mysql.format(sql, [
        person.pname,
        person.pimage,
        person.ptype,
        person.pbirthday,
      ]);
  
      conn.query(sql, (err, result) => {
        if (err) throw err;
  
        const pidId = result.insertId;
        let Csql = "INSERT INTO `creator`(`mid_fk`,`pid_fk`) VALUES ( ? , ? )";
        Csql = mysql.format(Csql, [midId, pidId]);
        conn.query(Csql, (CreatorErr, CreatorResult) => {
          if (CreatorErr) throw CreatorErr;
  
          res.status(201).json({
            success: true,
            result,
            CreatorResult,
            message: "Insert Successful",
          });
        });
      });
    });
  });

  //ลบข้อมูลผู้สร้างออกจากหนัง
router.delete("/deletecreator/:mid_fk/:pid_fk", (req, res) => {
    let cid = req.params.pid_fk;
    let mid = req.params.mid_fk;
  
    let Msql = "SELECT * FROM `movie` WHERE `mid` = ?";
    conn.query(Msql, [mid], (MovieErr, MovieResult) => {
      if (MovieErr) {
        throw MovieErr;
      }
      if (MovieResult.length == 0) {
        return res
          .status(200)
          .json({ success: false, message: "Not Have movie" });
      }
      let sql = "DELETE from creator where mid_fk = ? AND pid_fk = ?";
      conn.query(sql, [mid, cid], (err, result) => {
        if (err) throw err;
        {
          res
            .status(200)
            .json({
              affected_row: result.affectedRow,
              last_cid: result.insertId,
            });
        }
      });
    });
  });
