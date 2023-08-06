//소재헌

const mysql = require('mysql2');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require('express-session');

// //test
// app.post('/user/login', (req, res) => {
//     try {
//         console.log(req.body);
        
//     } catch (error) {
//         console.error('에러가 발생했습니다:', error);
//         res.json({
//             'code': 500,
//             'message': '서버 에러가 발생했습니다.'
//         });
//     }
//   });

/*
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1201',
  database: 'sogong',
});
*/

mysql 
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '2049',
    database: 'ui_ms',
  });

connection.connect((err) => {
  if (err) {
      console.error('데이터베이스 연결 실패: ' + err.stack);
      return;
  }

  console.log('데이터베이스 연결 성공');
});

// 세션 설정
app.use(
    session({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false
    })
);

//회원가입
app.post('/user/join', (req, res) => {
  try {
      console.log(req.body);
      const userId = req.body.UserId;
      const userPwd = req.body.UserPwd;
      const userEmail = req.body.UserEmail;

      const sql = 'INSERT INTO users (id, password, email) VALUES (?, ?, ?)';
      const params = [userId, userPwd, userEmail];

      connection.query(sql, params, (err, result) => {
          let resultCode = 404;
          let message = '에러가 발생했습니다';
          

          if (err) {
              console.log(err);
              
          } else {
              resultCode = 200;
              message = '회원가입에 성공했습니다.';
              
          }

          res.json({
              'code': resultCode,
              'message': message,
          });
      });
  } catch (error) {
      console.error('에러가 발생했습니다:', error);
      res.json({
          'code': 500,
          'message': '서버 에러가 발생했습니다.'
      });
  }
});

//로그인
app.post('/user/login', (req, res) => {
  try {
    
    const userId = req.body.UserId;
      
    const userPwd = req.body.UserPwd;


    const sql = 'SELECT * FROM ui_ms.users WHERE id = ? AND password = ?';

    connection.query(sql, [userId,userPwd], (err, result) => {
        let resultCode = 404;
        let message = '에러가 발생했습니다';
        console.log(userId);
        console.log(userPwd);

        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                resultCode = 200;
                req.session.users = {
                id: result[0].id,
            };
                message = '로그인 성공! ' + result[0].id + '님 환영합니다!';
            }else {
            resultCode = 204;
            message = '로그인 실패!';
            }     
        }

        res.json({
            'code': resultCode,
            'message': message
        });
    });
  } catch (error) {
      console.error('에러가 발생했습니다:', error);
      res.json({
          'code': 500,
          'message': '서버 에러가 발생했습니다.'
      });
  }
});

//딸기 데이터
app.post('/user/st', (req, res) => {
    try {
        console.log(req.body);
        const year = req.body.sYear;
        const month = req.body.sMonth;
        const date = req.body.sDate;
        const sql = 'SELECT * FROM strawdata WHERE syear = ? AND smonth = ? AND sdate = ?';
    
        connection.query(sql, [year,month,date], (err, result) => {
            console.log(year + ',' + month + ',' + date);
            let resultCode = 404;
            let message = '에러가 발생했습니다';
            let sText;
            let sinput1;
            let sinput2;
            let sinput3;
            if (err) {
                console.log(err);
            } else {
                if (result.length > 0) {
                    resultCode = 200;
                    sText = result[0].stext;
                    sinput1 = result[0].sinput1;
                    sinput2 = result[0].sinput2;
                    sinput3 = result[0].sinput3;
                    message = '조회 성공';
                    console.log(sinput1 + ',' + sinput2 + ',' + sinput3 + ',' + sText);
                }else {
                  resultCode = 204;
                  message = '조회 실패';
                }     
            }
  
            res.json({
                'code': resultCode,
                'message': message,
                'sText': sText,
                'sinput1': sinput1,
                'sinput2': sinput2,
                'sinput3': sinput3
            });
        });
    } catch (error) {
        console.error('에러가 발생했습니다:', error);
        res.json({
            'code': 500,
            'message': '서버 에러가 발생했습니다.'
        });
    }
  });

  /*
  app.post('/user/memo', (req, res) => {
    try {
        console.log(req.body);
        const sYear = req.body.sYear;
        const sMonth = req.body.sMonth;
        const sDate = req.body.sDate;
        const stext = req.body.sText;
        const sinput1 = req.body.sinput1;
        const sinput2 = req.body.sinput2;
        const sinput3 = req.body.sinput3;

        const sql = 'INSERT INTO strawdata (syear, smonth, sdate, sinput1, sinput2, sinput3, stext) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const params = [sYear, sMonth, sDate, sinput1, sinput2, sinput3, stext];
  
        connection.query(sql, params, (err, result) => {
            let resultCode = 404;
            let message = '에러가 발생했습니다';
  
            if (err) {
                console.log(err);
            } else {
                resultCode = 200;
                message = '저장에 성공했습니다.';
            }
  
            res.json({
                'code': resultCode,
                'message': message,
            });
        });
    } catch (error) {
        console.error('에러가 발생했습니다:', error);
        res.json({
            'code': 500,
            'message': '서버 에러가 발생했습니다.'
        });
    }
  });
  */

