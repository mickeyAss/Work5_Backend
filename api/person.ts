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
router.delete("/delete/:pid", (req, res) => {
  let pid = +req.params.pid;
  conn.query("DELETE FROM person where pid = ?", [pid], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

