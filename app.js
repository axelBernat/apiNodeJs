const express = require('express')
const morgan = require('morgan')('dev')
const bodyParser = require('body-parser')

const {
    success,
    error,
    checkAndChange
} = require('./assets/functions')
const config = require('./assets/config')

const mysql = require('promise-mysql')
mysql.createConnection({
    host: config.db.host,
    database: config.db.database,
    port: config.db.port || process.env.PORT,
    user: config.db.user,
    password: config.db.password
}).then((db) => {
    console.log('Connected to database on port: ' + config.db.port);

    const app = express()

    let MembersRouter = express.Router()
    //Morgan est un middleware qui debug en console a chaque requete (status,code header,url...)
    let Members = require('./assets/classes/members-class')(db, config)
    app.use(morgan)
    //pour utiliser le req.body dans les requetes POST 
    app.use(bodyParser.json()) // for parsing application/json
    app.use(bodyParser.urlencoded({
        extended: true
    })) // for parsing application/x-www-form-urlencoded




    MembersRouter.route('/')



        // route qui recupere tout les membres
        .get(async (req, res) => {
            let allMembers = await Members.getAll(req.query.max)
            res.json(checkAndChange(allMembers))
        })

        .post(async(req, res) => {
            let add = await Members.addMember(req.body.name)
            res.json(checkAndChange(add))
        })

    MembersRouter.route('/:id')

        // route qui recupere un membre
        .get(async (req, res) => {
            let member = await Members.getById(req.params.id)
            res.json(checkAndChange(member))
        })

        .put( async(req, res) => {
            let updateMember = await Members.update(req.params.id,req.body.name)
            res.json(checkAndChange(updateMember))
        })

        .delete(async (req, res) => {
            let deleted = await Members.deleteMember(req.params.id)
            res.json(checkAndChange(deleted))
        })

    app.use(config.rootAPI + 'members', MembersRouter)

    app.listen(config.port, () => {
        console.log('Back Express started on port ' + config.port);
    })
}).catch((err) => {
    console.log('Error during database connection')
    console.log(err.message);
})

