//MODULES
const bodyParser = require('body-parser')
const express = require('express')
const morgan = require('morgan')('dev')
const twig = require('twig')
const axios = require('axios')
const { response } = require('express')

//VARIABLES GLOBALES
const app = express()
const port = 8081 || process.env.PORT
const fetch = axios.create( {
    baseURL: 'http://localhost:8080/api/v1' //url api
})
//MIDDLEWARES

app.use(morgan)
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended: true})) 

//ROUTES

//PAGE ACCUEIL
app.get('/',(req,res) => {
    res.redirect('/members')
})

//PAGE RECUPERANT TOUS LES MEMBRES OU LIMIT
app.get('/members',(req,res) => { //url front
    apiCall(req.query.max ? '/members?max=' + req.query.max : '/members', 'get', {}, res, (result) => {
        res.render('members.twig', {
            members: result
        })
    })
})
//PAGE RECUPERANT 1 MEMBRE
app.get('/members/:id',(req,res) => {
    apiCall('/members/' + req.params.id, 'get', {}, res, (result) => {
        res.render('member.twig', {
            member: result
        })
    })
})

//PAGE GERANT LA MODIFICATION D'UN MEMBRE 
app.get('/edit/:id',(req,res)=> {
    apiCall('/members/' +req.params.id,'get',{}, res, (result) => {
        res.render('edit.twig', {
            member: result
        })
    })
})

//SOUMISSION FORMULAIRE POST 
app.post('/edit/:id',(req,res) => {
    apiCall('/members/'+req.params.id,'put',{
        name: req.body.name
    },res, () => {
        res.redirect('/members')
    })
})


//SUPPRESSION D'UN MEMBRE 

app.post('/delete',(req,res) => {
    apiCall('/members/' + req.body.id,'delete',{},res,() => {
        res.redirect('/members')
    })
})

// PAGE AJOUT D'UN MEMBRE
app.get('/insert',(req,res) => {
        res.render('insert.twig')
})

// METHODE AJOUT D'UN MEMBRE

app.post('/insert',(req,res) => {
        apiCall('/members', 'post', {name:req.body.name}, res, () => {
            res.redirect('/members')
        })
})
//LANCEMENT APP
app.listen(port,() => console.log('Front app Started on port '+ port))

//FUNCTIONS

renderError = (res,errMsg) => {
    res.render('error.twig', {
        errorMsg: errMsg
    })
}

function apiCall (url,method,data,res,next) {
    fetch({
        method: method,
        url: url,
        data: data
    }).then((response) => {
            if (response.data.status == 'success') {
                next(response.data.result)
            } else {
                renderError(res, response.data.message)
            }
        })
    .catch((err) => renderError(res, err.message))
}