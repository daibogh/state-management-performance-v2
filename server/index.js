// создаем HTTP-сервер
const server = require("http").createServer();

// подключаем к серверу Socket.IO
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// получаем обработчики событий
const regisgterListHanlder = require("./handlers/list-handler");
const regisgterMatrixHanlder = require("./handlers/matrix-handler");

// данная функция выполняется при подключении каждого сокета (обычно, один клиент = один сокет)
const onConnection = (socket) => {
  // регистрируем обработчики
  // обратите внимание на передаваемые аргументы
  regisgterListHanlder(io, socket);
  regisgterMatrixHanlder(io, socket);
};

// обрабатываем подключение
io.on("connection", onConnection);

// запускаем сервер
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server ready. Port: ${PORT}`);
});
