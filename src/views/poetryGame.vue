<template>
  <div class="chart pt-10" >
    <el-card class="box-card" id="main-box">
      <el-container>
        <el-aside width="15vw">
          <div class="stage">
            <img src="../assets/img/stageIcon.png" style="height: 2vw;width: 2vw;display: inline-block;vertical-align: top;margin-top: 0.2vh">
            <p style="display: inline-block;vertical-align: top;margin: 0.2vh">关卡{{curStage+1}}</p>
          </div>
        </el-aside>
        <el-container>
          <el-header height="15vh">
            <div class="stage_name">
              {{stageList[curStage].name}}
            </div>
            <div class="stage_author">
                {{stageList[curStage].author}}
              </div>
          </el-header>
          <el-main >
            <div class="plate" v-for="(verse,i) in tempMatrix" >
                <div class="verse" v-for="(word,j) in verse.wordList" >
                  <div class="word" v-if="verse.hideIndex!=j" ><p>{{word}}</p></div>
                  <div :class="{blue:selectRect[0]==i,green:verse.success==true,red:verse.success==false&&word.length>0,white:verse.success==false&&word.length==0&&selectRect[0]!=i}"
                       v-else @click="clickInput(i,j)"><p>{{word}}</p></div>
                </div>
              </div>
          </el-main >
          <el-footer height="15vh">
            <div class="answer" v-for="(item,index) in hideArr"  >
                        <div @click="clickItem(index)" class="answer_item">
                          <p>{{item}}</p>
                        </div>
                      </div>
          </el-footer>
        </el-container>
        <el-aside width="15vw">
<!--          占位置的-->
        </el-aside>
      </el-container>



    </el-card>
  </div>
</template>

<script>
export default {
  name: "PoetryGame",
  mounted() {
    this.curStage = 0
    this.initGame()
  },
  data(){
    return{
      curStage:0,//当前关卡
      block_num_c:5,//行内字数
      block_num_r:2,//古诗行数
      block_size: 0,
      border_width:0.04,
      matrix:{

      },

      stageList:[{
        name:'静夜思',
        author:'李白',
        poetryList:['床前明月光',
          '疑是地上霜',
          '举头望明月',
          '低头思故乡'],
      },
        {
          name:'元日',
          author:'王安石',
          poetryList:['爆竹声中一岁除','春风送暖入屠苏',
                  '千门万户曈曈日','总把新桃换旧符'
          ],
        }
      ],
      tempMatrix:[],
      hideArr:[],
      gameVisible:false,
      selectRect:[-1,-1],//当前选中的输入框
      isAllAnswer:false // 是否全答完
    }
  },
  methods:{
    // 初始
    initGame(){
      this.tempMatrix=[]
      this.hideArr = []
      let curStagePoetry = this.stageList[this.curStage].poetryList
      for (let i=0;i<curStagePoetry.length;i++){
        let verseNWord = curStagePoetry[i].length
        let randInt = Math.floor(Math.random()*(verseNWord))
        let wordList = [...curStagePoetry[i].split("")]
        console.log(wordList)
        wordList[randInt] = ''
        let tmp = {
          wordList:wordList,
          selectIndex:null,//选中的那个Hide的Index
          hideIndex:randInt,//需要填的索引
          success:false
        }
        this.tempMatrix.push(tmp)
        this.hideArr.push(curStagePoetry[i].charAt(randInt))
      }
      this.hideArr = this.shuffle(this.hideArr)
      this.selectRect = [0,this.tempMatrix[0].hideIndex]
      this.$forceUpdate()
    },
    //单击备选字事件
    clickItem(index){
      let verse = this.tempMatrix[this.selectRect[0]]
      let word = verse.wordList[this.selectRect[1]]
      let oldSelectIndex = verse.selectIndex
      if (this.hideArr[index].length>0){
        //备选有字
        if (oldSelectIndex!=null){
          //输入原来有字，把字还回去
          this.hideArr[oldSelectIndex] = word
        }
        this.tempMatrix[this.selectRect[0]].wordList[this.selectRect[1]] = this.hideArr[index]
        this.hideArr[index] = ''
        this.tempMatrix[this.selectRect[0]].selectIndex = index
        this.checkItemSuccess(this.selectRect[0])
        this.getNextInput(this.selectRect[0])
      }
      this.$forceUpdate()
    },
    //单机输入事件
    clickInput(verseN,wordN){
      let verse = this.tempMatrix[verseN]
      let curVerse = verse.wordList
      let selectIndex = verse.selectIndex
      if (curVerse[wordN].length==0){
        //无字输入
        this.selectRect = [verseN,wordN]
      }else {
        this.hideArr[selectIndex] = this.tempMatrix[verseN].wordList[wordN]
        this.tempMatrix[verseN].wordList[wordN] = ''
        this.tempMatrix[verseN].selectIndex = null
        this.checkItemSuccess(verseN)
        this.selectRect=[verseN,wordN]
      }

      this.$forceUpdate()
    },
    getNextInput(oldVerseN){
      console.log("next")
      let size = this.tempMatrix.length
      let newVerseN = oldVerseN + 1
      while(true){
        console.log(newVerseN)
        if (newVerseN > size-1){
          newVerseN = 0
        }
        let tmp = this.tempMatrix[newVerseN].selectIndex
        console.log(tmp)
        if (tmp == null){
          this.selectRect = [newVerseN,this.tempMatrix[newVerseN].hideIndex]
          return
        }
        newVerseN++
        if (newVerseN==oldVerseN){
          console.log('aaaa')
          this.isAllAnswer = true
          this.selectRect = [-1,-1]
          this.checkSuccess()
          return;
        }
      }

    },
    checkItemSuccess(index) {
      let a = this.tempMatrix[index].wordList.toString()
      let b = this.stageList[this.curStage].poetryList[index].split("").toString()
      console.log(a)
      console.log(b)
      if(a==b){
        this.tempMatrix[index].success = true
        console.log(true)
      }else {
        this.tempMatrix[index].success = false
        if (a.length==b.length){
          this.$alert('你错了', '温馨提示', {
            showConfirmButton:false,
            callback: action => {

            }
          })
        }
      }
    },
    checkSuccess() {
      console.log('checkSuccess')
      for (let i=0;i<this.tempMatrix.length;i++){
        if (this.tempMatrix[i].success==false)
          return
      }
      let tempCurStage = this.curStage+1;
      if (tempCurStage==this.stageList.length){
        //通关
        // this.curStage = 0
        this.$confirm('完成所有游戏，是否返回上级挑战更多游戏？', '答题正确', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.$router.go(-1)
          this.curStage = 0;
        }).catch(() => {

        });
      }else {
        this.$confirm('是否挑战下一关？', '答题正确', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true,
        }).then(() => {
          this.curStage = tempCurStage
          this.initGame()
          this.$forceUpdate()
        }).catch(() => {

        });;
      }

    },
    shuffle(arr){
      let l = arr.length
      let index, temp
      while(l>0){
        index = Math.floor(Math.random()*l)
        temp = arr[l-1]
        arr[l-1] = arr[index]
        arr[index] = temp
        l--
      }
      return arr
    }
  }
}
</script>

