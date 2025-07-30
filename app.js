
const express = require('express');
const path = require('path');
const app = express();
const PORT = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const UsersDataFactory = require('./settings/UsersData'); // Імпортуємо функцію
const sequelize = require('./settings/config')
const UsersData = UsersDataFactory(sequelize);


app.use('/users', async (req, res, next) => {
    if (req.method === 'POST') {
        try {
            const users = await UsersData.findAll();
            req.body.id = users.length + 1;
            // console.log('bodyMiddle', req.body);

            return next()
        } catch (error) {
            res.status(500).json({ error: 'Не вдалося отримати користувачів', details: error.message });

        }
    }
    next()
});

app.post('/users', async (req, res) => {
    try {
        // console.log(req.body);

        const { id, email, pass } = req.body
        if (!email || !pass) {
            return res.status(400).json({ error: 'Email і пароль обов’язкові' });
        }
        const user = await UsersData.create({ id, email, pass });
        res.status(201).json(user);
    } catch (error) {
        console.log(error);

    }

});

app.put('/users', async (req, res) => {
    try {
        const { email, pass } = req.body;
        const user = await UsersData.findOne({ where: { pass } });
        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }

        await user.update({ email, pass });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати user', details: error.message });
    }
});

app.delete('/users', async (req, res) => {
    try {
        const { email, pass } = req.body;
        // console.log('method', req.method);

        const user = await UsersData.findOne({ where: { pass } });
        console.log(user);

        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }
        await user.destroy(pass);
        console.log(user);

        res.json({ message: 'Користувача видалено' });
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати user', details: error.message });
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await UsersData.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Не вдалося отримати користувачів', details: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {

        const user = await UsersData.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'user не знайдено' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Помилка сервера', details: error.message });
    }

});

app.get('/', (req, res) => {
    res.static('index.html', (err) => {
        console.log(err);
        return err
    })
})



app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})