import fs from 'fs'

// fs.readFile('./path/index.js', 'utf-8',(err, filedata)=>{
//     if(!err){
//         console.log('======callback read...======')
//         console.log(filedata)
//     }
// })

// 异步读取
// fs.promises.readFile('./path/index.js', 'utf-8').then(res=>{
//     console.log('=====promises read=====')
//     console.log(res)
// })

// fs.writeFile('./newTest.js', 'hello newTest!')

// 文件信息
// const fileInfo = fs.statfs('./index.js')
// console.log('fileInfo===>', fileInfo)

// 追加输出
// fs.appendFileSync('index.js', 'console.log("hello word2!")')

// 目录操作
const files = fs.readdirSync('path')
console.log(files)

fs.mkdirSync('test-dir/a/b/c/d', {recursive: true})