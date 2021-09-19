const timers = {};
const length = 100;
const genColor = () =>
  `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
    Math.random() * 255
  )},${Math.floor(Math.random() * 255)})`;
module.exports = (io, socket) => {
  // обрабатываем запрос на получение сообщений
  const getMatrix = () => {
    let rowIdx = 0;
    let colIdx = 0;
    let counter = 0;
    const timer = setInterval(() => {
      if (counter >= 20) {
        clearInterval(timer);
      }
      rowIdx = Math.floor(Math.random() * 100);
      colIdx = Math.floor(Math.random() * 100);

      socket.emit("matrix:update", {
        position: [rowIdx, colIdx],
        backgroundColor: genColor(),
      });
    }, 100);
    timers[socket.roomId] = timer;
    socket.on("disconnect", () => {
      const timer = timers[socket.roomId];
      if (!!timer) {
        clearInterval(timer);
        timers[socket.roomId] = undefined;
      }
    });
    socket.emit("matrix:value", "rgb(255,255,255)");
  };

  // регистрируем обработчики
  socket.on("matrix:get", getMatrix);
};
