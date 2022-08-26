const config = require('../configs/database');
const moment = require('moment');
const mysql = require('mysql');
const pool = mysql.createPool(config);

pool.on('error', (err) => {
    console.error(err);
});

module.exports = {
    
    generateQueue(req, res) {
        let data = {
            visitor_id: req.body.visitor_id,
            queue_number: 1
        }

        let created_date = moment().format('YYYY-MM-DD');

        pool.getConnection(function (err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM tr_queue WHERE DATE_FORMAT(created_date, "%Y-%m-%d") = ? order by queue_number desc limit 1;
                `
                , [created_date], 
                function (error, results) {
                    if (error) throw error;

                    if (results.length == 0) {
                        data.queue_number = 1;
                    } else {
                        const lastDate = moment(results[0].created_date).format('YY-MM-DD'); 
                        const currentDate = moment().format('YY-MM-DD'); 

                        if (lastDate == currentDate) {
                            data.queue_number = results[0].queue_number + 1;
                        } else {
                            data.queue_number = 1;
                        }
                    }

                    connection.query(
                        `INSERT INTO tr_queue SET ?`,
                        [data],
                        function (error, results) {
                            if (error) throw error;

                            if (results.affectedRows == 1) {
                                connection.query(
                                    `SELECT * from ms_visitor WHERE id = ?`,
                                    [data.visitor_id],
                                    function(error, results) {
                                        if (error) throw error;
                                        if (results.length == 1) {
                                            res.send({ 
                                                success: true, 
                                                message: 'Berhasil generate data!',
                                                data: {
                                                    queue_number: data.queue_number,
                                                    visitor: results[0],
                                                }
                                            });
                                        } else {
                                            res.send({ 
                                                success: false, 
                                                message: 'Proses gagal!',
                                            });
                                        }
                                    }
                                );
                            } else {
                                res.send({ 
                                    success: false, 
                                    message: 'Proses gagal!',
                                });
                            }
                        }
                    )
                });
            connection.release();
        })
    },
}