app.post('/user/memo', (req, res) => {
try {
    console.log(req.body);
    const sYear = req.body.sYear;
    const sMonth = req.body.sMonth;
    const sDate = req.body.sDate;
    const stext = req.body.sText;
    const sinput1 = req.body.sinput1;
    const sinput2 = req.body.sinput2;
    const sinput3 = req.body.sinput3;

    const selectSql = 'SELECT COUNT(*) AS count FROM strawdata WHERE syear = ? AND smonth = ? AND sdate = ?';
    const selectParams = [sYear, sMonth, sDate];

    connection.query(selectSql, selectParams, (selectErr, selectResult) => {
        if (selectErr) {
            console.log(selectErr);
            res.json({
                'code': 500,
                'message': '서버 에러가 발생했습니다.'
            });
        } else {
            const count = selectResult[0].count;
            if (count > 0) {
                // 이미 데이터가 존재하는 경우, UPDATE 쿼리 실행
                const updateSql = 'UPDATE strawdata SET sinput1 = ?, sinput2 = ?, sinput3 = ?, stext = ? WHERE syear = ? AND smonth = ? AND sdate = ?';
                const updateParams = [sinput1, sinput2, sinput3, stext, sYear, sMonth, sDate];

                connection.query(updateSql, updateParams, (updateErr, updateResult) => {
                    if (updateErr) {
                        console.log(updateErr);
                        res.json({
                            'code': 500,
                            'message': '서버 에러가 발생했습니다.'
                        });
                    } else {
                        res.json({
                            'code': 200,
                            'message': '수정에 성공했습니다.'
                        });
                    }
                });
            } else {
                // 데이터가 없는 경우, INSERT 쿼리 실행
                const insertSql = 'INSERT INTO strawdata (syear, smonth, sdate, sinput1, sinput2, sinput3, stext) VALUES (?, ?, ?, ?, ?, ?, ?)';
                const insertParams = [sYear, sMonth, sDate, sinput1, sinput2, sinput3, stext];

                connection.query(insertSql, insertParams, (insertErr, insertResult) => {
                    if (insertErr) {
                        console.log(insertErr);
                        res.json({
                            'code': 500,
                            'message': '서버 에러가 발생했습니다.'
                        });
                    } else {
                        res.json({
                            'code': 200,
                            'message': '저장에 성공했습니다.'
                        });
                    }
                });
            }
        }
    });
} catch (error) {
    console.error('에러가 발생했습니다:', error);
    res.json({
        'code': 500,
        'message': '서버 에러가 발생했습니다.'
    });
}
});

app.listen(3000, () => {
  console.log('서버가 http://localhost:3000/ 에서 실행 중입니다.');
});