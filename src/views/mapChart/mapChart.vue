<template>
  <div class="chart pt-10">
    <el-card class="box-card" id="main-box">

<!--      顶部栏-->
      <div class="mapChoose" >
        <el-button class="returnCountry" v-if="selectedMaps.length>1" @click="chooseMap(selectedMaps[0],0)">
          <img src="../../assets/img/leftArrow.png" style="width: 0.7vmax;height: 1.4vmax">
        </el-button>
        <div class="curCity" v-if="selectedMaps.length>1">{{selectedMaps[1].name}}</div>
      </div>

<!--      地图-->
    <div class="mapDiv">
      <div id="mapChart"
           :class="{mapChartBig:curMapName=='china',
           mapChartSmall:curMapName!='china'&&deviceMode==1,
           mapChartPhone:curMapName!='china'&&deviceMode==0}"
      >
      </div>

<!--      地区介绍-->
      <el-card  class="box-card" id="info-box" v-if="curMapName!='china'&&deviceMode==1" >
          <span ><img src="../../assets/img/infoHead.png" style="display: inline-block;vertical-align: bottom;width: 1.6vw;height: 1.6vw">
            <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">介绍</p>
            <p style="font-size: 1.4vw;display: inline-block;vertical-align: bottom;margin: 0px">:{{curCity}}</p>
          </span>
<!--          <el-button id="gameButton" type="text" v-if="curLevel==2" @click="goGame">进入游戏</el-button>-->
      </el-card>
      <el-card  class="box-card" id="info-box2" v-if="curMapName!='china'&&deviceMode==0" >
          <span ><img src="../../assets/img/infoHead.png" style="display: inline-block;vertical-align: bottom;width: 1.6vmax;height: 1.6vmax">
            <p style="color: #77D1DD;display: inline-block;font-size: 1.4vmax;vertical-align: bottom;margin: 0px">介绍</p>
            <p style="font-size: 1.4vmax;display: inline-block;vertical-align: bottom;margin: 0px">:{{curCity}}</p>
          </span>
<!--        <el-button id="gameButton" type="text" v-if="curLevel==2" @click="goGame">进入游戏</el-button>-->
      </el-card>

<!--      诗歌-->
      <el-card  class="box-card" id="info-box3" v-if="curMapName!='china'&&deviceMode==1" >
      </el-card>
      <el-card  class="box-card" id="info-box4" v-if="curMapName!='china'&&deviceMode==0" >
      </el-card>

    </div>


    </el-card>
  </div>
</template>

<script src="./mapChart.js"></script>


<style lang="less" scoped>
@import './mapChart.less';
</style>
