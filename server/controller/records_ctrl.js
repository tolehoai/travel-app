const { Client } = require("@googlemaps/google-maps-services-js");

exports.addCity = async (req, res) => {
  try {
    const cluster = req.app.locals.cluster;
    const location = req.body;
    
    const query = `UPSERT INTO \`travel-sample\`.inventory.city (KEY, VALUE) VALUES('city_${
      location.place_id
    }', ${JSON.stringify(location)})`;
  
    const result = await cluster.query(query);
    res.json(result);
    
  } catch (err) {
    res.status(500).send({ error: err });
  }
};


exports.getHotelOfCity = async (req, res) => {
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
        },
        timeout: 5000, // milliseconds
      })
      .then( async (result) => {
        // store to db
        /*result.data.results.map((hotel) => {
          hotel.city = location.cityName;
          const query = `UPSERT INTO \`travel-sample\`.inventory.hotel (KEY, VALUE) VALUES('hotel_${
            hotel.place_id
          }', ${JSON.stringify(hotel)})`;
          try {
            cluster.query(query).then((result) => {
              
            });
          } catch (err) {
            res.status(500).send({ error: err });
          }
        });*/
        //todo Get photo of city
        const photoURL = await Promise.all(result.data.results.map(async (hotel) => {
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
        }))
        
        //todo add photo to result
        result.data.results.forEach((hotel, index) => {
          hotel.photoPath = photoURL[index];
        })
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
    res.status(500).send({ error: err });
  }

};


exports.getHotelInformation = async (req, res) => {
  try {
    const client = new Client({});
    const place_id = req.body.place_id;
    const cluster = req.app.locals.cluster;

    client
      .placeDetails({
        params: {
          place_id: place_id,
          key: process.env.GOOGLE_MAP_KEY,
        },
        timeout: 5000, // milliseconds
      })
      .then(async (detailsResult) => {
        if (detailsResult.data.result.photos) {
          const photoPath = await Promise.all(
            detailsResult.data.result.photos.map(async (photo) => {
              const photoResult = await client.placePhoto({
                params: {
                  maxheight: "500",
                  photo_reference: photo.photo_reference,
                  key: process.env.GOOGLE_MAP_KEY,
                },
                timeout: 5000, // milliseconds
              });

              return `https://lh3.googleusercontent.com${photoResult.request.path}`;
            })
          );
          detailsResult.data.photoUrl = photoPath;

          const query = `UPSERT INTO \`travel-sample\`.inventory.hotel_information (KEY, VALUE) VALUES('hotel_${
            place_id
          }', ${JSON.stringify(detailsResult)})`;
          await cluster.query(query);
          
          res.send(detailsResult.data)
        } else {
          res.send(detailsResult.data);
        }
      });
    //send to client
  } catch (err) {
    res.status(500).send({ error: err });
  }
};
