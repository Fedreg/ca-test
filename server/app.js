import Koa from 'koa'
import Router from 'Koa-router'
import Pug from 'js-koa-pug'
import fs from 'fs'
import path from 'path'

import * as funcs from './src/Utils/funcs'
import * as users from './src/Controllers/user-controller.js'

const koa = new Koa()
const app = new Router()

// Use Pug template to render views
app.use(Pug('server/src/Views'))

/*-------------------------------------
Routes
-------------------------------------*/

// id : Int
app.get('/server/user/:id', (ctx) => {
    let par = ctx.params
    users.getUser(par.id)
    .then((user) => {
        ctx.body = `name: ${user.name}\n sign: ${user.zodiac}\n id: ${user.id}`
    })
    .catch()
})

//read a file
app.get('/server/survey', async (ctx) => {
    let dir = path.join(__dirname, 'src/DB/index.json')
    let data = await funcs.readAndProcessData(dir, 'main')
    .then((result) => {
        ctx.body = `${JSON.stringify(result)}` 
    })
    .catch()        
})

app.get('/server/survey/1', async (ctx) => {
    let dir = path.join(__dirname, 'src/DB/survey_results/1.json')
    await funcs.readAndProcessData(dir, '1')
    .then((result) => {
        // processData.processSurvey1(result)
        ctx.body = `${JSON.stringify(result)}` 
    })
    .catch()        
})

app.get('/server/survey/2', async (ctx) => {
    let dir = path.join(__dirname, 'src/DB/survey_results/2.json')
    let data = await funcs.readAndProcessData(dir, '2')
    .then((result) => {
        ctx.body = `${JSON.stringify(result)}` 
    })
    .catch()        
})

// default route
app.get('/server/', async (ctx) => {
    ctx.render('home')
})

// 404
app.get('/server/*', async (ctx) => {
   ctx.render('404')
})

/*-------------------------------------
Logger
-------------------------------------*/

koa.use(async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})

koa.use(async function (ctx, next) {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms} ${ctx.status}`)
})

/*-------------------------------------
Init
-------------------------------------*/

koa.use(app.routes())

koa.listen(3500)
console.log("Koa listening on port 3500")
