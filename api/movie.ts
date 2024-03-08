import express from "express";
import { conn } from "../dbconnect";
import { Movie } from "../model/responeMovie";
export const router = express.Router();
import mysql from "mysql";

//เรียกข้อมูลหนังทั้งมั้งหมด
router.get("/", (req, res) => {
  conn.query("SELECT * FROM `movie`", (err, result) => {
    res.json(result);
  });
});

//เพิ่มข้อมูลหนัง
router.post("/insert", (req, res) => {
  let movie: Movie = req.body;
  let sql =
    "INSERT INTO `movie`(`title` , `year` , `type` , `poster`) VALUES (?, ?, ?, ?)";

  sql = mysql.format(sql, [movie.title, movie.year, movie.type, movie.poster]);
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res
      .status(200)
      .json({ affected_row: result.affectedRow, last_mid: result.insertId });
  });
});

//ลบข้อมูลหนัง
router.delete("/:mid", (req, res) => {
  let mid = +req.params.mid;
  conn.query("DELETE FROM movie where mid = ?", [mid], (err, result) => {
    if (err) throw err;
    res.status(200).json({ affected_row: result.affectedRows });
  });
});

//ค้นหาข้อมูลหนังจากส่วนใดส่วนนึง
router.get("/getdata", (req, res) => {
  const sql = `SELECT movie.*, GROUP_CONCAT(DISTINCT person.pid,' ',person.pname,' ',person.pimage,' ',person.ptype,' ',person.pbirthday) AS actors,
        GROUP_CONCAT(DISTINCT CONCAT(creator_person.pid, ' ' ,creator_person.pname,' ',creator_person.pimage,' ',creator_person.ptype,' ',creator_person.pbirthday)) AS creator
        FROM movie
        LEFT JOIN star ON movie.mid = star.mid_fk
        LEFT JOIN person ON star.pid_fk = person.pid
        LEFT JOIN creator ON movie.mid = creator.mid_fk
        LEFT JOIN person AS creator_person ON creator.pid_fk = creator_person.pid
        GROUP BY movie.mid;`;

  conn.query(sql, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      const movie: Movie[] = result.map((row: Movie) => {
        return {
          mid: row.mid,
          title: row.title,
          year: row.year,
          type: row.type,
          poster: row.poster,
          star: row.actors
            ? row.actors.split(",").map((actor) => {
                const [pid, pname, pimage, ptype, pbirthday] = actor.split(" ");
                return { pid, pname, pimage, ptype, pbirthday };
              })
            : [],

          creator: row.creator
            ? row.creator.split(",").map((creator) => {
                const [pid, pname, pimage, ptype, pbirthday] =
                  creator.split(" ");
                return { pid, pname, pimage, ptype, pbirthday };
              })
            : [],
        };
      });
      res.json(movie);
    }
  });
});

router.get("/search/fields", (req, res) => {

  const sql = `SELECT movie.*, GROUP_CONCAT(DISTINCT person.pid,' ',person.pname,' ',person.pimage,' ',person.ptype,' ',person.pbirthday) AS actors,
        GROUP_CONCAT(DISTINCT CONCAT(creator_person.pid, ' ' ,creator_person.pname,' ',creator_person.pimage,' ',creator_person.ptype,' ',creator_person.pbirthday)) AS creator
        FROM movie
        LEFT JOIN star ON movie.mid = star.mid_fk
        LEFT JOIN person ON star.pid_fk = person.pid
        LEFT JOIN creator ON movie.mid = creator.mid_fk
        LEFT JOIN person AS creator_person ON creator.pid_fk = creator_person.pid
        where (movie.mid IS NULL OR movie.mid = ?) OR (movie.title IS NULL OR movie.title like ?)
        GROUP BY movie.mid;`;

        const search = [req.query.mid, "%" + req.query.title + "%"]
  conn.query(sql, search,(err, result) => {
    
    if (err) {
      res.json(err);
    } else {
      const movie: Movie[] = result.map((row: Movie) => {
        return {
          mid: row.mid,
          title: row.title, 
          year: row.year,
          type: row.type,
          poster: row.poster,
          star: row.actors
            ? row.actors.split(",").map((actor) => {
                const [pid, pname, pimage, ptype, pbirthday] = actor.split(" ");
                return { pid, pname, pimage, ptype, pbirthday };
              })
            : [],

          creator: row.creator
            ? row.creator.split(",").map((creator) => {
                const [pid, pname, pimage, ptype, pbirthday] =
                  creator.split(" ");
                return { pid, pname, pimage, ptype, pbirthday };
              })
            : [],
        };
      });
      res.json(movie);
    }
  });
});
