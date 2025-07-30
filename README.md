Users API

Users API — це RESTful API, побудований на Node.js, Express і Sequelize для управління користувачами в базі даних MySQL. Проєкт реалізує CRUD-операції (Create, Read, Update, Delete) для таблиці listUsers із полями id, email і pass, а також підтримує пошук користувача за паролем.

Примітка: Цей проєкт створений для навчальних цілей. У продакшені паролі обов’язково мають бути захешовані, а поле pass із VARCHAR(8) замінено на VARCHAR(255).

Зміст

Особливості
Технології
Встановлення
Налаштування бази даних
Запуск проєкту
API-ендпоінти
Тестування
Безпека
Внески
Ліцензія

Особливості

CRUD-операції: Створення, читання, оновлення та видалення користувачів.
Пошук за паролем: Ендпоінт для пошуку користувача за полем pass.
Валідація: Перевірка вхідних даних (обов’язкові поля email і pass).
Обробка помилок: Коректна обробка HTTP-статусів (400, 404, 500).
Логування: Логує всі запити для дебагінгу.

Технології

Node.js: Середа виконання JavaScript.
Express: Фреймворк для створення RESTful API.
Sequelize: ORM для роботи з MySQL.
MySQL: Реляційна база даних.
Nodemon: Інструмент для автоматичного перезапуску сервера під час розробки.

Встановлення

Клонуйте репозиторій:
git clone https://github.com/your-username/users-api.git
cd users-api


Встановіть залежності:
npm install

Залежності:

express@^5.1.0
sequelize@^6.37.7
mysql2@^3.14.2
nodemon@^3.1.10 (як devDependency)


Налаштуйте змінні середовища:Створіть файл .env у корені проєкту та додайте параметри для підключення до MySQL:
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=student_db



Налаштування бази даних

Створіть базу даних MySQL:
CREATE DATABASE student_db;


Створіть таблицю listUsers:
USE student_db;
CREATE TABLE listUsers (
  id INT NOT NULL AUTO_INCREMENT,
  email VARCHAR(40) NOT NULL UNIQUE,
  pass VARCHAR(8) NOT NULL,
  PRIMARY KEY (id)
);


(Опціонально) Використовуйте міграції Sequelize:
npx sequelize-cli init
npx sequelize-cli migration:generate --name create-list-users

У файлі міграції додайте:
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listUsers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true
      },
      pass: {
        type: Sequelize.STRING(8),
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('listUsers');
  }
};

Застосуйте міграцію:
npx sequelize-cli db:migrate



Запуск проєкту

Запустіть сервер:
npx nodemon app.js

Сервер запуститься на http://localhost:5000.

Перевірте підключення:У консолі має з’явитися:
Підключення до бази даних успішне!
Модель синхронізовано з таблицею listUsers
Сервер запущено на http://localhost:5000



API-ендпоінти



Метод
Ендпоінт
Опис
Тіло запиту (JSON)
Відповідь (успіх)



GET
/users
Отримати всіх користувачів
-
[{ id, email, pass }, ...]


GET
/users/:id
Отримати користувача за ID
-
{ id, email, pass }


GET
/users/pass/:pass
Отримати користувача за паролем
-
{ id, email, pass }


POST
/users
Створити нового користувача
{ "email": "test@example.com", "pass": "12345678" }
{ id, email, pass }


PUT
/users/:id
Оновити користувача за ID
{ "email": "new@example.com", "pass": "87654321" }
{ id, email, pass }


DELETE
/users/:id
Видалити користувача за ID
-
{ message: "Користувача успішно видалено" }


Приклади запитів

Створити користувача:
curl -X POST http://localhost:5000/users -H "Content-Type: application/json" -d '{"email":"test@example.com","pass":"12345678"}'


Отримати всіх користувачів:
curl http://localhost:5000/users


Отримати користувача за ID:
curl http://localhost:5000/users/1


Отримати користувача за паролем:
curl http://localhost:5000/users/pass/12345678


Оновити користувача:
curl -X PUT http://localhost:5000/users/1 -H "Content-Type: application/json" -d '{"email":"new@example.com","pass":"87654321"}'


