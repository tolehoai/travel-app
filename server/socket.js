const { Client } = require("@googlemaps/google-maps-services-js");
const client = new Client({});
module.exports = function (io, cluster) {
  io.on("connection", (socket) => {

    socket.on("disconnect", () => {
      
    });
    socket.on("selectGeo", (geo) => {
      let nearbyData = [];

      const roomID = JSON.stringify({ geo });

      if (roomID == socket.location) {
        socket.join(roomID);
      } else {
        socket.adapter.rooms.delete(socket.location);
        socket.join(roomID);
        socket.location = roomID;
      }

      client
        .placesNearby({
          params: {
            location: geo.location,
            key: process.env.GOOGLE_MAP_KEY,
            type: geo.type,
            radius: geo.radius,
            rank_by: "distance",
            // keyword: "khách sạn, hotel, nhà nghĩ, Khách Sạn",
          },
          timeout: 10000, // milliseconds
        })
        .then((r) => {
          try {
            r.data.results.map((hotel) => {
              nearbyData.push(hotel);
              client
                .reverseGeocode({
                  params: {
                    place_id: hotel.place_id,
                    key: process.env.GOOGLE_MAP_KEY,
                  },
                  timeout: 10000, // milliseconds
                })
                .then((result) => {
                  result.data.results.map((r, index) => {
                    nearbyData[index] = r;
                  });
                  
                });
            });
            io.to(socket.location).emit("getGeo", {
              data: nearbyData,
              room: socket.location,
            });
          } catch (err) {
            // res.status(500).send({ error: err });
            // io.emit.error
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });

  });
};
