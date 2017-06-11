import Koa from 'koa'
import Router from 'Koa-router'
import Pug from 'js-koa-pug'
import fs from 'fs'
import path from 'path'
import send from 'koa-send'
import serve from 'koa-static'

import * as funcs from './server/Utils/funcs'

const koa = new Koa()
const app = new Router()

// Use Pug template to render views
app.use(Pug('server/Views'))

/*-------------------------------------
Routes
-------------------------------------*/

// Main survey result page
app.get('/server/survey', async (ctx) => {
    let dir = path.join(__dirname, 'server/DB/index.json')
    let data = await funcs.readAndProcessData(dir, 'main')
    .then((result) => {
        console.log("Riza", result)
        ctx.body = `${JSON.stringify(result)}`
    })
    .catch()        
})

// Survey 1
app.get('/server/survey/1', async (ctx) => {
    let dir = path.join(__dirname, 'server/DB/survey_results/1.json')
    await funcs.readAndProcessData(dir, '1')
    .then((result) => {
        ctx.body = `${JSON.stringify(result)}`
    })
    .catch()        
})

// Survey 2
app.get('/server/survey/2', async (ctx) => {
    let dir = path.join(__dirname, 'server/DB/survey_results/2.json')
    let data = await funcs.readAndProcessData(dir, '2')
    .then((result) => {
        ctx.body = `${JSON.stringify(result)}`
    })
    .catch()        
})

// 404
app.get('/server/*', async (ctx) => {
   ctx.render('404')
})

/*-------------------------------------
Send static assets
-------------------------------------*/
koa.use(serve('./client/static/'))

// koa.use(async (ctx, next) => {
//   if ('/' == ctx.path) 
//   await serve('./client/static/')
// //   await send(ctx, 'client/static/Main.html')
//   await next()
// })

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

koa.listen(3501)
console.log("Koa listening on port 3501")
