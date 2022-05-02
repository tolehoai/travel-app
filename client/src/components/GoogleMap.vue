<template>
  <div class="map">
    <div class="header">
      <img src="../assets/images/header-poi.png" alt="bg" class="headerImg" />
      <h1 class="app-title">Google Map - Point of Interest</h1>
      <h5 class="titleDesc">
        Sử dụng TravelPOI, bạn có thể truy cập địa điểm yêu thích chính xác,
        mang lại bối cảnh không gian đáng tin cậy trên các vị trí trong thế giới
        thực bằng cách hiển thị các nhà hàng, cửa hàng, trường học và hơn thế
        nữa.
      </h5>

      <vue-google-autocomplete
        id="map"
        classname="form-control"
        placeholder="Nhập vào thành phố muốn tìm kiếm khách sạn..."
        v-on:placechanged="getAddressData"
        types="(cities)"
        class="search"
      >
      </vue-google-autocomplete>
      <!-- <b-form-input :type="type" class="search"> </b-form-input> -->
      <b-button variant="success" class="searchBtn">Khám phá ngay</b-button>
    </div>

    <button @click="clickButton()">Dispatch</button>
    <button @click="chiduong()">Click</button>
    <button @click="getHotelOfCity()">Get Hotel</button>

    <!-- <GmapAutocomplete @place_changed="setPlace" class="form-control" /> -->

    <span>Chọn thành phố</span>

    <span>Chọn loại địa điểm</span>
    <b-table
      striped
      hover
      :items="hotelList"
      :fields="fields"
      sticky-header="1000px"
      class="hotelTable"
      @row-clicked="hotelClickHandler"
    ></b-table>

    <b-button v-if="loadMore" variant="outline-primary" @click="callMoreHotel()"
      >Load more hotel
    </b-button>
    <p v-if="!loadMap">Loading map...</p>
    <GmapMap
      ref="mapRef"
      v-if="loadMap"
      :center="{ lat: this.position.lat, lng: this.position.lng }"
      :zoom="16"
      map-type-id="hybrid"
      style="width: 99vw; height: 550px"
    >
      <DirectionsRenderer
        travelMode="DRIVING"
        :origin="position"
        :destination="endLocation"
      />
      <GmapMarker
        :key="this.position.lng"
        :position="this.position"
        :clickable="true"
        :draggable="true"
        @click="center = this.position"
      />
      <GmapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m"
        @click="directions(m)"
      />
    </GmapMap>
  </div>
</template>

