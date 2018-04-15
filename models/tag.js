var pool = require('../lib/mysql');
var pinyin = require('pinyin');

class Tag {
    constructor(tag) {
        this.userId = tag.userId;
        this.tagZh = tag.tag? tag.tag.trim() : '';
    }

    // 创建一标签
    create(callback) {
        var tagZh = this.tagZh;
        var tagPinyin = pinyin(tagZh, {style: pinyin.STYLE_TONE2});
        var tagPy = tagPinyin.join('').toLowerCase();
        
        var article = {
            user_id: this.userId,
            tag_zh: tagZh,
            tag_py: tagPy
        };
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('select * from th_tag where user_id=? and tag_zh=?', [article.user_id, tagZh], function (err, result) {
                if(err){
                    return callback(err);
                }
                if(result.length>0){
                    connection.release();
                    return callback('exist');
                }
                connection.query('INSERT INTO th_tag SET ?', article, function (err, rows) {
                    connection.release();
                    callback(err, rows);
                });
            });
        });
    }

    // 通过用户 id 获取标签
    getTagsById(callback) {
        var user_id = this.userId;
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('select * from th_tag where user_id=?', user_id, function (err, row) {
                connection.release();
                callback(err, row);
            });
        });
    }

    getTags(callback){
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('select tag_py, max(tag_zh) tag_zh, max(user_id) user_id  from th_tag GROUP BY tag_py  order by heat desc limit 11', function (err, row) {
                connection.release();
                callback(err, row);
            });
        });
    }

    // 通过用户 id 和 标签 删除
    delTags(callback) {
        var userId = this.userId;
        var tagZh = this.tagZh;
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('DELETE FROM th_tag where user_id=? and tag_zh=', [userId, tagZh], function(err, rows) {
                connection.release();
                callback(err, rows);
            });
        });
    }
}


module.exports = Tag;