<style lang="less">

.chart {
  height: 100vh;
  background-image: linear-gradient(to bottom, white, powderblue);
  //background-size: 100vh 100vw;

  .el-aside {
    text-align: center;
    height: 85vh;
    .stage {
      border-radius: 2.2vw;
      height: 2.2vw;
      width: fit-content;
      background-color: #97D3E0;
      font-size: 1.4vw;
      padding-right: 0.6vw;
      padding-left: 0.6vw;
      letter-spacing: 0.4vw;
      margin-top: 1vh;
      margin-left: 1vw;
    }
  }

  .el-header {
    text-align: center;
    .stage_name {
      display: block;
      font-size: 2.2vw;
      margin-top: 1vh;
      width: inherit;
    };
    .stage_author{
      display: block;
      font-size: 1.6vw;
      margin-top: 1vh;
    }
  }

  .el-main {
    text-align: center;
    .plate{
      display: block;
      margin-bottom: 3.2vh;
      margin-top: 2vh;
      height: 9vh;
      .verse {
        width: 4.2vw;
        height: 2.2vw;
        display: inline-block;
        padding-left: 1vw;
        padding-right: 1vw;
        text-align: center;
        p {
          margin-top: 0px;
          margin-bottom: 0px;
          color: #000000;
          font-size: 2vw;
          vertical-align: top;
        }

        .word {
          display: inline-block;
          width: 2.2vw;
          height: 2.2vw;
          vertical-align: top;
        }

        .blue {
          color: #000000;
          border: solid 2px blue;
          display: inline-block;
          width: 2.4vw;
          height: 2.4vw;
          vertical-align: top;
        }

        .green {
          color: #eeeeee;
          border: solid 2px #0f0;
          display: inline-block;
          width: 2.4vw;
          height: 2.4vw;
          vertical-align: top;
        }

        .red {
          color: #eeeeee;
          border: solid 2px #f00;
          display: inline-block;
          width: 2.4vw;
          height: 2.4vw;
          vertical-align: top;
        }

        .white {
          color: #000000;
          border: solid 2px #000;
          display: inline-block;
          width: 2.4vw;
          height: 2.4vw;
          vertical-align: top;
        }
      }
    }
  }

  .el-footer {
    text-align: center;
    .answer {
      display: inline-block;
      text-align: center;
      padding: 0;
      height: 5vh;

      vertical-align: bottom;
      .answer_item {
        width: 4vw;
        height: 5vh;
        vertical-align: bottom;
        p {
              margin-top: 0px;
              color: #000000;
              font-size: 2vw;
            }
      }

      //.answer_item {
      //  p {
      //    margin-top: 0px;
      //    margin-bottom: 0px;
      //    color: #000000;
      //    font-size: 4vh;
      //  }
      //}
    }



  }
}
#main-box {
  margin-left: 5vw;
  margin-top: 5vh;
  margin-bottom: 5vh;
  width: 90vw;
  border-radius: 5vh;
  height: 90vh;

}
.el-message-box{
  width: 30vw;
  .el-message-box__header{
    .el-message-box__title{
      float: left;
      letter-spacing: 0.1vw;
      font-size: 1.4vmax;
    }
    .el-message-box__headerbtn{
      background-color: #97D3E0;
      border-radius: 2.4vh;
      height: 2.4vh;
      width: 2.4vh;
    }
  }
  .el-message-box__message p{
    line-height: 1.6vmax;
  }
  .el-message-box__content{
    margin-top: 5vh;
    text-align: center;
    font-size: 1.2vmax;
    letter-spacing: 0.3vmax;
  }
  border-radius: 3vh;
  .el-message-box__btns{
    margin-top: 5vh;
    padding: 0px;
    .el-button{
      border-radius: 1vh;
      font-size: 3vh;
      width: 8vmax;
      height: 5vh;
      float: right;
      margin-right: 4vw;
      letter-spacing: 1vh;
    }
    .el-button--primary{
      border-radius: 1vh;
      font-size: 3vh;
      width: 8vmax;
      float: left;
      margin-left: 4vw;
      background-color: #97D3E0;
      border-color: #97D3E0;
      letter-spacing: 1vh;
    }
  }
  //.el-icon-my-return{
  //  background: url('../assets/images/导出.png') no-repeat;
  //  font-size: 16px;
  //  background-size: cover;
  //}
}
</style>