Видалити користувача:
curl -X DELETE http://localhost:5000/users/1



Тестування

Перевірка бази даних:
USE student_db;
SELECT * FROM listUsers;


Тестування з фронтенду:Використовуйте HTML-файл для взаємодії з API:
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <title>Users API Client</title>
</head>
<body>
  <h1>Керування користувачами</h1>
  <input type="email" id="email" placeholder="Введіть email">
  <input type="text" id="pass" placeholder="Введіть пароль">
  <button id="btnPost">Створити</button>
  <button id="btnGetAll">Отримати всіх</button>
  <input type="number" id="userId" placeholder="Введіть ID">
  <button id="btnGetById">Отримати за ID</button>
  <button id="btnDelete">Видалити</button>

  <script>
    const email = document.getElementById('email');
    const pass = document.getElementById('pass');
    const userId = document.getElementById('userId');
    const btnPost = document.getElementById('btnPost');
    const btnGetAll = document.getElementById('btnGetAll');
    const btnGetById = document.getElementById('btnGetById');
    const btnDelete = document.getElementById('btnDelete');

    btnPost.addEventListener('click', async () => {
      const user = { email: email.value.trim(), pass: pass.value.trim() };
      if (!user.email || !user.pass) {
        console.error('Email і пароль обов’язкові');
        return;
      }
      try {
        const response = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(user)
        });
        if (!response.ok) throw new Error(`Помилка: ${response.status}`);
        const data = await response.json();
        console.log('Створено:', data);
      } catch (error) {
        console.error('Помилка:', error);
      }
    });

    btnGetAll.addEventListener('click', async () => {
      try {
        const response = await fetch('http://localhost:5000/users');
        if (!response.ok) throw new Error(`Помилка: ${response.status}`);
        const data = await response.json();
        console.log('Усі користувачі:', data);
      } catch (error) {
        console.error('Помилка:', error);
      }
    });

    btnGetById.addEventListener('click', async () => {
      const id = userId.value.trim();
      if (!id || isNaN(id)) {
        console.error('ID має бути числом');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`);
        if (!response.ok) throw new Error(`Помилка: ${response.status}`);
        const data = await response.json();
        console.log('Користувач:', data);
      } catch (error) {
        console.error('Помилка:', error);
      }
    });

    btnDelete.addEventListener('click', async () => {
      const id = userId.value.trim();
      if (!id || isNaN(id)) {
        console.error('ID має бути числом');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/users/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error(`Помилка: ${response.status}`);
        const data = await response.json();
        console.log('Результат:', data);
      } catch (error) {
        console.error('Помилка:', error);
      }
    });
  </script>
</body>
</html>


Використовуйте Postman для тестування API.


Безпека

Увага: Проєкт зберігає паролі у відкритому вигляді (VARCHAR(8)). Це неприпустимо для продакшену.


Рекомендація: Для хешування паролів установіть bcrypt:
npm install bcrypt

Оновіть модель UsersData.js:
const bcrypt = require('bcrypt');
module.exports = function (sequelize) {
  return sequelize.define('UsersData', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING(40),
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: false,
      set(value) {
        this.setDataValue('pass', bcrypt.hashSync(value, 10));
      }
    }
  }, {
    tableName: 'listUsers',
    timestamps: false
  });
};


Автентифікація:Замість пошуку за паролем (GET /users/pass/:pass) додайте ендпоінт для автентифікації:
app.post('/login', async (req, res) => {
  try {
    const { email, pass } = req.body;
    const user = await UsersData.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(pass, user.pass)) {
      return res.status(401).json({ error: 'Неправильний email або пароль' });
    }
    res.json({ message: 'Успішний вхід', user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Помилка сервера', details: error.message });
  }
});



Внески

Форкніть репозиторій.
Створіть нову гілку: git checkout -b feature/your-feature.
Зробіть зміни та закомітьте: git commit -m "Add your feature".
Запуште гілку: git push origin feature/your-feature.
Створіть Pull Request.

Ліцензія
Цей проєкт ліцензований під MIT License.
