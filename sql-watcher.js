const mysql = require("mysql2")
const fs = require("fs")
const dotenv = require("dotenv")
const path = require("path")
dotenv.config({path:path.join(__dirname , ".env")})

const client = mysql.createConnection({
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    multipleStatements:true,
    port:process.env.DATABASE_PORT
})

client.connect((err , args) => {
	console.log(`connected succesfully to sql server , err => ${err} args => ${args}`)
    const SqlScript = fs.readFileSync(path.join(__dirname , "sql.loadMe")).toString()
    let finalResult = SqlScript
    while(finalResult.includes(";;")){
        finalResult = finalResult.replace(";;" , ";")
    }
    console.log("START OF THE QUERY \n\n", finalResult , "\n\n END OF QUERY")
    client.query(finalResult , (err , result) => {
        let logString = ""
        console.log(`
            err => ${err?.toString()} 
        `)
        logString += `
err => ${err?.toString()} 
    `
        for(k in result){
            console.log(`
            result => ${JSON.stringify(result[k])}`)
            logString += `
result => ${result[k].map ? result[k].map(pot => JSON.stringify(pot)+"\n") : JSON.stringify(result[k])}\n`
        }
        fs.writeFileSync(path.join(__dirname , "sql.log") , logString)
        process.exit()
    })
})


