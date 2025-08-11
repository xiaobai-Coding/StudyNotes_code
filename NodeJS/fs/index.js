const fs = require("fs");
const fsPromises = fs.promises;
// 1. 文件读取
// fs.readFile('./hello.tex', 'utf-8', (err, data)=>{
//     if(err){
//         console.log("err===>", err)
//     }else{
//         console.log("data===>", data)
//     }
// })
// 2. promise + async/await
// async function readFile(file) {
//   const data = await fs.readFile(file, "utf-8");
//   try {
//     console.log("data===>", data);
//   } catch (error) {
//     console.log("err===>", err);
//   }
// }
// readFile("./hello2.tex");

// 3. 文件写入
// fs.writeFile("hello.tex", "你好 NodeJS", (err) => {
//   if (err) {
//     console.log("写入失败：", err);
//   } else {
//     console.log("写入成功");
//   }
// });
// 4. promise + async/await 写入
async function writeFile() {
  try {
    await fsPromises.writeFile("hello2.tex", "nihao NodeJS");
    console.log("---写入成功----");
  } catch (error) {
    console.log("---写入失败----");
  }
}
writeFile()
