let http = require('http');
let path = require('path');
let fs = require('fs');
let context = require('./context');
let response = require('./response');
let request = require('./request');
let EventEmitter = require('events');
let Stream = require('stream');
class Koa extends EventEmitter{
    constructor(){
        supper();
        this.middleware;
        this.context = Object.create(context);
        this.response = Object.create(response);
        this.request = Object.create(request);
        this.middlewares = [];
    }
    use(fn){
        this.middlewares.push(fn);
    }
    createContext(req,res){
        let ctx = this.context;
        ctx.request = this.request;
        ctx.req = ctx.request.req = req;
        ctx.response = this.response;
        ctx.res = ctx.response = res;
        return ctx;
    }
    compose(middles,ctx){
        function dispatch(index){
            if(index === middles.length) return Promise.resolve();
            let middle = middles[index]
            return Promise.resolve(middle(ctx,()=>dispatch(index+1)));
        }
        return dispatch(0)
    }
    handleRequest(req,res){
        let ctx = this.createContext(req,res);
        res.statusCode = 404;
        let fn = this.compose(this.middlewares,ctx)
        fn.then(()=>{
            if(!ctx.body){
                res.end('Not Found');
            }else if(ctx.body instanceof Stream){
                res.setHeader('Content-Type','appliction/html;charset=utf-8')
            }else if(typeof ctx.body === 'object'){
                res.setHeader('Content-Type',"appliction/json;charset=utf-8");
                res.end(JSON.stringify(ctx.body))
            }else{
                res.end(ctx.body);
            }
        }).catch(err=>{
            this.emit('error',err);
        })
        res.end(ctx.body);
    }
    listen(...args){
       let server = http.createServer(this.handleRequest.bind(this))
       server.listen(...args);
    }
}
module.exports = Koa;