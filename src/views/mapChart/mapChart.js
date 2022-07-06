import axios from "axios";
import mapSymbol from '@/assets/img/mapSymbol.png'
import {cityCode, mapCode} from '@/assets/js/map/mapCode.js';
import { _debounce } from '@/utils/common.js'
import {loadBMap} from "../../assets/js/loadBMap";
import * as MapChartApi from "@/api/mapChart.js"
import * as icon from "./iconLocation"
import {getDecoration} from "./iconLocation";


export default {

  components:{
  },
  data(){
    return{
      lat: null,
      lng: null,
      city: null,
      province: null,
      myChart: null,
      chinaCode: 100000,
      curMapName:'china', // 当前地图名
      curLevel:0,//当前行政等级
      curCity:'',
      mapPointData: [],
      flag: true,
      option1: {},  //基本
      option2: {},
      option: {},
      delSeries: [],
      selectedMaps:[
        {
          name:'china',
          code:'100000',
        }
      ],
      loading:null,
      deviceMode:this.$store.state.deviceMode,
      poetryInfo:{
      },
      cityInfo:{

      }
    }
  },
  computed: {
    watchDeviceMode () {
      return this.$store.state.deviceMode;　　//需要监听的数据
    }
  },
  watch: {
    watchDeviceMode(newVal, oldVal) {
      this.deviceMode = newVal;
    }
  },
  methods:{
    // 定位
    getlocation() {
      this.$nextTick(function () {
        try {
          const geolocation = new BMap.Geolocation();
          let _that = this;
          this.loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          geolocation.getCurrentPosition(r => {
            if (geolocation.getStatus() == BMAP_STATUS_SUCCESS) {
              _that.lat = r.point.lat;
              _that.lng = r.point.lng;
              let tempCity = r.address.city;
              if (tempCity.substr(tempCity.length - 1, 1) === '市') {
                tempCity = tempCity.substr(0, tempCity.length - 1)
              }
              _that.city = tempCity;
              let tempProvince = r.address.province
              if (tempProvince.substr(tempProvince.length - 1, 1) === '省') {
                tempProvince = tempProvince.substr(0, tempProvince.length - 1)
              }
              _that.province = tempProvince
              _that.mapPointData.push({
                name: r.address.city,
                value: [r.point.lng, r.point.lat]
              })
            }
            _that.getMapData(_that.chinaCode);
            this.loading.close()
            window.addEventListener('resize',_that.resizeCharts);
          });
        } catch (e) {
          // console.log(e);
        }
      })
    },
    // 绘制地图
    drawMapChart(mapName, mapJSON) {

      if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
        this.myChart.dispose();
      }
      this.myChart = this.$echarts.init(document.getElementById('mapChart'));
      this.$echarts.registerMap(mapName, mapJSON);
      this.option1 = {
        geo: {
          show: true,
          type: 'map',
          roam: true,
          map: mapName,
          selectedMode: true,
          zoom: 1, //设置初始化缩放比例
          blue: {
            itemStyle: {}
          },
          z: 1,
          label: {
            show: true,
            position: 'top',
            backgroundColor: 'rgba(255,141,26)',
            borderRadius: 8,
            padding: [3, 4],
            color: '#fff',
            lineHeight: 12,
            textStyle: {
              fontSize: 10,
            },
            labelLayout: function (params) {
              // console.log(params)
            },
          },
          itemStyle: {
            normal: {
              areaColor: '#DBEACB',   //地区
              borderColor: '#9CA3A6',//边界
              // oacity: 0.5,
            },
            emphasis: {
              areaColor: '#8CB36F', //选中的地区颜色
            },
          },
          select: {
            itemStyle: {
              areaColor: '#8CB36F', //选中的地区颜色
            },
            label: {
              show: true,
              padding: [5, 6],
              backgroundColor: '',
              lineHeight: 20,
              color: '#000',
              fontSize: 20
            }
          }

        },
        series: [
        ]
      }

      // 江浙沪特色图标
      if (mapName == '浙江') {
        this.option1.geo.zoom = 1.2
        this.option1.geo.label.show = false
        this.option1.geo.label.show = false
        this.option1.geo.select.label.show = false
        for (let i = 0; i < icon.zj.length; i++) {
          this.option1.series.push(icon.zj[i])
          this.option1.series = this.option1.series.concat(getDecoration('zj'));
        }
      } else if (mapName == '江苏') {
        this.option1.geo.zoom = 1.2
        this.option1.geo.label.show = false
        this.option1.geo.label.show = false
        this.option1.geo.select.label.show = false

        for (let i = 0; i < icon.js.length; i++) {
          this.option1.series.push(icon.js[i])
          this.option1.series = this.option1.series.concat(getDecoration('js'));
        }
      } else if (mapName == '上海') {
        this.option1.geo.zoom = 1.5
        this.option1.geo.label.show = false
        this.option1.geo.label.show = false
        this.option1.geo.select.label.show = false
        for (let i = 0; i < icon.sh.length; i++) {
          this.option1.series.push(icon.sh[i])
          this.option1.series = this.option1.series.concat(getDecoration('sh'));
        }
      }

      // 定位图标
      if (mapName == 'china' || mapName == this.city || mapName == this.province) {
        this.option1.series.push({
          type: "scatter",
          coordinateSystem: "geo",
          //自定义图片的 位置（lng, lat）
          data: this.mapPointData,
          //自定义图片的 大小
          symbolSize: [20, 30],
          //自定义图片的 路径
          symbol: `image://` + mapSymbol,
        });
      }

      this.option = this.option1;

      // 地图区域点击事件
      this.myChart.on('click', (params) => {
        // if (params.geoIndex == undefined) {
        //   console.log(params.name);
        //
        // }
        this.onClickChart(params.name)
      });

      // 拖拽，缩放监听事件
      this.myChart.on('georoam',(params) => {//选取的x轴值
        if (params.zoom != undefined) {
          let curZoom = params.zoom;

          let opt = this.myChart.getOption();
          for (let i = 0; i < this.option.series.length; i++) {
            opt.series[i].symbolSize[0] = opt.series[i].symbolSize[0] * curZoom
            opt.series[i].symbolSize[1] = opt.series[i].symbolSize[1] * curZoom
          }
          // console.log(opt)
          opt.geo[0].label.textStyle.fontSize =  opt.geo[0].label.textStyle.fontSize * curZoom
          opt.geo[0].label.lineHeight =  opt.geo[0].label.lineHeight * curZoom
          opt.geo[0].label.padding[0] =  opt.geo[0].label.padding[0] * curZoom
          opt.geo[0].label.padding[1] =  opt.geo[0].label.padding[1] * curZoom
          opt.geo[0].label.borderRadius =  opt.geo[0].label.borderRadius * curZoom
          this.myChart.clear()
          this.myChart.setOption(opt)
        }
      });

      this.myChart.setOption(this.option);

    },
    onClickChart(name) {
      // console.log(name)
      const map = mapCode[name];
      if (map) {
        this.curLevel = 1
        //二级地区的介绍
        this.curMapName = name;
        this.getMapData(map);
        // 为地图标题菜单存入（过滤同一地图多次点击情况）点击地图信息
        let selectedCodes = [];
        this.selectedMaps.forEach(item => selectedCodes.push(item.code));
        if (!selectedCodes.includes(map)) {
          this.$set(this.selectedMaps, this.selectedMaps.length, {name: this.curMapName, code: map});
        }
      } else {
        if (this.curCity == name) {
          this.curLevel = 1;
          this.curCity = '';
        } else {
          this.curCity =  name;
          this.curLevel = 2
          let curCityCode = cityCode[this.curCity]
          if (curCityCode != undefined && cityCode[this.curCity].substr(0, 3) == "310") {
            curCityCode = "310000"
          }
          if (curCityCode != undefined) {
            // axios.defaults.baseURL = 'api'
            MapChartApi.getPoetryList({cityCode:curCityCode}).then(res => {
              if (res.data.code == '400') {
                this.$message(res.data.msg);
              } else if (res.data.code == '200') {
                let poetryList = res.data.data;
                let poetryLen = poetryList.length
                let n = Math.floor(Math.random() * poetryLen);    // 可均衡获取 0 到 9 的随机整数。
                this.poetryInfo = poetryList[n]
                let temp = []
                for (let i = 0, j = 0; i < this.poetryInfo.poetryList.length; i++) {
                  if (i % 2 == 0) {
                    temp[j] = this.poetryInfo.poetryList[i] + "," + this.poetryInfo.poetryList[i + 1] + "。";
                    j++;
                  }
                }
                this.poetryInfo.poetryList = temp
              }
            });
            MapChartApi.getCityInfo({cityCode:curCityCode}).then(res => {
              if (res.data.code == '400') {
                this.$message(res.data.msg)
              } else if (res.data.code == '200') {
                if (res.data.data.length > 0) {
                  this.cityInfo = res.data.data[0];
                }
              }
            });
          }

        }
      }
    },

    delElByIndex(arr,index){
      let len = arr.length-1
      let temp = arr[index]
      for(let i=index;i<len;i++)
        arr[i]=arr[i+1];
      arr.length = len;
      return temp
    },


    initMapData(mapJson) {
      let mapData = [];
      for (let i = 0; i < mapJson.features.length; i++) {
        mapData.push({ name: mapJson.features[i].properties.name });
      }
      return mapData;
    },
    // 地图标题菜单点击
    chooseMap(item,index){
      this.curLevel = index
      if (index == 0){
        this.curMapName = 'china'
        this.curCity = ''
      }
      this.selectedMaps.splice(index + 1);
      this.getMapData(item.code)
    },
    // 浏览器窗口大小改变时，重新加载图表以自适应
    resizeCharts:_debounce(function(){
      this.$echarts.init(document.getElementById('mapChart')).resize()

    },500),
    // 获取地图数据
    getMapData(map){
      // axios.defaults.baseURL = 'static'
      axios.get(`static/json/map/${map}.json`).then((res) => {
        if(res.status == 200){
          const mapJSON = res.data;
          this.drawMapChart(this.curMapName, mapJSON);
        }
      }).catch((err) => {
        this.$message({message: err,type: 'error',showClose: true});
      })
    }
  },

  created() {
    window.initBaiduMapScript = () => {
      this.getlocation();
    }
    loadBMap('initBaiduMapScript');
  },

  beforeDestroy() {
    window.addEventListener('resize',this.resizeCharts);
  },


}
