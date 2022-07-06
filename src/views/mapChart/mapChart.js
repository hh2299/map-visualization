import axios from "axios";
import mapSymbol from '@/assets/img/mapSymbol.png'
import {cityCode, mapCode} from '@/assets/js/map/mapCode.js';
import { _debounce } from '@/utils/common.js'
import {loadBMap} from "../../assets/js/loadBMap";
import * as MapChartApi from "@/api/mapChart.js"
import * as icon from "./iconLocation"
import {getDecoration} from "./iconLocation";

// const posHandler = {
//   posMap: {},
//   reset: function() {
//     this.posMap = {};
//   },
//   getDeltaPos: function(params){
//     var rect = params.rect;
//     var labelWidth = 20, labelHeight = 10;
//     var gridx = Math.floor(rect.x / labelWidth);
//     var gridy = Math.floor(rect.y / labelHeight);
//     var currCell = [gridx, gridy], currPos = [];
//     var increaseArr = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, -1], [-1, 0], [-1, -1]];
//     // 将显示区域划分成一个个定宽和定高的区域
//     // 将标签放在离它最近的区域
//     // 如果最近的那格没有，向周围九宫格上面找
//     // 找到一个没有放过的,分配给它，然后得出一个偏移量
//     var found = false;
//     // 如果格子已被占，循环查找
//     if(this.posMap[currCell[0] + '-' + currCell[1]]) {
//       while(!found) {
//         for(var i = 0;i<increaseArr.length;i++) {
//           currCell[0] = currCell[0] + increaseArr[i][0];
//           currCell[1] = currCell[1] + increaseArr[i][1];
//           if (!this.posMap[currCell[0] + '-' + currCell[1]]) {
//             found = true;
//             this.posMap[currCell[0]+'-'+currCell[1]] = params.text;
//             currPos = [currCell[0]* labelWidth, currCell[1] * labelHeight];
//             break;
//           }
//         }
//         if(found) {
//           break;
//         }
//       }
//     } else {
//       // 如果格子没有被占，就它了
//       this.posMap[gridx + '-' + gridy] = params.text
//     }
//     currPos = [currCell[0]* labelWidth, currCell[1] * labelHeight];
//     var deltaPos = {
//       dx: currPos[0] - rect.x,
//       dy: currPos[1] - rect.y
//     }
//     return deltaPos;
//   }
// };

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
         roam: false,
         map: mapName,
         selectedMode: true,
         // label: {
         //   emphasis: {
         //     show: false
         //   }
         // },
         label: {
           normal: {
             show: true,
             position: 'top',
             backgroundColor: 'rgba(255,141,26)',
             borderRadius: 10,
             padding: [6, 6],
             color: '#fff',
             textStyle: {
               fontSize: 10,
             }
           },
           emphasis: {
             show: true,
             padding: [5, 6],
             backgroundColor: '',
             lineHeight: 20,
             color: '#000',
             textStyle: {
               fontSize: 20,
             }
           },
           labelLayout: function (params) {
             console.log(params)
           },
         },
         itemStyle: {
           normal: {
             areaColor: '#DBEACB',   //地区
             borderColor: '#9CA3A6',//边界
           },
           emphasis: {
             areaColor: '#8CB36F', //选中的地区颜色
           },
         },
         select: {
           itemStyle: {
               areaColor: '#8CB36F', //选中的地区颜色
           },
           label:{
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
         // {
         //   type: 'map',
         //   map: mapName,
         //   roam: true,
         //   tooltip: {
         //     show: false
         //   },
         //   label: {
         //     normal:{
         //       show: true,
         //       position: 'top',
         //       backgroundColor: 'rgba(255,141,26)',
         //       borderRadius: 10,
         //       padding: [6, 6],
         //       color: '#fff',
         //       textStyle: {
         //         fontSize: 10,
         //       }
         //     },
         //     emphasis: {
         //       show: true,
         //       padding: [5, 6],
         //       backgroundColor: '',
         //       lineHeight: 20,
         //       color: '#000',
         //       textStyle: {
         //         fontSize: 20,
         //       }
         //     },
         //     // formatter(params:any) {
         //     //   return `${params.data.name}`;
         //     // }
         //   },
         //   labelLayout: function (params) {
         //      console.log(params)
         //   },
         //   itemStyle: {
         //     normal: {
         //       areaColor: '#DBEACB',   //地区
         //       borderColor: '#9CA3A6',//边界
         //     },
         //     emphasis: {
         //       areaColor: '#8CB36F', //选中的地区颜色
         //     },
         //     select:{
         //       areaColor: '#8CB36F', //选中的地区颜色
         //     },
         //
         //   },
         //   // emphasis:{
         //   //   itemStyle:{
         //   //     normal: {
         //   //       areaColor: '#DBEACB',   //地区
         //   //       borderColor: '#9CA3A6',//边界
         //   //     },
         //   //     emphasis: {
         //   //       areaColor: '#8CB36F', //选中的地区颜色
         //   //     },
         //   //   }
         //   // }
         //
         // }
       ]
     }

      if (mapName != 'china') {
        this.option1.geo.label.show = false;
      }
      // this.myChart.setOption(this.option1);


      console.log(mapName)
      if (mapName == '浙江') {
        console.log("zj")
        this.option1.geo.label.normal.show = false
        this.option1.geo.label.emphasis.show = false
        this.option1.geo.select.label.show = false
        for (let i=0;i<icon.zj.length;i++) {
          console.log(this.option1.series.length)
          this.option1.series.push(icon.zj[i])
          console.log(this.option1.series.length)
          this.option1.series=this.option1.series.concat(getDecoration('zj'));
          console.log(this.option1.series.length)
        }
      }else if (mapName == '江苏') {
        this.option1.geo.label.normal.show = false
        this.option1.geo.label.emphasis.show = false
        this.option1.geo.select.label.show = false

        for (let i=0;i<icon.js.length;i++) {
          this.option1.series.push(icon.js[i])
          this.option1.series = this.option1.series.concat(getDecoration('js'));
        }
      }else if (mapName == '上海') {
        this.option1.geo.label.normal.show = false
        this.option1.geo.label.emphasis.show = false
        this.option1.geo.select.label.show = false
        for (let i=0;i<icon.sh.length;i++) {
          this.option1.series.push(icon.sh[i])
          this.option1.series=this.option1.series.concat(getDecoration('sh'));
        }
      }

      if (mapName == '海南') {
        this.option1.geo.roam = true
      }

      if (mapName == 'china' || mapName == this.city || mapName == this.province) {
        this.option1.series.push( {
          type: "scatter",
          coordinateSystem: "geo",
          //自定义图片的 位置（lng, lat）
          data: this.mapPointData,
          //自定义图片的 大小
          symbolSize: [20, 30],
          //自定义图片的 路径
          symbol: `image://`+mapSymbol,
        });
      }

      console.log(this.option1.series.length)

      this.option = this.option1;

      this.myChart.setOption(this.option);
      this.myChart.on('click', (params) => {
        if (params.componentIndex != 0) {
          return
        }
        console.log('click', params);
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
        }else{
          console.log(this.curCity)
          console.log(params.name)
          if (this.curCity == params.name) {
            console.log(this.curCity)
            this.curLevel = 1;
            this.curCity = '';
          } else {
            this.curCity = params.name;
            this.curLevel =2
            let curCityCode = cityCode[this.curCity]
            if (curCityCode!=undefined&&cityCode[this.curCity].substr(0, 3) == "310") {
              curCityCode = "310000"
            }
            if (curCityCode != undefined) {
              MapChartApi.getPoetryList({cityCode:curCityCode}).then(res=>{
                let poetryList = res.data.data
                let poetryLen = poetryList.length
                let n = Math.floor(Math.random()*poetryLen);    // 可均衡获取 0 到 9 的随机整数。
                this.poetryInfo = poetryList[n]
                let temp = []
                for (let i = 0,j=0; i < this.poetryInfo.poetryList.length; i++) {
                  if (i % 2 == 0) {
                    temp[j] = this.poetryInfo.poetryList[i] + ","+ this.poetryInfo.poetryList[i+1]+"。";
                    j++;
                  }
                }
                this.poetryInfo.poetryList = temp
              });

              MapChartApi.getCityInfo({cityCode:curCityCode}).then(res=>{
                this.cityInfo = res.data.data
              });
            }

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
    },
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
