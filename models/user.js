var pool = require('../lib/mysql');

class User  {
    constructor(userId) {
        this.userId = userId;
    }

    getUser(callback){
        var userId = this.userId;
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('select * from th_manager where user_id=?', userId, function (err, rows) {
                connection.release();
                callback(err, rows);
            });
        });
    }

}


module.exports = User;