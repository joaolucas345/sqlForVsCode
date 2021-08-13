const mysql = require("mariadb")
const fs = require("fs")
const dotenv = require("dotenv")
const path = require("path")
dotenv.config({path:path.join(__dirname , ".env")})

const clients = mysql.createPool({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    multipleStatements:true,
    port:3307
})

let first = true


clients.getConnection().then((client) => {
	if(first){
        first = false
    const SqlScript = fs.readFileSync(path.join(__dirname , "sql.loadMe")).toString()
    let finalResult = SqlScript
    while(finalResult.includes(";;")){
        finalResult = finalResult.replace(";;" , ";")
    }
    console.log("START OF THE QUERY \n\n", finalResult , "\n\n END OF QUERY")
    client.query(finalResult).then((result , err) => {
        let logString = ""
        console.log(`
            err => ${err?.toString()} 
        `)
        logString += `
err => ${err?.map(e => console.log(e , "<= hey"))} 
    `
        for(k in result){
            console.log(`
            result => ${JSON.stringify(result[k])}`)
            logString += `
result => ${result[k].map ? result[k].map(pot => JSON.stringify(pot)+"\n") : JSON.stringify(result[k])}\n`
        }
        fs.writeFileSync(path.join(__dirname , "sql.log") , logString)
        process.exit()
    })}
    })



