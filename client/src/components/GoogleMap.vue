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
        types="(regions)"
        class="search el-input"
      >
      </vue-google-autocomplete>
      <!-- <b-form-input :type="type" class="search"> </b-form-input> -->
      <b-button variant="success" class="searchBtn">Khám phá ngay</b-button>
    </div>

    <!-- <button @click="clickButton()">Dispatch</button>
    <button @click="chiduong()">Click</button>
    <button @click="getHotelOfCity()">Get Hotel</button> -->

    <!-- 
    <span>Chọn thành phố</span>

    <span>Chọn loại địa điểm</span> -->

    <b-container fluid class="app-container">
      <b-row>
        <b-col cols="6">
          <!-- <GmapAutocomplete
            @place_changed="getHotelInfo"
            class="form-control"
            placeholder="Nhập vào khách sạn cần tìm kiếm..."
          /> -->
          <div class="hotelInfomation" v-if="isShowHotelInfomation">
            <h1>Thông tin khách sạn</h1>
            <p @click="backToHotelList" class="backToHotelList">
              <i class="el-icon-back"></i>
              Trở về danh sách khách sạn
            </p>

            <b-container class="bv-example-row">
              <!-- <el-checkbox
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
              </el-checkbox-group> -->
              <b-row>
                <b-col cols="4">
                  <el-tag>Tên khách sạn: </el-tag>
                </b-col>
                <b-col cols="8">{{ this.hotelInfomation.name }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <el-tag type="success">Đánh giá: </el-tag>
                </b-col>
                <b-col cols="8">
                  <el-rate
                    v-model="this.hotelInfomation.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value} sao"
                  >
                  </el-rate>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <el-tag type="warning">Địa chỉ: </el-tag>
                </b-col>
                <b-col cols="8">{{ this.hotelInfomation.address }}</b-col>
              </b-row>

              <div class="block">
                <br />
                <span class="demonstration">Chọn bán kính tìm kiếm: </span>
                <el-slider
                  v-model="searchRadius"
                  :step="1000"
                  :min="1000"
                  :max="20000"
                  show-stops
                  @change="changeRadius"
                >
                </el-slider>
                <el-radio v-model="searchType" label="all">Tất cả</el-radio>
                <el-radio v-model="searchType" label="cafe"
                  >Quán cà phê</el-radio
                >
                <el-radio v-model="searchType" label="restaurant"
                  >Nhà hàng</el-radio
                >
                <el-radio v-model="searchType" label="hotel"
                  >Khách sạn</el-radio
                >
                <el-radio v-model="searchType" label="hospital"
                  >Bệnh viện</el-radio
                >
                <el-radio v-model="searchType" label="tourist_attraction"
                  >Danh lam thắng cảnh</el-radio
                >
                <el-radio v-model="searchType" label="bank"
                  >Ngân iu dấu</el-radio
                >
                <el-radio v-model="searchType" label="pharmacy"
                  >Nhà thuốc</el-radio
                >
                <el-button type="primary" @click="getAround"
                  >Tìm kiếm địa điểm xung quanh</el-button
                >
              </div>

              <div class="row">
                <h5 v-if="noImage">Không có hình ảnh cho địa điểm này</h5>
                <p v-if="imageLoading">
                  Đang tải hình ảnh...
                  <i class="el-icon-loading"></i>
                </p>
                <div
                  class="col-lg-4 col-md-12 mb-4 mb-lg-0"
                  v-for="(hotel, index) in hotelInfomation.photos"
                  :key="index"
                >
                  <el-image
                    v-if="hotelInfomation.photos"
                    style="width: 200px; height: 200px"
                    :src="hotel.src"
                    :fit="contain"
                    class="hotelImg shadow-1-strong rounded mb-2"
                    @click="openGallery(index)"
                    onerror="this.src='https://previews.123rf.com/images/koblizeek/koblizeek2001/koblizeek200100006/137486703-.jpg?fj=1'"
                    alt="Loi"
                  ></el-image>
                  <!-- <img
                    v-if="hotelInfomation.photos"
                    v-bind:src="hotel.src"
                    @click="openGallery(index)"
                    class="hotelImg shadow-1-strong rounded mb-2"
                    onerror="this.src='https://previews.123rf.com/images/koblizeek/koblizeek2001/koblizeek200100006/137486703-.jpg?fj=1'"
                    alt="Loi"
                  /> -->
                </div>
              </div>
            </b-container>
          </div>

          <!-- POI -->
          <div class="hotelInfomation" v-if="isShowPointInfomation">
            <h1>Thông tin địa điểm</h1>

            <p @click="backToPOI" class="backToHotelList">
              <i class="el-icon-back"></i>
              Trở về danh sách địa điểm xung quanh
            </p>

            <b-container class="bv-example-row">
              <b-row>
                <b-col cols="4">
                  <el-tag>Tên địa điểm: </el-tag>
                </b-col>
                <b-col cols="8">{{ this.POIInfomation.name }}</b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <el-tag type="success">Đánh giá: </el-tag>
                </b-col>
                <b-col cols="8">
                  <el-rate
                    v-model="this.POIInfomation.rating"
                    disabled
                    show-score
                    text-color="#ff9900"
                    score-template="{value} sao"
                  >
                  </el-rate>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="4">
                  <el-tag type="warning">Địa chỉ: </el-tag>
                </b-col>
                <b-col cols="8">{{ this.POIInfomation.address }}</b-col>
              </b-row>

              <div class="row">
                <h5 v-if="noImage">Không có hình ảnh cho địa điểm này</h5>
                <p v-if="imageLoading">
                  Đang tải hình ảnh...
                  <i class="el-icon-loading"></i>
                </p>
                <div
                  class="col-lg-4 col-md-12 mb-4 mb-lg-0"
                  v-for="(hotel, index) in POIInfomation.photos"
                  :key="index"
                >
                  <el-image
                    v-if="POIInfomation.photos"
                    style="width: 200px; height: 200px"
                    :src="hotel.src"
                    :fit="contain"
                    class="hotelImg shadow-1-strong rounded mb-2"
                    @click="openGallery1(index)"
                    onerror="this.src='https://previews.123rf.com/images/koblizeek/koblizeek2001/koblizeek200100006/137486703-.jpg?fj=1'"
                    alt="Loi"
                  ></el-image>
                </div>
              </div>
            </b-container>
          </div>
          <!-- END POI  -->
          <div class="hotelList" v-if="isShowHotelList">
            <h4>Danh sách khách sạn</h4>

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
                <el-table-column prop="vicinity" label="Địa chỉ">
                </el-table-column>
                <el-table-column prop="name" label="Tên khách sạn" width="280">
                </el-table-column>
                <el-table-column
                  prop="rating"
                  label="Đánh giá"
                  width="100"
                  sortable
                >
                  <template slot-scope="scope">
                    <div style="float: right">
                      {{ scope.row.rating }}
                      <i
                        class="el-rate__icon el-icon-star-on"
                        style="color: rgb(247, 186, 42)"
                      ></i>
                    </div>
                  </template>
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
          <div class="hotelList" v-if="isShowAroundTable">
            <h4>Danh sách địa điểm xung quanh của</h4>
            <h5>{{ hotelInfomation.name }}</h5>
            <p @click="backToHotelInfomation" class="backToHotelList">
              <i class="el-icon-back"></i>
              Trở về chi tiết địa điểm
            </p>
            <el-table
              :data="aroundInfomation"
              height="650"
              style="width: 100%"
              :show-header="true"
              empty-text="."
              class="hotelTable"
              id="hotelTableId"
              @row-click="pointClickHandler"
            >
              <div class="hotelTable">
                <el-table-column prop="vicinity" label="Địa chỉ">
                </el-table-column>
                <el-table-column prop="name" label="Tên khách sạn" width="280">
                </el-table-column>
                <el-table-column
                  prop="rating"
                  label="Đánh giá"
                  width="100"
                  sortable
                >
                  <template slot-scope="scope">
                    <div style="float: right">
                      {{ scope.row.rating }}
                      <i
                        class="el-rate__icon el-icon-star-on"
                        style="color: rgb(247, 186, 42)"
                      ></i>
                    </div>
                  </template>
                </el-table-column>
              </div>
            </el-table>
          </div>
          <b-button
            v-if="loadMore"
            variant="outline-primary"
            @click="callMoreHotel()"
            >Load more hotel
          </b-button>
        </b-col>
        <b-col cols="6" class="mapContent">
          <GmapAutocomplete
            class="form-control"
            @place_changed="hotelClickHandler"
          />
          <p v-if="!loadMap">Loading map... <i class="el-icon-loading"></i></p>
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
              v-for="(m, index) in poiMarker"
              :position="m.geometry.location"
              @click="directions(m.geometry.location)"
            />
          </GmapMap>
        </b-col>
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
      <LightBox
        v-if="POIInfomation.photos"
        ref="lightbox1"
        :media="POIInfomation.photos"
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
      searchType: "all",
      searchRadius: 5000,

      loadMore: false,
      isShowHotelList: true,
      isShowHotelInfomation: false,
      isShowAroundTable: false,
      isShowAroundImfomation: false,
      isShowPointInfomation: false,
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
        position: null,
        photos: [],
      },
      POIInfomation: {
        name: null,
        address: null,
        rating: null,
        place_id: null,
        position: null,
        photos: [],
      },
      noImage: false,
      imageLoading: true,
      poiMarker: [],
      aroundInfomation: [],
      room: "",
    };
  },
  sockets: {
    connect: function () {
      console.log("socket connected");
    },
    getGeo: function (data) {
      console.log("Around data from Socket: ", data);
      // this.poiMarker = [];
      // console.log("Room from socket: ", data.room);
      // console.log("Room from client: ", this.room);
      console.log(this.room == data.room);
      if (data.room != this.room) {
        this.room = data.room;
        console.log("Set lai State POI");
        this.aroundInfomation = data.data;
        console.log("around: ", this.aroundInfomation);
        data.data.map((point) => {
          this.poiMarker.push(point);

          this.$refs.mapRef.$mapPromise.then((map) => {
            map.zoom = 15;
            map.panTo({ lat: this.position.lat, lng: this.position.lng });
          });
        });
      } else {
        console.log("Khong can set lai");
      }
    },
  },
  methods: {
    backToHotelInfomation() {
      this.isShowAroundTable = false;
      this.isShowHotelInfomation = true;
    },
    backToPOI() {
      this.isShowAroundTable = true;
      this.isShowPointInfomation = false;
    },

    changeRadius(e) {
      this.searchRadius = e;
      console.log(this.searchRadius);
    },
    getAround() {
      const data = {
        location: this.hotelInfomation.position,
        type: this.searchType == "all" ? "" : this.searchType,
        radius: this.searchRadius,
        // radius: 2000,
      };
      console.log(data);

      this.room = JSON.stringify(data);
      this.$socket.emit("selectGeo", data);
      this.isShowAroundTable = true;
      this.isShowHotelInfomation = false;
    },
    getHotelInfo() {},
    openGallery(index) {
      this.$refs.lightbox.showImage(index);
    },
    openGallery1(index) {
      this.$refs.lightbox1.showImage(index);
    },
    backToHotelList() {
      this.poiMarker = [];
      this.isShowHotelList = true;
      this.isShowHotelInfomation = false;
      this.hotelInfomation.photos = false;
      this.noImage = false;
      this.imageLoading = true;
      // if (this.pageToken) {
      //   this.loadMore = true;
      // } else {
      //   this.loadMore = false;
      // }
    },
    hotelClickHandler(record, index) {
      this.isShowAroundTable = false;
      this.loadMore = false;
      this.imageLoading = true;
      this.noImage = false;
      this.hotelInfomation.photos = [];
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      console.log(record, index); // This will be the item data for the row
      console.log(
        "Lat: ",
        record.geometry.location.lat.length == 0
          ? record.geometry.location.lat()
          : record.geometry.location.lat
      );
      this.poiMarker = [];
      this.hotelInfomation.name = record.name;
      this.hotelInfomation.rating = record.rating;
      this.hotelInfomation.address = record.vicinity;
      this.hotelInfomation.place_id = record.place_id;
      this.position.lat =
        record.geometry.location.lat.length == 0
          ? record.geometry.location.lat()
          : record.geometry.location.lat;
      this.position.lng =
        record.geometry.location.lng.length == 0
          ? record.geometry.location.lng()
          : record.geometry.location.lng;
      this.$refs.mapRef.$mapPromise.then((map) => {
        console.log(map);
        map.zoom = 18;
        map.panTo({ lat: this.position.lat, lng: this.position.lng });
      });
      this.isShowHotelInfomation = true;
      this.isShowHotelList = false;
      // this.loadMore = false;
      axios
        .post(`http://localhost:8081/records/getHotelInfomation`, {
          place_id: this.hotelInfomation.place_id,
        })
        .then((response) => {
          console.log(response);
          this.hotelInfomation.address = response.data.result.formatted_address;
          this.hotelInfomation.phone =
            response.data.result.formatted_phone_number;
          this.hotelInfomation.position =
            response.data.result.geometry.location;
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
    pointClickHandler(record, index) {
      console.log("Hotel Info: ", record);
      this.endLocation = {
        lat: record.geometry.location.lat,
        lng: record.geometry.location.lng,
      };
      this.imageLoading = true;
      this.noImage = false;
      this.POIInfomation.photos = [];
      this.isShowAroundTable = false;
      this.isShowHotelInfomation = false;
      this.isShowPointInfomation = true;
      // 'record' will be the row data from items
      // `index` will be the visible row number (available in the v-model 'shownItems')
      console.log(record, index); // This will be the item data for the row
      this.POIInfomation.name = record.name;
      this.POIInfomation.rating = record.rating;
      this.POIInfomation.address = record.vicinity;
      this.POIInfomation.place_id = record.place_id;

      this.$refs.mapRef.$mapPromise.then((map) => {
        console.log(map);
        map.zoom = 18;
        map.panTo({ lat: this.position.lat, lng: this.position.lng });
      });

      this.isShowHotelList = false;
      // this.loadMore = false;
      axios
        .post(`http://localhost:8081/records/getHotelInfomation`, {
          place_id: this.POIInfomation.place_id,
        })
        .then((response) => {
          console.log(response);
          this.POIInfomation.address = response.data.result.formatted_address;
          this.POIInfomation.phone =
            response.data.result.formatted_phone_number;
          this.POIInfomation.position = response.data.result.geometry.location;
          this.POIInfomation.photos = [];
          if (response.data.photoUrl) {
            this.noImage = false;
            response.data.photoUrl.map((photo) => {
              // console.log(typeof this.hotelInfomation.photos, photo);
              const imageObject = {
                type: "image", // Can be omitted for image
                thumb: photo,
                src: photo,
              };
              this.POIInfomation.photos.push(imageObject);
              this.hotelInfomation.photos.push(imageObject);
              this.imageLoading = false;
            });
          } else {
            this.noImage = true;
            this.imageLoading = false;
          }

          console.log("length", this.POIInfomation.photos.length);

          console.log("Info: ", this.hotelInfomation);
        })

        .catch((error) => {
          console.log(error);
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
      this.loadMore = false;
      this.isShowHotelList = true;
      this.isShowHotelInfomation = false;
      this.isShowAroundTable = false;
      this.isShowAroundImfomation = false;
      this.isShowPointInfomation = false;
      this.hotelList = [];
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
          radius: "20000",
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
        location: this.hotelInfomation.position,
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
