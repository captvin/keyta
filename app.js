const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cron = require('node-cron');
const mysql = require('mysql');

const printAll = require('./star');

const app = express();
const port = 8080;

app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'keyta',
});

app.get('/star', (req, res) => {
    printAll(5)
    res.send('result muncul pada console')

});

app.get('/fib/:n', (req, res) => {
    let n = parseInt(req.params.n);
    const fibArray = [0, 1];
    for (let i = 2; i < n; i++) {
        fibArray.push(fibArray[i - 1] + fibArray[i - 2]);
    }
    res.send(fibArray)

});

app.get('/rev', (req, res) => {
    const revArr = []
    let arr = req.body.arr

    for (let i = arr.length - 1; i >= 0; i--) {
        revArr.push(arr[i]);
    }

    res.send(revArr)
})

app.get('/dup', (req, res) => {
    const dup = {};
    const arr = req.body.arr;

    arr.forEach((num) => {
        if (arr.indexOf(num) !== arr.lastIndexOf(num)) {
            dup[num] = (dup[num] || 0) + 1;
        }
    });

    if (Object.keys(dup).length === 0) {
        res.send('Tidak ada nilai yang duplikat');
    }
    else {
        Object.keys(dup).forEach((key) => {
            res.send(`${key} = ${dup[key]}`);
        });
    }
});

app.get('/find', (req, res) => {
    const arr = req.body.arr
    let small = arr[0]
    let large = arr[0]
    

    if (arr.length === 0) {
        return { smallest: undefined, largest: undefined };
    }

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < small) {
            small = arr[i];
        }
        if (arr[i] > large) {
            large = arr[i];
        }
    }

    res.send(`smallest number = ${small}  largest number = ${large}`)
});


app.post('/user', (req, res) => {
    const { firstName, lastName, birthday, location } = req.body;
    const insertQuery = 'INSERT INTO users (firstName, lastName, birthday, location) VALUES (?, ?, ?, ?);';
    const values = [firstName, lastName, birthday, location];

    db.query(insertQuery, values, (err, result) => {
        if (err) {
            console.error('Failed to save user data: ' + err.stack);
            res.status(500).json({ error: 'Failed to save user data' });
        } else {
            const user = { id: result.insertId, firstName, lastName, birthday, location };
            res.status(201).json(user);
        }
    });
});

app.delete('/user/:id', (req, res) => {
    const userId = req.params.id;
    const deleteQuery = 'DELETE FROM users WHERE id = ?;';
    db.query(deleteQuery, userId, (err, result) => {
        if (err) {
            console.error('Failed to delete user data: ' + err.stack);
            res.status(500).json({ error: 'Failed to delete user data' });
        } else {
            res.sendStatus(204);
        }
    });
});


app.put('/user/:id', (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, birthday, location } = req.body;
    const updateQuery = 'UPDATE users SET firstName=?, lastName=?, birthday=?, location=? WHERE id=?;';
    const values = [firstName, lastName, birthday, location, userId];
    db.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error('Failed to update user data: ' + err.stack);
            res.status(500).json({ error: 'Failed to update user data' });
        } else {
            const user = { id: userId, firstName, lastName, birthday, location };
            res.status(200).json(user);
        }
    });
});


cron.schedule('0 9 * * *', () => {
    const today = new Date().toISOString().slice(0, 10);
    const selectQuery = 'SELECT * FROM users WHERE DATE_FORMAT(birthday, "%m-%d") = DATE_FORMAT(?, "%m-%d");';
    db.query(selectQuery, today, (err, results) => {
        if (err) {
            console.error('Failed to fetch user data: ' + err.stack);
        } else {
            results.forEach((user) => {
                const fullName = `${user.firstName} ${user.lastName}`;
                const message = `Hey, ${fullName}, it's your birthday`;

                axios.post('https://hkdk.events/s9KeKx6WXzO7', { message })
                    .then(() => {
                        console.log(`Birthday message sent to ${fullName}`);
                    })
                    .catch((error) => {
                        console.error(`Failed to send birthday message to ${fullName}: ${error.message}`);
                    });
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
