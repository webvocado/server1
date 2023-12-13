const express = require('express');
const app = express();
const { MongoClient, ObjectId } = require('mongodb')


app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true})) 


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

app.get('/list', async (요청, 응답) => {
  let result = await db.collection('post').find().toArray() 
  // 컬렉션의 document 전부 출력하는 법
  응답.render('list.ejs', { posts : result }) 
}) 

app.get('/write', (req, res) => {
    res.render('write.ejs')
})


app.post('/add', async (req, res) => {
  
  let a = req.body.title;
  let b = req.body.content;

  try {
    if(a == '' || b == '') { // 제목이 비어있으면 DB저장 X
      res.send('제목/콘텐츠 입력해야지!')
    } else {
    await db.collection('post').insertOne({title: a, content: b});
    res.redirect('/list');
    }
  } catch(e) {
    console.log(e); // 에러메세지 출력해줌
    res.status(500).send('서버 에러남')
  }
  // DB 오류 같은걸로 에러메시지가 뜰 수 있는데 이럴 때 try catch문 사용해보자.

}); 



// URL 파라미터 이용하기, 링크 누르면 상세페이지로 이동하기
// new ObjectId(req.params.id) 
app.get('/detail/:id', async (req, res) => {
  try {
    let result = await db.collection('post').findOne({ _id : new ObjectId(req.params.id)})
    if (result == null) {
      res.status(400).send('글이 존재하지 않습니다.')  
    } else {
      res.render('detail.ejs', { result : result })
    }
    
  } catch {
    res.send('주소를 잘못 입력했습니다.')
  }
  // try catch 문으로 예외처리 (다른 url을 쳤을 때!)
  // if문 사용하여 너무 긴 문자를 사용했을 때 null이 뜨면 오류 던지기
});
// findOne (하나의 document 조회하기)