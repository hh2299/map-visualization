<template>
  <div class="chart pt-10">
    <el-card class="box-card" id="main-box">

<!--      顶部栏-->
      <div class="mapChoose" >
        <el-button @click="chooseMap(selectedMaps[0],0)" v-if="selectedMaps.length>1" class="returnCountry">
          <img src="./../../assets/img/back.png" />
        </el-button>
<!--        class="returnCountry"  >-->
<!--          <img src="../../assets/img/leftArrow.png" style="width: 0.7vmax;height: 1.4vmax">-->
<!--        </el-button>-->
        <div class="curCity" v-if="selectedMaps.length>1">{{selectedMaps[1].name}}</div>
      </div>

<!--      地图-->
    <div class="mapDiv">
      <div id="mapChart"
           :class="{mapChartBig:curMapName!='浙江'&&curMapName!='江苏'&&curMapName!='上海',
           mapChartSmall:curMapName!='china'&&deviceMode==1&&(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海'),
           mapChartPhone:curMapName!='china'&&deviceMode==0&&(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')}"
      >
      </div>

<!--      地区介绍-->
      <el-card  class="box-card" id="info-box" v-if="(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')&&deviceMode==1&&curCity!=''" >

        <div style="width: 100%;height:36vh;overflow-y:auto;">
          <img src="../../assets/img/infoHead.png" style="display: inline-block;vertical-align: bottom;width: 1.6vw;height: 1.6vw">
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">介绍</p>
          <a :href="cityInfo.video" target="_blank" referrerpolicy="no-referrer">
            <p style="font-size: 1.4vw;display: inline-block;vertical-align: bottom;margin: 0px;" >
              :{{curCity}}
            </p>
          </a>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.info}}</p>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">自然风光</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.nature}}</p>
          <br/>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">景观</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.landscape}}</p>
          <br/>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">景观</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.landscape}}</p>
          <br/>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">名人</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.celebrity}}</p>
          <br/>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">特产</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.specialties}}</p>
          <br/>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">故事</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.story}}</p>
          <br/>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">民俗</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.folklore}}</p>
          <br/>
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">地理环境</p>
          <br/>
          <p style="text-indent: 2em;font-size: 1vmax;display: inline-block;vertical-align: bottom;margin: 0px">{{cityInfo.add}}</p>

        </div>
      </el-card>
      <el-card  class="box-card" id="info-box2" v-if="(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')&&deviceMode==0&&curCity!=''" >
          <span ><img src="../../assets/img/infoHead.png" style="display: inline-block;vertical-align: bottom;width: 1.6vmax;height: 1.6vmax">
            <p style="color: #77D1DD;display: inline-block;font-size: 1.4vmax;vertical-align: bottom;margin: 0px">介绍</p>
            <p style="font-size: 1.4vmax;display: inline-block;vertical-align: bottom;margin: 0px">:{{curCity}}</p>
          </span>
      </el-card>
<!--      诗歌-->
      <el-card  class="box-card" id="info-box3" v-if="(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')&&deviceMode==1&&curCity!=''" >
        {{poetryInfo.name}}
        <br/>
        作者: {{poetryInfo.author}}
        <div class="poetryList" v-for="i in poetryInfo.poetryList">
          {{i}}
        </div>

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
