import express from "express";
import { conn } from "../dbconnect";
import { Person } from "../model/responePerson";
import mysql from "mysql";

export const router = express.Router();

//เพิ่มข้อมูลดารา
router.post("/insert", (req, res) => {
  let person: Person = req.body;
  let sql =
    "INSERT INTO `star`(`mid_fk` , `pid_fk`) VALUES (?, ?)";
  sql = mysql.format(sql, [
    person.mid_fk,
    person.pid_fk
  ]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRow, last_sid: result.insertId });
  });
});

//ลบข้อมูลบุคคล
router.delete("/delete/:mid_fk/:pid_fk", (req, res) => {
  let mid_fk = +req.params.mid_fk;
  let pid_fk = +req.params.pid_fk;
  conn.query("DELETE from star where mid_fk = ? AND pid_fk = ?", [mid_fk,pid_fk], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});