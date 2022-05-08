<template>
  <div class="map">
    <!-- <vue-google-autocomplete
      id="map"
      classname="form-control"
      placeholder="Nhập vào thành phố muốn tìm kiếm khách sạn..."
      v-on:placechanged="getAddressData"
      types="(cities)"
      class="el-input"
    >
    </vue-google-autocomplete> -->
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
        class="search el-input"
      >
      </vue-google-autocomplete>
      <!-- <b-form-input :type="type" class="search"> </b-form-input> -->
      <b-button variant="success" class="searchBtn">Khám phá ngay</b-button>
    </div>

    <!-- <button @click="clickButton()">Dispatch</button>
    <button @click="chiduong()">Click</button>
    <button @click="getHotelOfCity()">Get Hotel</button> -->

    <!-- <GmapAutocomplete @place_changed="setPlace" class="form-control" /> -->
    <!-- 
    <span>Chọn thành phố</span>

    <span>Chọn loại địa điểm</span> -->
    <b-form-checkbox-group
      v-model="selected"
      :options="options"
      class="mb-3"
      value-field="item"
      text-field="name"
      disabled-field="notEnabled"
    ></b-form-checkbox-group>
    <b-container fluid class="app-container">
      <b-row>
        <b-col cols="6">
          <!-- <GmapAutocomplete
            @place_changed="getHotelInfo"
            class="form-control"
            placeholder="Nhập vào khách sạn cần tìm kiếm..."
          /> -->
          <div class="hotelInfomation" v-if="isShowHotelInfomation">
            <h1>Hotel Infomation</h1>
            <p @click="backToHotelList" class="backToHotelList">
              Back to hotel list
            </p>

            <b-container class="bv-example-row">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >Check all</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="checkedCities"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox v-for="city in cities" :label="city" :key="city">{{
                  city
                }}</el-checkbox>
              </el-checkbox-group>
              <b-row>
                <b-col cols="4">Name:</b-col>
                <b-col cols="8">{{ this.hotelInfomation.name }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4">Rating</b-col>
                <b-col cols="8">
                  {{ this.hotelInfomation.rating }}
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">Address</b-col>
                <b-col cols="8">{{ this.hotelInfomation.address }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4">Place_id</b-col>
                <b-col cols="8">{{ this.hotelInfomation.place_id }}</b-col>
              </b-row>
              <!-- bootstrap image gallery 1 -->

              <div class="row">
                <h5 v-if="noImage">No image</h5>
                <p v-if="imageLoading">Loading image...</p>
                <div
                  class="col-lg-4 col-md-12 mb-4 mb-lg-0"
                  v-for="(hotel, index) in hotelInfomation.photos"
                  :key="index"
                >
                  <img
                    v-if="hotelInfomation.photos"
                    v-bind:src="hotel.src"
                    @click="openGallery(index)"
                    class="w-100 shadow-1-strong rounded mb-4"
                    onerror="this.src='https://previews.123rf.com/images/koblizeek/koblizeek2001/koblizeek200100006/137486703-.jpg?fj=1'"
                    alt="Loi"
                  />
                </div>
              </div>
            </b-container>
          </div>
          <div class="hotelList" v-if="isShowHotelList">
            <h4>Hotel List</h4>

            <el-table
              :data="hotelList"
              height="650"
              style="width: 100%"
              :show-header="true"
              empty-text="."
              class="hotelTable"
              id="hotelTableId"
              @row-click="hotelClickHandler"
            >
              <div class="hotelTable">
                <el-table-column prop="vicinity" label="Address">
                </el-table-column>
                <el-table-column prop="name" label="HotelName" width="280">
                </el-table-column>
                <el-table-column
                  prop="rating"
                  label="Rating"
                  width="80"
                  sortable
                >
                </el-table-column>
              </div>
            </el-table>
            <!-- <b-table
              striped
              hover
              :items="hotelList"
              :fields="fields"
              sticky-header="1000px"
              class="hotelTable"
              id="hotelTableId"
              @row-clicked="hotelClickHandler"
            ></b-table> -->
          </div>
          <b-button
            v-if="loadMore"
            variant="outline-primary"
            @click="callMoreHotel()"
            >Load more hotel
          </b-button></b-col
        >
        <b-col cols="6" class="mapContent"
          ><p v-if="!loadMap">Loading map...</p>
          <GmapMap
            :options="{ gestureHandling: 'greedy' }"
            ref="mapRef"
            v-if="loadMap"
            :center="{ lat: this.position.lat, lng: this.position.lng }"
            :zoom="16"
            map-type-id="hybrid"
            style="width: 100%; height: 95%"
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
            /> </GmapMap
        ></b-col>
      </b-row>
      <LightBox
        v-if="hotelInfomation.photos"
        ref="lightbox"
        :media="hotelInfomation.photos"
        :show-caption="true"
        :showLightBox="false"
        :interfaceHideTime="200000"
      >
      </LightBox>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import DirectionsRenderer from "./DirectionsRenderer";
import VueGoogleAutocomplete from "vue-google-autocomplete";

import LightBox from "vue-it-bigger";
import("vue-it-bigger/dist/vue-it-bigger.min.css"); // when using webpack

export default {
  name: "GoogleMap",
  components: {
    DirectionsRenderer,
    VueGoogleAutocomplete,

    LightBox,
  },
  props: {
    msg: String,
  },
  data() {
    return {
      checkAll: false,
      checkedCities: ["Shanghai", "Beijing"],
      cities: ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"],
      isIndeterminate: true,
      loadMore: false,
      isShowHotelList: true,
      isShowHotelInfomation: false,
      fields: [
        // A column that needs custom formatting
        { key: "name", label: "Hotel Name" },
        { key: "rating", label: "Rating", sortable: true },
        { key: "vicinity", label: "Address" },
      ],

      hotelList: [],

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
      hotelInfomation: {
        name: null,
        address: null,
        rating: null,
        place_id: null,
        photos: [],
      },
      noImage: false,
      imageLoading: true,
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
    getHotelInfo() {},
    openGallery(index) {
      this.$refs.lightbox.showImage(index);
    },
    backToHotelList() {
      this.isShowHotelList = true;
      this.isShowHotelInfomation = false;
      this.hotelInfomation.photos = false;
      this.noImage = false;
      this.imageLoading = true;
    },
    hotelClickHandler(record, index) {
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      console.log(record, index); // This will be the item data for the row
      this.hotelInfomation.name = record.name;
      this.hotelInfomation.rating = record.rating;
      this.hotelInfomation.address = record.vicinity;
      this.hotelInfomation.place_id = record.place_id;
      this.position.lat = record.geometry.location.lat;
      this.position.lng = record.geometry.location.lng;
      this.$refs.mapRef.$mapPromise.then((map) => {
        console.log(map);
        map.zoom = 18;
        map.panTo({ lat: this.position.lat, lng: this.position.lng });
      });
      this.isShowHotelInfomation = true;
      this.isShowHotelList = false;
      this.loadMore = false;
      axios
        .post(`http://localhost:8081/records/getHotelInfomation`, {
          place_id: this.hotelInfomation.place_id,
        })
        .then((response) => {
          console.log(response);
          this.hotelInfomation.address = response.data.result.formatted_address;
          this.hotelInfomation.phone =
            response.data.result.formatted_phone_number;
          this.hotelInfomation.photos = [];
          if (response.data.photoUrl) {
            this.noImage = false;
            response.data.photoUrl.map((photo) => {
              // console.log(typeof this.hotelInfomation.photos, photo);
              const imageObject = {
                type: "image", // Can be omitted for image
                thumb: photo,
                src: photo,
              };
              this.hotelInfomation.photos.push(imageObject);
              this.imageLoading = false;
            });
          } else {
            this.noImage = true;
            this.imageLoading = false;
          }

          console.log("length", this.hotelInfomation.photos.length);

          console.log("Info: ", this.hotelInfomation);
        })

        .catch((error) => {
          console.log(error);
        });
    },
    getHotelOfCity() {
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
    callMoreHotel() {
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

    getAddressData(addressData, placeResultData, id) {
      document.querySelector("#hotelTableId").scrollIntoView({
        behavior: "smooth",
      });
      this.hotelList = [];
      this.pageToken = "";
      console.log(addressData, placeResultData, id);
      this.cityPosition = {
        lat: addressData.latitude,
        lng: addressData.longitude,
      };
      this.cityName = addressData.locality;
      const data = {
        position: { lat: addressData.latitude, lng: addressData.longitude },
        cityName: addressData.locality,
        country: addressData.country,
        place_id: placeResultData.place_id,
      };
      console.log("cityInfo", data);
      axios.post(`http://localhost:8081/records/addCity`, data);
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
    clickButton() {
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
  height: 670px;
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
.app-container {
  height: 100vh !important;
}
.mapContent {
  height: 100vh !important;
}
.backToHotelList {
  text-align: left !important;
  cursor: pointer;
}
.hotelTable::-webkit-scrollbar {
  width: 8px !important;
  height: 8px !important;
}
.hotelTable::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.4) !important;
  border-radius: 10px !important;
}
.hotelTable::-webkit-scrollbar-thumb {
  background-color: #dfdfdf !important;
  border-radius: 10px !important;
}
.pac-container .pac-logo .hdpi {
  z-index: 999 !important;
}
</style>
