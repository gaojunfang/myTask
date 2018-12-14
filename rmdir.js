let fs = require("fs");
let path = require("path")
// 异步
// function wideRmdir(p,callback){
//     let arr = [p];
//     let index = 0;
//     let current;
//     function next(){
//         current = arr[index++];
//         if(!current) {
//             console.log("开始删除",arr)
//             for(let i=arr.length-1;i>=0;i--){
//                 fs.stat(arr[i],function(err,statObj){
//                     if(statObj.isDirectory()){
//                         fs.rmdir(arr[i],callback)
//                     }else{
//                         fs.unlink(arr[i],callback);
//                     }
//                 })
//             }
//             return;
//         };
//         fs.stat(current,function(err,statObj){
//             console.log("statObj",statObj,current)
//             if(statObj.isDirectory()){
//                 fs.readdir(current,function(err,dirs){
//                     dirs = dirs.map(dir => path.join(current,dir));
//                     arr = [...arr,...dirs];
//                     console.log(arr);
//                     next();
//                 })
//             }else{
//                 next();
//             }
//         })
//     }
//     next();
// }

//promise
// function wideRmdir(p){
//     return new Promise((resolve,reject)=>{
//         let arr = [p];
//         let index = 0;
//         let current;
//         function next(){
//             current = arr[index++];
//             if(!current) {
//                 console.log("开始删除",arr)
//                 for(let i=arr.length-1;i>=0;i--){
//                     fs.stat(arr[i],function(err,statObj){
//                         if(statObj.isDirectory()){
//                             fs.rmdir(arr[i],resolve)
//                         }else{
//                             fs.unlink(arr[i],resolve);
//                         }
//                     })
//                 }
//                 return;
//             };
//             fs.stat(current,function(err,statObj){
//                 console.log("statObj",statObj,current)
//                 if(statObj.isDirectory()){
//                     fs.readdir(current,function(err,dirs){
//                         dirs = dirs.map(dir => path.join(current,dir));
//                         arr = [...arr,...dirs];
//                         console.log(arr);
//                         next();
//                     })
//                 }else{
//                     next();
//                 }
//             })
//         }
//         next();
//     })
// }

//async + await
let {promisify} = require("util");
let stat = promisify(fs.stat);
let readdir = promisify(fs.readdir);
let unlink = promisify(fs.unlink);
let rmdir = promisify(fs.rmdir);
async function wideRmdir(p){
    let arr = [p];
    let index = 0;
    let current;
    while(current = arr[index++]){
        let statObj = await stat(current)
        if(statObj.isDirectory()){
            let dirs = await readdir(current);
            dirs = dirs.map(dir => path.join(current,dir));
            arr = [...arr,...dirs]  
        }
    }
    for(let i = arr.length-1;i>=0;i--){
        let objStat =await stat(arr[i]);
        if(objStat.isDirectory()){
            await rmdir(arr[i])
        }else{
            await unlink(arr[i])
        }
    }
}
wideRmdir('a').then(data=>{
    console.log("删除成功")
}).catch((e)=>{
    console.log(e)
})