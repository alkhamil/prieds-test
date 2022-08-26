const config = require('../configs/database');
const mysql = require('mysql');
const pool = mysql.createPool(config);

pool.on('error',(err)=> {
    console.error(err);
});

module.exports ={

    getVisitor(req,res){
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM ms_visitor;
                `
            , function (error, results) {
                if(error) throw error;  
                if (results && results.length == 0) {
                    res.send({ 
                        success: false, 
                        message: 'Data tidak ditemukan!',
                    });
                } else {
                    res.send({ 
                        success: true, 
                        message: 'Berhasil ambil data!',
                        data: results
                    });
                }
            });
            connection.release();
        })
    },

    getVisitorByID(req,res){
        let id = req.params.id;
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                SELECT * FROM ms_visitor WHERE id = ?;
                `
            , [id] ,
            function (error, results) {
                if(error) throw error;  
                if (results && results.length == 0) {
                    res.send({ 
                        success: false, 
                        message: 'Data tidak ditemukan!',
                    });
                } else {
                    res.send({ 
                        success: true, 
                        message: 'Berhasil ambil data!',
                        data: results[0]
                    });
                }
            });
            connection.release();
        })
    },

    addVisitor(req,res){
        let data = {
            fullname : req.body.fullname,
            nikname : req.body.nikname,
            birthday : req.body.birthday,
            address : req.body.address,
        }
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                INSERT INTO ms_visitor SET ?;
                `
            , [data],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil tambah data!',
                });
            });
            connection.release();
        })
    },

    editVisitor(req,res){
        let dataEdit = {
            fullname : req.body.fullname,
            nikname : req.body.nikname,
            birthday : req.body.birthday,
            address : req.body.address,
        }
        let id = req.body.id
        pool.getConnection(function(err, connection) {
            if (err) throw err;
            connection.query(
                `
                UPDATE ms_visitor SET ? WHERE id = ?;
                `
            , [dataEdit, id],
            function (error, results) {
                if(error) throw error;  
                res.send({ 
                    success: true, 
                    message: 'Berhasil edit data!',
                });
            });
            connection.release();
        })
    }
}