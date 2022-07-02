import axios from "axios";
import mapSymbol from '@/assets/img/mapSymbol.png'
import { mapCode } from '@/assets/js/map/mapCode.js';
import { _debounce } from '@/utils/common.js'
import {loadBMap} from "../../assets/js/loadBMap";

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
      tempData: [],
      flag: true,
      option1: {},
      option2: {},
      option: {},
      selectedMaps:[
        {
          name:'china',
          code:'100000',
        }
      ],
      loading:null,
      deviceMode:this.$store.state.deviceMode
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
            console.log(r, "aaa");
            if (geolocation.getStatus() == BMAP_STATUS_SUCCESS) {
              _that.lat = r.point.lat;
              _that.lng = r.point.lng;
              _that.city = r.address.city;
              _that.province = r.address.province;
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
          console.log(e);
        }
      })
    },
    // 绘制地图
    drawMapChart(mapName, mapJSON){
      console.log(mapName)
      console.log(mapJSON)
      if (this.myChart != null && this.myChart != "" && this.myChart != undefined) {
        this.myChart.dispose();
      }
      this.myChart = this.$echarts.init(document.getElementById('mapChart'));
      this.$echarts.registerMap(mapName,mapJSON);
      this.option1 = {
        geo: {
          show: true,
          type: 'map',
          map: mapName,
          label: {
            emphasis: {
              show: false
            }
          }
        },
        series: [
          {
            type: 'map',
            map: mapName,
            roam: false,
            tooltip:{
              show:false
            },
            label: {
              show:false,
              color:'#fff'
            },
            itemStyle: {
              normal: {
                areaColor: '#D4E6C0',   //地区
                borderColor: '#9CA3A6',//边界
              },
              emphasis: {
                areaColor: '#98B172' //选中的地区颜色
              }
            },
            emphasis: {
              itemStyle: {
                areaColor:''
              },
              label:{
                show:false
              }
            }
          },
          {
            type: "scatter",
            coordinateSystem: "geo",
            //自定义图片的 位置（lng, lat）
            data: this.mapPointData,
            //自定义图片的 大小
            symbolSize: [30, 30],
            //自定义图片的 路径
            symbol: `image://`+mapSymbol,
            color: ['red'],
          }
          // {
          //   type: 'scatter',
          //   coordinateSystem: 'geo',
          //   //定位图标
          //   symbol: `image://../assets/img/mapSymbol.png`,
          //   symbolSize: [30, 30],
          //   // color: ['red'],
          //   data: this.mapPointData,
          //   showEffectOn: 'render',
          //   rippleEffect: {
          //     number:1,
          //     scale:3,
          //     brushType: 'fill'
          //   }
          // }
        ]
      };

      this.option2 = {
        geo: {
          show: true,
          type: 'map',
          map: mapName,
          label: {
            emphasis: {
              show: false
            }
          }
        },
        series: [
          {
            type: 'map',
            map: mapName,
            roam: false,
            tooltip:{
              show:false
            },
            label: {
              show:false,
              color:'#fff'
            },
            itemStyle: {
              normal: {
                areaColor: '#D8E9F1',
                borderColor: '#9CA3A6',
              },
              emphasis: {
                areaColor: '#65CADA'
              }
            },
            emphasis: {
              itemStyle: {
                areaColor:''
              },
              label:{
                show:false
              }
            }
          },
          // {
          //   name:'',
          //   type: 'effectScatter',
          //   coordinateSystem: 'geo',
          //   symbol: 'circle',
          //   symbolSize: [5, 5],
          //   color: ['#FFD700'],
          //   data: this.mapPointData,
          //   showEffectOn: 'render',
          //   rippleEffect: {
          //     number:1,
          //     scale:3,
          //     brushType: 'fill'
          //   }
          // }
        ]
      };
      // this.myChart.setOption(this.option1);

      if (mapName == 'china' || mapName == this.city || mapName == this.province) {
        this.option = this.option1;
        console.log(this.option.series[1].data)
      } else {
        this.option = this.option2;
        console.log(this.option)
      }
      this.myChart.setOption(this.option);
      this.myChart.on('click', (params) => {
        console.log(params)
        const map = mapCode[params.name];
        if(map){
          this.curLevel = 1
          //二级地区的介绍
          this.curMapName = params.name;
          this.getMapData(map);
          // 为地图标题菜单存入（过滤同一地图多次点击情况）点击地图信息
          let selectedCodes = [];
          this.selectedMaps.forEach( item => selectedCodes.push(item.code));
          if(!selectedCodes.includes(map)){
            this.$set(this.selectedMaps,this.selectedMaps.length,{name: this.curMapName, code: map});
          }
          console.log(selectedCodes)
        }else{
          if (this.curCity == params.name) {
            console.log(this.curCity)
            this.curLevel = 1;
            this.curCity = '';
          } else {
            this.curCity = params.name;
            this.curLevel =2
          }


          //这里调用对具体3级地区的介绍

          // this.$message({message: '暂无地图数据',type: 'warning',showClose: true});
        }
      });
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
      axios.get(`/json/map/${map}.json`).then((res) => {
        if(res.status == 200){
          const mapJSON = res.data;
          this.drawMapChart(this.curMapName, mapJSON);
        }
      }).catch((err) => {
        this.$message({message: err,type: 'error',showClose: true});
      })
    },
    goGame(){
      this.$router.push({name:'game'}) // 只能用 name
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
