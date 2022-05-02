const { Client } = require("@googlemaps/google-maps-services-js");

module.exports = function (io, cluster) {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
    //{ lat: 45, lng: -110 }
    socket.on("selectGeo", (geo) => {
      client
        .placesNearby({
          params: {
            location: geo.location,
            key: process.env.GOOGLE_MAP_KEY,
            type: geo.type,
            radius: geo.radius,
          },
          timeout: 1000, // milliseconds
        })
        .then((r) => {
          // console.log(r.data.results);
          try {
            r.data.results.map((hotel) => {
              // console.log(hotel.geometry.location)
              client
                .reverseGeocode({
                  params: {
                    place_id: hotel.place_id,
                    key: process.env.GOOGLE_MAP_KEY,
                  },
                  timeout: 10000, // milliseconds
                })
                .then((result) => {
                  console.log(result.data.results);
                });
              // const query = `UPSERT INTO \`travel-sample\`.inventory.hotel (KEY, VALUE) VALUES('${
              //   hotel.place_id}', ${JSON.stringify(hotel)})`;

              //   // console.log(query)
              // return new Promise((resolve, rejects) => {
              //   try {
              //     // console.log(cluster)
              //     resolve(cluster.query(query));
              //   } catch (err) {
              //     rejects(err);
              //   }
              // });
            });
          } catch (err) {
            // res.status(500).send({ error: err });
            // io.emit.error
          }

          io.emit("getGeo", {
            data: r.data.results,
          });
          //res.send(r.data.results[0].elevation)
        })
        .catch((e) => {
          console.log(e);
          //res.send(e.response.data.error_message)
        });
    });

    socket.on("selectCity", (data) => {
      console.log(data);
      const query = `UPSERT INTO \`travel-sample\`.inventory.city (KEY, VALUE) VALUES('${
        data.place_id
      }', ${JSON.stringify(data)})`;

      // console.log(query)
      return new Promise((resolve, rejects) => {
        try {
          // console.log(cluster)
          resolve(cluster.query(query));
        } catch (err) {
          rejects(err);
        }
      });
    });
  });
};
