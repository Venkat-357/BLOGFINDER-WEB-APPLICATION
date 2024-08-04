import mysql from 'mysql2'

export const pool= mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'VENKAT',
    database: 'blogapp',
    connectionLimit: 10
}).promise()


export async function login(username,password){

    const [result]=await pool.query(`select * from users where username=? and password=?`,[username,password]) //prepared statments
    
    console.log(result)

    if(result.length>0){
        return true
    }
    else{
        return false
    }

}

export async function register(username,password){

    const [result]=await pool.query(`insert into users values(?,?)`,[username,password]) //prepared statments
    
    return true

}

export async function addblog(newBlog){

    if(newBlog.link==""){
        const [result] = await pool.query(`insert into blogs(name,content,link,author) values(?,?,?,?)`,[newBlog.name,newBlog.content,"nolink",newBlog.author])
    }
    else{
        const [result] = await pool.query(`insert into blogs(name,content,link,author) values(?,?,?,?)`,[newBlog.name,newBlog.content,newBlog.link,newBlog.author])
    }

    console.log("blog added"+newBlog.name)

    return true

}

export async function deleteblog(blogid){

    const [result] = await pool.query(`delete from blogs where id=?`,[blogid])

    return true

}

export async function getblogs(){

    const [result] = await pool.query(`select * from blogs`)

    return result

}

export async function getblogid(id){

    const [result] = await pool.query(`select * from blogs where id=?`,[id])

    return result

}

