const mysql = require('mysql2');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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



mysql 
const connection = mysql.createConnection({
    host: '203.234.62.198',
    user: 'ui_m',
    password: '011010',
    database: 'ui',
  });

connection.connect((err) => {
  if (err) {
      console.error('데이터베이스 연결 실패: ' + err.stack);
      return;
  }

  console.log('데이터베이스 연결 성공');
});

// 세션 설정
// app.use(
//     session({
//         secret: 'your-secret-key',
//         resave: false,
//         saveUninitialized: false
//     })
// );

//회원가입
app.post('/user/join', (req, res) => {
    try {
      console.log(req.body);
      const userId = req.body.UserId;
      const userPwd = req.body.UserPwd;
      const userEmail = req.body.UserEmail;
  
      const query = 'SELECT * FROM users WHERE u_id = ?';
      connection.query(query, [userId], (error, results) => {
        if (error) {
          console.error('아이디 중복 확인 실패:', error);
          res.json({
            'code': 500,
            'message': '서버 에러가 발생했습니다.'
          });
        } else {
          if (results.length > 0) {
            res.json({
              'code': 404,
              'message': '아이디 중복! 회원가입 실패'
            });
          } else {
            // 회원가입 처리 로직
            const sql = 'INSERT INTO users (u_id, password, email) VALUES (?, ?, ?)';
            const params = [userId, userPwd, userEmail];
            connection.query(sql, params, (error, results) => {
              if (error) {
                console.log(error);
                res.json({
                  'code': 500,
                  'message': '에러가 발생했습니다'
                });
              } else {
                res.json({
                  'code': 200,
                  'message': '회원가입에 성공했습니다.'
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


//로그인
app.post('/user/login', (req, res) => {
  try {
    
    const userId = req.body.UserId;
      
    const userPwd = req.body.UserPwd;


    const sql = 'SELECT * FROM ui.users WHERE u_id = ? AND password = ?';

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


//성장일지 메모
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

app.post('/user/delete', (req, res) => {
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
                    // 이미 데이터가 존재하는 경우, DELETE 실행
                    const deleteSql = 'DELETE from strawdata WHERE syear =?  AND smonth = ? AND sdate = ?';
                    const deleteParams = [sYear, sMonth, sDate];
    
                    connection.query(deleteSql, deleteParams, (updateErr, updateResult) => {
                        if (updateErr) {
                            console.log(updateErr);
                            res.json({
                                'code': 500,
                                'message': '서버 에러가 발생했습니다.'
                            });
                        } else {
                            res.json({
                                'code': 200,
                                'message': '모두 삭제하였습니다.'
                            });
                        }
                    });
                } else {
                    // 데이터가 없는 경우, 메세지 전송
                    res.json({
                        'code': 200,
                        'message': '데이터가 존재하지 않습니다.'
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
//이메일 수정
app.post('/user/changeE', (req, res) => {
    try {
        console.log(req.body);

        const userid = req.body.UserId;
        const email = req.body.UserEmail;
        const sql = 'UPDATE users SET email = ? where id = ?';

        connection.query(sql, [email,userid], (err, result) => {
            let resultCode = 404;
            let message = '에러가 발생했습니다';

            if (err) {
                console.log(err);
            } else {
                if (result.affectedRows > 0) {
                    resultCode = 200;
                    message = '이메일 수정 성공';
                }else {
                  resultCode = 204;
                  message = '조회 실패';
                }     
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


//비밀번호 수정
app.post('/user/changeP', (req, res) => {
    try {
        console.log(req.body);

        const userid = req.body.UserId;
        const userpw = req.body.UserPwd;
        const sql = 'UPDATE users SET password = ? where id = ?';

        connection.query(sql, [userpw,userid], (err, result) => {
            let resultCode = 404;
            let message = '에러가 발생했습니다';

            if (err) {
                console.log(err);
            } else {
                if (result.affectedRows > 0) {
                    resultCode = 200;
                    message = '비밀번호 수정 성공';
                }else {
                  resultCode = 204;
                  message = '조회 실패';
                }     
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


//중복확인
app.post('/user/checkId', (req, res) => {
    const userId = req.body.UserId;
  
    // 아이디 중복 확인
    const query = 'SELECT * FROM users WHERE u_id = ?';
    connection.query(query, [userId], (error, results) => {
      if (error) {
        console.error('아이디 중복 확인 실패:', error);
        res.status(500).json({
          'code': 500,
          'message': '서버 에러가 발생했습니다.'
        });
      } else {
        if (results.length > 0) {
          res.json({
            'code': 200,
            'message': '이미 사용 중인 아이디입니다.'
          });
        } else {
          res.json({
            'code': 200,
            'message': '사용 가능한 아이디입니다.'
          });
        }
      }
    });
  });


app.listen(3000, () => {
  console.log('서버가 http://localhost:3000/ 에서 실행 중입니다.');
});