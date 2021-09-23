const { clearInterval } = require("timers");
const timers = {};
module.exports = (io, socket) => {
  // обрабатываем запрос на получение сообщений
  const getList = (size) => {
    const lst = new Array(size).fill(0);
    let idx = 0;
    let counter = 0;
    const ITERATIONS_COUNT = 100;
    const timer = setInterval(() => {
      if (counter >= ITERATIONS_COUNT) {
        clearInterval(timer);
        socket.disconnect();
        return;
      }
      counter++;
      const rndIndex = idx % lst.length;
      idx++;
      socket.emit("list:update", [rndIndex]);
    }, 100);
    timers[socket.roomId] = timer;
    socket.on("disconnect", () => {
      const timer = timers[socket.roomId];
      if (!!timer) {
        clearInterval(timer);
        timers[socket.roomId] = undefined;
      }
    });
    socket.emit("list:value", lst);
  };

  // регистрируем обработчики
  socket.on("list:get", getList);
};
