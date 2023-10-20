// Our Dependecies
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

// Let us run the server. So its running
app.listen(3002, () => {
    console.log('Server is running on port 3002');
});

// Let us create our database (mysql)
const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '', //If you have set xampp password please enter it here
    database: 'plantdb',
})

// let us now create a route to the server that will register a user

app.post('/register', (req, res) => {
    const sentEmail = req.body.Email;
    const sentUserName = req.body.UserName;
    const sentPassword = req.body.Password;

    // Check if the email already exists in the database
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailQuery, [sentEmail], (err, results) => {
        if (err) {
            res.status(500).send({ message: 'Error checking email' });
        } else if (results.length > 0) {
            // Email already exists, return an error message
            res.send({ message: 'Email already exists in the database.' });
        } else {
            // Email is not in the database, proceed with user registration
            bcrypt.hash(sentPassword, 10, (err, hashedPassword) => {
                if (err) {
                    res.status(500).send({ message: 'Error hashing password' });
                } else {
                    // Insert the user into the database
                    const insertUserQuery = 'INSERT INTO users (email, username, password) VALUES (?,?,?)';
                    const values = [sentEmail, sentUserName, hashedPassword];
                    db.query(insertUserQuery, values, (err, results) => {
                        if (err) {
                            res.status(500).send({ message: 'Error inserting user' });
                        } else {
                            console.log('User inserted successfully!');
                            res.send({ message: 'User added!' });
                        }
                    });
                }
            });
        }
    });
});



app.post('/login', (req, res) => {
    const sentloginUserName = req.body.LoginUserName
    const sentLoginPassword = req.body.LoginPassword

    // Lets create SQL statement to insert the user to the Database table Users
    const SQL = 'SELECT * FROM users WHERE username = ? && password = ?'
    const Values = [sentloginUserName, sentLoginPassword]

        // Query to execute the sql statement stated above
        db.query(SQL, Values, (err, results) => {
            if(err) {
                res.send({error: err})
            }
            if(results.length > 0) {
                res.send(results)
            }
            else{
                res.send({message: `Credentials Don't match!`})
            }
        })
})