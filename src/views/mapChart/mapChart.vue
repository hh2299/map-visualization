<template>
  <div class="chart">
    <div class="box-card" id="main-box">



<!--      地图-->
    <div class="mapDiv">
      <div id="mapChart"
           :class="{mapChartBig:curMapName!='浙江'&&curMapName!='江苏'&&curMapName!='上海',
           mapChartSmall:curMapName!='china'&&deviceMode==1&&(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海'),
           mapChartPhone:curMapName!='china'&&deviceMode==0&&(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')}"
      >
      </div>

      <div class="mapChoose" >
        <div class="curCity" v-if="selectedMaps.length>1">{{selectedMaps[1].name}}</div>
      </div>
<!--      地区介绍-->
      <el-card  class="box-card" id="info-box" v-if="(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')&&deviceMode==1&&curLevel==2" >

        <div class="info">
          <img src="../../assets/img/infoHead.png">
          <p class="info_label_p">介绍:</p>
          <a :href="cityInfo.video" target="_blank" referrerpolicy="no-referrer" style="color: #584338;text-decoration: underline">
            <p class="info_label_city" >
              {{curCity}}
            </p>
          </a>
          <br/>
          <p class="info_p">{{cityInfo.info}}</p>
          <br/>
          <p class="info_label_p">自然风光</p>
          <br/>
          <p class="info_p">{{cityInfo.nature}}</p>
          <br/>
          <p class="info_label_p">景观</p>
          <br/>
          <p class="info_p">{{cityInfo.landscape}}</p>
          <br/>
          <p class="info_label_p">名人</p>
          <br/>
          <p class="info_p">{{cityInfo.celebrity}}</p>
          <br/>
          <p class="info_label_p">特产</p>
          <br/>
          <p class="info_p">{{cityInfo.specialties}}</p>
          <br/>
          <p class="info_label_p">故事</p>
          <br/>
          <p class="info_p">{{cityInfo.story}}</p>
          <br/>
          <p class="info_label_p">民俗</p>
          <br/>
          <p class="info_p">{{cityInfo.folklore}}</p>
          <br/>
          <p class="info_label_p">地理环境</p>
          <br/>
          <p class="info_p">{{cityInfo.add}}</p>

        </div>
      </el-card>
      <el-card  class="box-card" id="info-box2" v-if="(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')&&deviceMode==0&&curLevel==2" >
        <div class="info">
          <img src="../../assets/img/infoHead.png" style="display: inline-block;vertical-align: bottom;width: 1.6vw;height: 1.6vw">
          <p style="color: #77D1DD;display: inline-block;font-size: 1.4vw;vertical-align: bottom;margin: 0px">介绍</p>
          <a :href="cityInfo.video" target="_blank" referrerpolicy="no-referrer">
            <p style="font-size: 1.4vw;display: inline-block;vertical-align: bottom;margin: 0px;" >
              :{{curCity}}
            </p>
          </a>
          <br/>
          <p class="info_p">{{cityInfo.info}}</p>
          <br/>
          <p class="info_label_p">自然风光</p>
          <br/>
          <p class="info_p">{{cityInfo.nature}}</p>
          <br/>
          <p class="info_label_p">景观</p>
          <br/>
          <p class="info_p">{{cityInfo.landscape}}</p>
          <br/>
          <p class="info_label_p">名人</p>
          <br/>
          <p class="info_p">{{cityInfo.celebrity}}</p>
          <br/>
          <p class="info_label_p">特产</p>
          <br/>
          <p class="info_p">{{cityInfo.specialties}}</p>
          <br/>
          <p class="info_label_p">故事</p>
          <br/>
          <p class="info_p">{{cityInfo.story}}</p>
          <br/>
          <p class="info_label_p">民俗</p>
          <br/>
          <p class="info_p">{{cityInfo.folklore}}</p>
          <br/>
          <p class="info_label_p">地理环境</p>
          <br/>
          <p class="info_p">{{cityInfo.add}}</p>
        </div>

      </el-card>
<!--      诗歌-->
      <el-card  class="box-card" id="info-box3" v-if="(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')&&deviceMode==1&&curLevel==2" >
        <div class="poetry">
          <p style="letter-spacing: 0.3em">{{poetryInfo.name}}</p>
          <p style="letter-spacing: 0.2em">作者: {{poetryInfo.author}}</p>
          <div class="poetryList" v-for="i in poetryInfo.poetryList">
            <p style="letter-spacing: 0.2em">{{i}}</p>
          </div>
        </div>
      </el-card>
      <el-card  class="box-card" id="info-box4" v-if="(curMapName=='浙江'||curMapName=='江苏'||curMapName=='上海')&&deviceMode==0&&curLevel==2" >
        <div class="poetry">
          <p style="letter-spacing: 0.3em">{{poetryInfo.name}}</p>
          <p style="letter-spacing: 0.2em">作者bxo4: {{poetryInfo.author}}</p>
          <div class="poetryList" v-for="i in poetryInfo.poetryList">
            <p style="letter-spacing: 0.2em">{{i}}</p>
          </div>
        </div>
      </el-card>

    </div>


    </div>
  </div>
</template>

<script src="./mapChart.js"></script>


<style lang="less" scoped>
@import './mapChart.less';
</style>
