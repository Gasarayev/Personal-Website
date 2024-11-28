module.exports = function (io) {
  let clicks = {};
  let gameActive = false;
  let gameDuration = 30000;

  io.on("connection", (socket) => {
    console.log("Bir istifadəçi qoşuldu:", socket.id);

    socket.on("startGame", () => {
      if (!gameActive) {
        gameActive = true;
        clicks = {}; 
        io.emit("gameStarted");

        let startTime = Date.now();

        let countdownInterval = setInterval(() => {
          let timeLeft = gameDuration - (Date.now() - startTime);

          if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            gameActive = false;
            let winner = getWinner();
            io.emit("gameEnded", winner);
          } else {
            io.emit("timeUpdate", Math.ceil(timeLeft / 1000)); 
          }
        }, 1000);
      }
    });

    socket.on("click", () => {
      if (gameActive) {
        if (!clicks[socket.id]) clicks[socket.id] = 0;
        clicks[socket.id]++;
        io.emit("clickUpdate", clicks);
      }
    });

    socket.on("disconnect", () => {
      console.log("Bir istifadəçi ayrıldı:", socket.id);
      delete clicks[socket.id];
    });
  });

  function getWinner() {
    let maxClicks = 0;
    let winnerId = null;
    for (let id in clicks) {
      if (clicks[id] > maxClicks) {
        maxClicks = clicks[id];
        winnerId = id;
      }
    }
    return { winnerId, maxClicks };
  }
};
