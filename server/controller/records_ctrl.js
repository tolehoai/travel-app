const axios = require("axios");

const { Client } = require("@googlemaps/google-maps-services-js");

const e = require("express");

exports.getDestinations = async (req, res) => {
  const cluster = req.app.locals.cluster;

  const query = `SELECT DISTINCT airport.city as name
              FROM \`travel-sample\`.inventory.airport
              INNER JOIN \`travel-sample\`.inventory.hotel
              USE HASH(probe)
              ON hotel.city = airport.city
              WHERE airport.type = 'airport'
              AND hotel.type = 'hotel';`;
  try {
    const result = await cluster.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.findCityToGetDestinations = async (req, res) => {
  const cluster = req.app.locals.cluster;
  const city = req.body.city;

  try {
    const query = `UPSERT INTO \`travel-sample\`.inventory.hotel (KEY, VALUE) VALUES(\'hotel_${
      item.id
    }\', ${JSON.stringify(item)})`;
    return new Promise((resolve, rejects) => {
      try {
        resolve(cluster.query(query));
      } catch (err) {
        rejects(err);
      }
    });
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.getHotelByCity = async (req, res) => {
  const cluster = req.app.locals.cluster;

  const query = `SELECT DISTINCT *
        FROM \`travel-sample\`.inventory.hotel
        INNER JOIN \`travel-sample\`.inventory.airport
        USE HASH(probe)
        ON hotel.city = airport.city
        WHERE hotel.city = '${req.params.cityName}'
        LIMIT 5`;
  //OFFSET ${req.query.page * 5}`;

  try {
    const result = await cluster.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.getHotelsByIdOnCity = async (req, res) => {
  const cluster = req.app.locals.cluster;
  /*const query = `SELECT hotel.name, hotel.address, airport.name, airport.icao, hotel.geo
              FROM \`travel-sample\`.inventory.airport
              INNER JOIN \`travel-sample\`.inventory.hotel
                ON hotel.type = 'hotel' AND hotel.city = airport.city
              WHERE airport.type = 'airport'
                AND airport.city = '${req.params.id}'
              LIMIT 5;`;*/
  const query = `SELECT * FROM \`travel-sample\`.inventory.hotel WHERE hotel.id = ${req.params.id}`;
  try {
    const result = await cluster.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err });
  }
};

exports.getGeoBySelect = async (req, res) => {
  const cluster = req.app.locals.cluster;
  const location = JSON.stringify(req.body);
  console.log(location);
  const query = `UPSERT INTO \`travel-sample\` (KEY, VALUE) VALUES('trigger', ${location})`;

  try {
    const result = await cluster.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).send({ error: err });
  }
  exports.addHotel = async (req, res) => {
    const cluster = req.app.locals.cluster;
    const location = JSON.stringify(req.body);
    console.log(location);
    const query = `UPSERT INTO \`travel-sample\` (KEY, VALUE) VALUES('trigger', ${location})`;

    try {
      const result = await cluster.query(query);
      res.json(result);
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };
};
////////////////////////////////
// NEW
///////////////////////////////
exports.addCity = async (req, res) => {
  const cluster = req.app.locals.cluster;
  const location = req.body;
  console.log("cityInfo", location);
  const query = `UPSERT INTO \`travel-sample\`.inventory.city (KEY, VALUE) VALUES('city_${
    location.place_id
  }', ${JSON.stringify(location)})`;
  console.log(location);
  try {
    const result = await cluster.query(query);
    console.log("Them thanh pho thanh cong");
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: err });
  }
};

getPlaceNearbyWithNextPageToken = async (page_token) => {
  const client = new Client({});

  const result = await client.placesNearby({
    params: {
      key: "AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y",
      type: "lodging",
      radius: "5000",
      location: { lat: 10.045162, lng: 105.746857 },
      next_page_token: page_token,
    },
    timeout: 5000, // milliseconds
  });
  return result;
};

getPlaceNearby = () => {
  const client = new Client({});

  const result = client.placesNearby({
    params: {
      type: "lodging",
      radius: "5000",
      location: { lat: 10.045162, lng: 105.746857 },
      key: "AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y",
    },
    timeout: 5000, // milliseconds
  });

  // let location = "10.045162,105.746857";
  // let radius = "15000";
  // let type = "lodging";
  // let key = "AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y";
  // const result = await axios.get(
  //   // decodeURI(
  //   //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=10.045162%2C105.746857&radius=15000&type=lodging&key=AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y&pagetoken=${page_token}`
  //   // )

  //   decodeURI(
  //     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${key}&next_page_token=${page_token}`
  //   )
  // );

  return result;
};
exports.getHotelOfCity = async (req, res) => {
  try {
    const client = new Client({});
    const location = req.body;

    const cluster = req.app.locals.cluster;

    client
      .placesNearby({
        params: {
          // type: "lodging",
          type: "lodging",
          radius: location.radius,
          location: location.position,
          key: process.env.GOOGLE_MAP_KEY,
          keyword: "(Hotel) OR (khách sạn)",
          pagetoken: location.pageToken || "",
        },
        timeout: 5000, // milliseconds
      })
      .then(async (result) => {
        // store to db
        result.data.results.map((hotel) => {
          hotel.city = location.cityName;
          const query = `UPSERT INTO \`travel-sample\`.inventory.hotel (KEY, VALUE) VALUES('hotel_${
            hotel.place_id
          }', ${JSON.stringify(hotel)})`;
          try {
            cluster.query(query).then((result) => {});
          } catch (err) {
            res.status(500).send({ error: err });
          }
        });
        //todo Get photo of city
        const photoURL = await Promise.all(
          result.data.results.map(async (hotel) => {
            if (hotel.photos) {
              const photoPath = await Promise.all(
                hotel.photos.map(async (photo) => {
                  const respo = await client.placePhoto({
                    params: {
                      maxheight: "500",
                      photo_reference: photo.photo_reference,
                      key: process.env.GOOGLE_MAP_KEY,
                    },
                    timeout: 5000, // milliseconds
                  });

                  return `https://lh3.googleusercontent.com${respo.request.path}`;
                })
              );
              return photoPath;
            }
          })
        );

        //todo add photo to result
        result.data.results.forEach((hotel, index) => {
          hotel.photoPath = photoURL[index];
        });
        //send to client
        if (location.pageToken == undefined) {
          result.data.results.push({
            hasMore: false,
            pageToken: result.data.next_page_token,
          });
          res.send(result.data.results);
        } else {
          result.data.results.push({
            hasMore: true,
            pageToken: result.data.next_page_token,
          });
          res.send(result.data.results);
        }
      });
  } catch (err) {
    console.log(err);
  }
};
exports.getResortOfCity = async (req, res) => {
  try {
    const client = new Client({});
    const location = req.body;

    const cluster = req.app.locals.cluster;

    client
      .placesNearby({
        params: {
          type: "lodging",
          radius: location.radius,
          location: location.position,
          key: process.env.GOOGLE_MAP_KEY,
          pagetoken: location.pageToken || "",
          keyword: "(Homestay) OR (homestay)",
        },
        timeout: 5000, // milliseconds
      })
      .then(async (result) => {
        // store to db
        result.data.results.map((hotel) => {
          hotel.city = location.cityName;
          const query = `UPSERT INTO \`travel-sample\`.inventory.hotel (KEY, VALUE) VALUES('hotel_${
            hotel.place_id
          }', ${JSON.stringify(hotel)})`;
          try {
            cluster.query(query).then((result) => {});
          } catch (err) {
            res.status(500).send({ error: err });
          }
        });
        //todo Get photo of city
        const photoURL = await Promise.all(
          result.data.results.map(async (hotel) => {
            if (hotel.photos) {
              const photoPath = await Promise.all(
                hotel.photos.map(async (photo) => {
                  const respo = await client.placePhoto({
                    params: {
                      maxheight: "500",
                      photo_reference: photo.photo_reference,
                      key: process.env.GOOGLE_MAP_KEY,
                    },
                    timeout: 5000, // milliseconds
                  });

                  return `https://lh3.googleusercontent.com${respo.request.path}`;
                })
              );
              return photoPath;
            }
          })
        );

        //todo add photo to result
        result.data.results.forEach((hotel, index) => {
          hotel.photoPath = photoURL[index];
        });
        //send to client
        if (location.pageToken == undefined) {
          result.data.results.push({
            hasMore: false,
            pageToken: result.data.next_page_token,
          });
          res.send(result.data.results);
        } else {
          result.data.results.push({
            hasMore: true,
            pageToken: result.data.next_page_token,
          });
          res.send(result.data.results);
        }
      });
  } catch (err) {
    console.log(err);
  }
};

getPlaceNearby = () => {
  const client = new Client({});

  const result = client.placesNearby({
    params: {
      type: "lodging",
      radius: "5000",
      location: { lat: 10.045162, lng: 105.746857 },
      key: "AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y",
    },
    timeout: 5000, // milliseconds
  });

  // let location = "10.045162,105.746857";
  // let radius = "15000";
  // let type = "lodging";
  // let key = "AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y";
  // const result = await axios.get(
  //   // decodeURI(
  //   //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=10.045162%2C105.746857&radius=15000&type=lodging&key=AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y&pagetoken=${page_token}`
  //   // )

  //   decodeURI(
  //     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${key}&next_page_token=${page_token}`
  //   )
  // );

  return result;
};
exports.getHotelInfomation = async (req, res) => {
  try {
    const client = new Client({});
    const place_id = req.body.place_id;
    console.log(place_id);
    const cluster = req.app.locals.cluster;

    client
      .placeDetails({
        params: {
          place_id: place_id,
          key: "AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y",
        },
        timeout: 5000, // milliseconds
      })
      .then(async (result) => {
        if (result.data.result.photos) {
          const photoPath = await Promise.all(
            result.data.result.photos.map(async (photo) => {
              const respo = await client.placePhoto({
                params: {
                  maxheight: "500",
                  photo_reference: photo.photo_reference,
                  key: "AIzaSyBsJdSZuOsUdmDm-VXjEWf_D_aU6gZWb5Y",
                },
                timeout: 5000, // milliseconds
              });

              return `https://lh3.googleusercontent.com${respo.request.path}`;
            })
          );
          result.data.photoUrl = photoPath;
          const query = `UPSERT INTO \`travel-sample\`.inventory.hotel_information (KEY, VALUE) VALUES('hotel_${place_id}', ${JSON.stringify(
            result.data
          )})`;
          await cluster.query(query);

          res.send(result.data);
        } else {
          res.send(result.data);
        }
      });
  } catch (err) {
    console.log(err);
  }
};