<script>
import axios from "axios";
import DirectionsRenderer from "./DirectionsRenderer";
import VueGoogleAutocomplete from "vue-google-autocomplete";
export default {
  name: "GoogleMap",
  components: { DirectionsRenderer, VueGoogleAutocomplete },
  props: {
    msg: String,
  },
  data() {
    return {
      loadMore: false,
      fields: [
        // A column that needs custom formatting
        { key: "name", label: "Hotel Name" },
        { key: "rating", label: "Rating" },
        { key: "vicinity", label: "Address" },
      ],

      hotelList: [],
      // fields: [
      //   { key: "name", sortable: false },
      //   { key: "rating", sortable: false },
      //   { key: "vicinity", sortable: false },
      // ],
      endLocation: null,
      markers: [],
      typeOfPlace: "",
      loadMap: false,
      location: null,
      gettingLocation: false,
      errorStr: null,
      position: {
        lat: 0,
        lng: 0,
      },
      cityInfo: [],
      cityPosition: null,
      cityName: null,
      pageToken: "",
    };
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    getGeo: function (data) {
      console.log("Hotel data from Socket: ", data);
    },
  },
  methods: {
    hotelClickHandler(record, index) {
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      console.log(record, index); // This will be the item data for the row
      this.position.lat = record.geometry.location.lat;
      this.position.lng = record.geometry.location.lng;
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.panTo({ lat: this.position.lat, lng: this.position.lng });
      });
    },
    getHotelOfCity: function () {
      axios
        .post(`http://localhost:8081/records/getHotelOfCity`, {
          cityName: "Cần Thơ",
          position: { lat: 10.0451618, lng: 105.7468535 },
          radius: 5000,
          pageToken: this.pageToken,
        })
        .then((response) => {
          console.log("Hotel data:", response);
          this.pageToken = response.data[response.data.length - 1].pageToken;
          console.log("pageToken: ", this.pageToken);
        });
    },
    callMoreHotel: function () {
      axios
        .post(`http://localhost:8081/records/getHotelOfCity`, {
          radius: "5000",
          position: this.cityPosition,
          cityName: this.cityName,
          pageToken: this.pageToken,
        })
        .then((response) => {
          console.log("Hotel data:", response);
          this.pageToken = response.data[response.data.length - 1].pageToken;
          console.log("pageToken: ", this.pageToken);
          if (response.data[response.data.length - 1].pageToken == undefined) {
            this.loadMore = false;
            //Khong con next  page token
            this.pageToken = "";
            //xoa bo phan tu cuoi
            response.data.splice(-1);
            //luu vao state
            response.data.map((hotel) => {
              this.hotelList.push(hotel);
            });
          } else {
            //con next page token
            this.loadMore = true;
            //xoa bo phan tu cuoi
            response.data.splice(-1);
            //luu vao state
            response.data.map((hotel) => {
              this.hotelList.push(hotel);
            });
          }
        });
    },
    getAddressData: function (addressData, placeResultData, id) {
      console.log(addressData, placeResultData, id);
      this.cityPosition = {
        lat: addressData.latitude,
        lng: addressData.longitude,
      };
      this.cityName = addressData.locality;

      axios
        .post(`http://localhost:8081/records/getHotelOfCity`, {
          radius: "5000",
          position: { lat: addressData.latitude, lng: addressData.longitude },
          cityName: addressData.locality,
          pageToken: this.pageToken,
        })
        .then((response) => {
          console.log("Hotel data:", response);
          this.pageToken = response.data[response.data.length - 1].pageToken;
          console.log("pageToken: ", this.pageToken);
          if (response.data[response.data.length - 1].pageToken == undefined) {
            this.loadMore = false;
            //Khong con next  page token
            this.pageToken = "";
            //xoa bo phan tu cuoi
            response.data.splice(-1);
            //luu vao state
            response.data.map((hotel) => {
              this.hotelList.push(hotel);
            });
          } else {
            //con next page token
            this.loadMore = true;
            //xoa bo phan tu cuoi
            response.data.splice(-1);
            //luu vao state
            response.data.map((hotel) => {
              this.hotelList.push(hotel);
            });
          }
        });
    },
    clickButton: function () {
      const data = {
        location: { lat: 10.045162, lng: 105.746857 },
        type: "lodging",
        radius: "5000",
      };
      this.$socket.emit("selectGeo", data);
    },
    directions(destination) {
      console.log(destination);

      this.endLocation = {
        lat: destination.lat,
        lng: destination.lng,
      };
    },

    async getLocation() {
      return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocation is not available."));
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve(pos);
          },
          (err) => {
            reject(err);
          }
        );
      });
    },
    async locateMe() {
      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation();
        this.position.lat = this.location.coords.latitude;
        this.position.lng = this.location.coords.longitude;
        this.loadMap = true;
      } catch (e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
    },
    getCurrentPosition() {
      const success = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        this.position.lat = latitude;
        this.position.lng = longitude;
        // Do something with the position
      };

      const error = (err) => {
        console.log(err);
      };
      // This will open permission popup
      navigator.geolocation.getCurrentPosition(success, error);
    },
  },
  created() {
    this.locateMe();
    console.log(this.markers);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hotelTable {
  position: relative;
}
.loadMore {
  position: absolute;
  bottom: -10px;
}
.bgImg {
  position: absolute;
  top: 10px;
  left: 0;
}
.app-title {
  position: absolute;
  top: 280px;
  left: 130px;
  font-size: 48px;
  line-height: 56px;
  letter-spacing: -0.3px;
  font-weight: 600;
  color: #fff;
}
.titleDesc {
  position: absolute;
  top: 350px;
  left: 130px;
  font-size: 18px;
  line-height: 36px;
  letter-spacing: -0.3px;
  font-weight: 400;
  color: #fff;
  width: 780px;
  text-align: left;
}
.header {
  background-color: #2e51e8;

  height: 100vh;
  position: relative;
}
.search {
  position: absolute;
  bottom: 220px;
  width: 40% !important;
  height: 50px !important;
  left: 130px;
}
.searchBtn {
  position: absolute;
  height: 50px !important;
  bottom: 220px;

  left: 736px;
}
.headerImg {
  position: absolute;
  bottom: 0;
  right: 0;
  height: 90%;
}
</style>
