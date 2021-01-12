const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 80;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userList = [
  {
    id: 1610362401806,
    login: "mango",
    email: "mango@mail.com",
    pass: "!Q2w3e4r5t",
    token: Date.now() * 2,
  },
];

function hidePassFromUserList() {
  return userList.map((user) => {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
    };
  });
}

app.post("/signup", (req, res) => {
  if (userList.find((user) => user.login === req.body.login)) {
    res.send({
      status: 409,
      message: "Логин уже занят!",
      data: null,
    });
    return;
  }
  if (userList.find((user) => user.email === req.body.email)) {
    res.send({
      status: 409,
      message: "email уже зарегистрирован!",
      data: null,
    });
    return;
  }
  const user = {
    id: Date.now(),
    login: req.body.login,
    email: req.body.email,
    pass: req.body.pass,
    token: Date.now() * 2,
  };
  userList.push(user);
  res.send({
    status: 200,
    message: "Регистрация прошла удачно!",
    data: user,
  });
});

app.post("/signin", (req, res) => {
  const user = userList.find((user) => user.email === req.body.email);
  if (!user) {
    res.send({
      status: 404,
      message: "email не найден!",
      data: null,
    });
    return;
  }
  if (!(user.pass === req.body.pass)) {
    res.send({
      status: 400,
      message: "Не верный пароль",
      data: null,
    });
    return;
  }
  user.token = Date.now() * 2;
  res.send({
    status: 200,
    message: "Вы авторизированы",
    data: user,
  });
});

app.get("/logined", (req, res) => {
  if (
    !userList.find((user) => user.token === Number(req.header("Authorization")))
  ) {
    res.send({
      status: 401,
      message: "Не авторизированный пользователь",
      data: null,
    });
    return;
  }
  res.send({
    status: 200,
    message: "Авторизированный пользователь",
    data: hidePassFromUserList(),
  });
});

app.delete("/logined", (req, res) => {
  userList.splice(userList.findIndex((user) => user.id === Number(req.body.id)), 1);
  res.send({
    status: 200,
    message: "Пользователь удален",
    data: hidePassFromUserList(),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
