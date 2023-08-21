import mysql from "mysql";

export default async function handler(req, res) {
  const connection = mysql.createConnection({
    host: "mariadb.cnx6ygbfwdvi.ap-northeast-2.rds.amazonaws.com", // Replace with your MySQL host
    user: "ioteamnova", // Replace with your MySQL username
    password: "teamnova8911", // Replace with your MySQL password
    database: "iot_project", // Replace with your MySQL database name
  });

  connection.connect();

  const query = "SELECT * FROM board"; // Replace with your SQL query

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving data" });
    } else {
      res.status(200).json(results);
    }
  });

  connection.end();
}
