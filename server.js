const express = require('express');
const app = express();


const { MongoClient } = require('mongodb')

let db
const url = 'mongodb+srv://admin:qwer1234@webvoca.qv7a8aa.mongodb.net/?retryWrites=true&w=majority';
new MongoClient(url).connect().then((client)=>{
  console.log('DB연결성공')
  db = client.db('forum');
  app.listen(8080, () => {
    console.log('http://localhost:8080 에서 서버 실행중')
  })
}).catch((err)=>{
  console.log(err)
})



app.get('/', function(요청, 응답) {
  응답.sendFile(__dirname + '/index.html')
})

app.get('/news', (요청, 응답) => {
  db.collection('post').insertOne({title : '어쩌구'})
  // 응답.send('오늘 비옴')
})

app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray()
  응답.send(result[0].title)
}) // 컬렉션의 document 전부 출력하는 법


app.use(express.static(__dirname + '/public'));

