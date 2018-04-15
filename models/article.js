var pool = require('../lib/mysql');
var marked = require('marked');
var pinyin = require('pinyin');

class Article {
    constructor(article) {
        this.creatorId = article.creatorId;
        this.title = article.title;
        this.text = article.text;
        this.tag = article.tag;
        this.addAd = article.addAd;
        this.status = article.status;
    }

    // 创建一篇文章
    create(callback) {
        var article = {
            creator_id: this.creatorId,
            title: this.title,
            text: this.text,
            tag: this.tag,
            add_ad: this.addAd,
            status: this.status,
            ctime: new Date()
        };
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('INSERT INTO th_article SET ?', article, function (err, rows) {
                connection.release();
                callback(err, rows);
            });
        });
    }

    // 通过文章 id 获取一篇文章
    getArticleById(articleId, callback) {
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('select * from th_article where id=?', articleId, function (err, row) {
                connection.release();
                callback(err, row);
            });
        });
    }

    // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getArticle(page, pagesize, callback) {
        var creatorId = this.creatorId;
        var status = this.status;
        var tag = this.tag;
        var sql = '';
        var count = '';
        if (creatorId) {
            if(status){
                count = 'select count(*) as total from th_article where creator_id=' + pool.escape(creatorId) + ' and status='+pool.escape(status);
                sql = 'select id,creator_id,title,date_format(ctime,"%Y-%m-%d %H:%i:%s") as ctime,status,html from th_article where creator_id=' + pool.escape(creatorId) + '  and status='+pool.escape(status)+' order by ctime desc limit ' + ((page-1) * pagesize) + ',' + pagesize;
            }else{
                count = 'select count(*) as total from th_article where creator_id=' + pool.escape(creatorId);
                sql = 'select id,creator_id,title,date_format(ctime,"%Y-%m-%d %H:%i:%s") as ctime,status,html from th_article where creator_id=' + pool.escape(creatorId) + ' order by ctime desc limit ' + ((page-1) * pagesize) + ',' + pagesize;
            }
        } else {
            if(tag){ //tag是拼音， 标签全文检索 tag_py
                count ='select count(*) as total from th_article where match(tag_py) against('+pool.escape(tag)+' in boolean mode) and status='+pool.escape(status);
                sql = 'select id,creator_id,title,date_format(ctime,"%Y-%m-%d %H:%i:%s") as ctime,status,html from th_article where match(tag_py) against('+pool.escape(tag)+' in boolean mode)  and status='+pool.escape(status)+' order by id desc limit ' + ((page-1) * pagesize) + ',' + pagesize;
            }else{
                count = 'select count(*) as total from th_article where status='+pool.escape(status);
                sql = 'select id,creator_id,title,date_format(ctime,"%Y-%m-%d %H:%i:%s") as ctime,status,html from th_article where status='+pool.escape(status)+' order by ctime desc limit ' + ((page-1) * pagesize) + ',' + pagesize;
            }
        }
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query(sql, function (err, rows) {
                if(err){
                    return callback(err);
                }
                connection.query(count, function (err1, total) {
                    connection.release();
                    callback(err1, rows, total[0].total);
                });
            });
        });
    }

    // 通过文章 id 更新一篇文章
    updateArticleById(articleId, callback) {
        var title = this.title,
            text = this.text,
            tag = this.tag,
            add_ad = this.addAd,
            status = this.status;

        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('update th_article set title=?,text=?,tag=?,add_ad=?,status=? where id=?', [title,text,tag,add_ad,status,articleId], function(err, rows) {
                connection.release();
                callback(err, rows);
            });
        });
    }

    // 通过用户 id 和文章 id 删除一篇文章
    delArticleById(articleId, callback) {
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('DELETE FROM th_article where id=?', [articleId], function(err, rows) {
                connection.release();
                callback(err, rows);
            });
        });
    }

    updateStatusById(articleId, callback){
        var status = this.status;
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('update th_article set status=? where id=?', [status, articleId], function(err, rows) {
                connection.release();
                callback(err, rows);
            });
        });
    }
    //发布
    release(articleId, callback){
        var status = this.status;
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('select text,tag from th_article where id=?', [articleId], function(err, rows) {
                if(err || rows.length < 1 ){
                    return callback(err||'rows.length=0');
                }
                let text = rows[0].text;
                let html = marked(text);
                let tagZh = rows[0].tag;
                let tagPy = '';
                if(tagZh){
                    let tagPinyin = pinyin(tagZh, {style: pinyin.STYLE_TONE2});
                    tagPy = tagPinyin.join('').toLowerCase();
                }
                connection.query('update th_article set html=?,status=?,tag_py=? where id=?', [html, status, tagPy, articleId], function(err, rows) {
                    connection.release();
                    callback(err, rows);
                });
            });
        });
    }
    //预览
    preview(articleId, callback){
        pool.getConnection(function (err, connection) {
            if(err){
                return callback(err);
            }
            connection.query('select title,text from th_article where id=?', [articleId], function(err, rows) {
                if(err || rows.length < 1 ){
                    return callback(err||'rows.length=0');
                }
                connection.release();
                callback(err, rows[0].title, marked(rows[0].text));
            });
        });
    }
}


module.exports = Article;