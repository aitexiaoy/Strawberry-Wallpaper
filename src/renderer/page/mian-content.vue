<template>
  <div class="main-content" @keydown.enter="keydown_enter_fn">
    <el-collapse-transition>
      <setter
        class="setter-content"
        :class="{'setter-content-mac':osType=='mac'}"
        v-show="setterShow"
        @imageSourceChange="image_source_change"
        @contentMouse="content_mouse"
        :get_data_flag="get_data_flag"
      ></setter>
    </el-collapse-transition>
    <!-- mac下显示三角 -->
    <div class="sanjiao" v-if="osType=='mac'"></div>

    <div class="image-main-content" :class="{'image-main-content-mac':osType=='mac'}">
      <div class="header">
        <el-row class="header-row-one">
          <div class="left">
            <h1 class="text">Strawberry</h1>
          </div>
          <div class="right">
            <i class="iconfont icon-wenjianjia" @click.stop="open_download_file"></i>
            <div class="header-set">
              <i class="iconfont icon-shezhi" @click.stop="setterShow=!setterShow"></i>
            </div>
          </div>
        </el-row>
        <div class="header-search">
          <el-input
            class="header-search-input"
            v-model="searchKey"
            placeholder="关键词[英文]"
            size="small"
            @focus="searchKeyFocus=true"
            @blur="searchKeyFocus=false"
          ></el-input>
          <i class="iconfont icon-sousuo" @click.stop="search_key_fn"></i>
        </div>
        <sw-progress v-if="progress>0" :value="progress" :color="currentImageBacColor"></sw-progress>
      </div>

      <div class="content" :class="{'content-win':osType=='win'}" @scroll="content_scroll">
        <div class="content-main" v-if="images.length>0">
          <div
            class="image-item"
            :ref="'image_item_'+index"
            v-for="(img,index) in images"
            :key="index"
            :class="{'image-item-img-first':index===0}"
            :style="{'backgroundColor':img.backgroundColor}"
            @mousemove.stop="currentMouseOverIndex=index,setterShow=false"
            @mouseleave.stop="currentMouseOverIndex=-1"
          >
            <div class="image-item-img" v-imagematch="img.url"></div>
            <div
              class="image-set-wallpaper"
              v-show="currentMouseOverIndex==index&&isSetting==false"
              @click.stop="set_wallpaper(img,index)"
            >
              <i class="iconfont icon-xianshiqi"></i>
              <span>设置壁纸</span>
            </div>

            <div class="image-item-flag" v-show="currentMouseOverIndex==index&&isSetting==false">
              <div class="image-item-flag-direction" v-show="img.directionColumn">
                <i class="iconfont icon-xiaoqing-tubiao-hengping"></i>
              </div>
              <div
                class="image-item-tip"
                :style="{'color':img.tip=='5k'?'#e0620d':img.tip=='4k'?'17abe3':'d3217b'}"
              >{{img.tip}}</div>
            </div>
          </div>
        </div>

        <div class="content-main-no" v-else @mousemove.stop="setterShow=false">
          <span v-if="get_data_flag==true">美好的事情即将发生...</span>
          <span v-else>暂时没有搜索到...</span>
        </div>
      </div>
    </div>

    <div class="refresh-btn" :class="{'refresh-btn-ing':refresh_btn_ing}">
      <i class="iconfont icon-shuaxin" @click="refresh_fn"></i>
    </div>
  </div>
</template>

<script>
//在渲染器进程 (网页) 中。

global.vue = null;

const shell = require("electron").shell;
const os = require("os");

import setter from "./setter.vue";
import swProgress from "./progress.vue";
import { request } from "http";

import { mkdirSync } from "../../file/file.js";
import { log } from "util";
import { clearTimeout } from "timers";
export default {
  name: "mainContent",
  components: {
    setter,
    swProgress
  },
  data() {
    return {
      currentMouseOverIndex: -1,
      currentWallpaperIndex: 0,
      searchKey: "",
      setterShow: false,
      isSetting: false,
      images: [],
      image_urls: [],
      hava_data_flag: true, //标记是否还有数据
      page: 0, //请求数据的页数
      get_data_flag: false, //标记页面是否正在请求数据
      searchKeyFocus: false,
      osType: "mac",
      image_source: "pexels",
      sendnewEmailLoading: false, //邮件发送loading
      progress: 0,
      currentImageBacColor: "#fff",
      refresh_btn_ing: false
    };
  },
  beforeCreate() {
    vue = this;
  },

  mounted() {
    //安装量的统计

    this.first_install();

    this.osType = os.type() == "Darwin" ? "mac" : "win";

    this.image_source =
      this.$localStorage.getStore("userConfig").imageSource || "pexels";
    Vue.$ipcRenderer.on("dataWallpaper", (event, arg) => {
      //设置一个时间记录最后更新的时间
      vue.$localStorage.setStore(
        "lastUpdataTime",
        parseInt(new Date().getTime() / 1000)
      );
      vue.isSetting = false;
      vue.$fbloading.close();
    });

    Vue.$ipcRenderer.on("datainfo", (event, arg) => {
      if (arg.type == "urls") {
        this.get_data_flag = false;
        this.refresh_btn_ing = false;
        if (arg.data.length == 0) {
          this.hava_data_flag = false;
          return;
        }
        if (this.page == 0) {
          this.images = [];
          this.image_urls = [];
        }
        vue.get_url_list(arg.data);
      } else if (arg.type == "windowShow") {
        if (arg.data) {
          this.setterShow = false;
        } else {
          this.setterShow = false;
        }
      } else if (arg.type == "updaterProgress") {
        this.progress = arg.data;
        if (this.progress >= 100) {
          let time = setTimeout(() => {
            clearTimeout(time);
            this.progress = 0;
          }, 1000);
        }
      }
    });

    Vue.$ipcRenderer.on("check_newVersion", (event, arg) => {
      console.log(arg);
      this.haveNewVersion(arg);
    });
    Vue.$ipcRenderer.on("sendnewEmail", (event, data, emailType, error) => {
      if (emailType == "初次安装") {
        this.sendnewEmailLoading = false;
        if (data == "success") {
          this.$localStorage.setStore(
            "first_install_flag",
            "strawberrywallpaper"
          );
        }
      }
    });

    this.searchKey = this.$localStorage.getStore("searchKey");

    this.images = [];
    this.image_urls = [];
    this.get_data();

    //30s执行一次
    window.setInterval(() => {
      this.wallpaperAuto();
      this.first_install();
    }, 6000);
  },

  methods: {
    keydown_enter_fn() {
      if (this.searchKeyFocus) {
        this.search_key_fn();
      }
    },

    first_install() {
      //如果不是第一次安装，发一封邮件
      if (
        this.$localStorage.getStore("first_install_flag") !=
        "strawberrywallpaper"
      ) {
        if (this.sendnewEmailLoading == true) {
          return;
        }
        let user_info = os.userInfo();
        let date = new Date();
        let html = `<h1>快来看啊！！！软件又有人安装了</h1><p>用户系统:<b>${os.type()}--${os.release()}--${os.hostname()}</b></p><p>用户名:<b>${
          user_info.username
        }</b></p><p>Uid:<b>${user_info.uid}</b></p><p>Homedir:<b>${
          user_info.homedir
        }</b></p><p>当前时间:<b>${date.getFullYear()}-${date.getMonth() +
          1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}</b></p>`;
        this.sendnewEmailLoading = true;
        this.$ipcRenderer.send("btn", {
          type: "newEmail",
          data: {
            html: html,
            telUser: "【软件初次安装】",
            emailType: "初次安装"
          }
        });
      }
      return;
    },

    randomColor() {
      return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
    },
    /*** 设置壁纸按钮 */
    set_wallpaper(img, index) {
      this.isSetting = true;
      this.setterShow = false;
      if (!this.$refs["image_item_" + index][0]) {
        return;
      }
      this.$fbloading.open(this.$refs["image_item_" + index][0]);
      Vue.$ipcRenderer.send("dataWallpaper", img);
      this.currentWallpaperIndex = index;
      this.currentImageBacColor = this.images[index].backgroundColor;
    },
    open_download_file() {
      // shell.showItemInFolder(os.homedir()+'/Downloads/');
      mkdirSync(os.homedir() + "/Downloads/wallpaper"); //判断是否有文件夹
      shell.openItem(os.homedir() + "/Downloads/wallpaper");
    },
    image_tip(width, height) {
      let val = parseInt(width) * parseInt(height);
      if (val > 5120 * 2880) {
        return "5k";
      } else if (val > 3840 * 2160) {
        return "4k";
      } else {
        return "2k";
      }
    },

    image_direction(width, height) {
      return width >= height ? false : true;
    },

    //刷新
    refresh_fn() {
      if (this.refresh_btn_ing == false) {
        this.destroy_all();
        this.page = 0;
        this.images = [];
        this.image_urls = [];
        this.get_data();
      }
      this.refresh_btn_ing = true;
    },

    //中断所有的请求
    destroy_all() {
      this.progress = 0;
      vue.isSetting = false;
      this.setterShow = false;
      vue.$fbloading.close();
      Vue.$ipcRenderer.send("cancelAllRequest", true); //取消所有请求
    },

    content_mouse(val) {
      // this.setterShow=val;
    },

    /** 壁纸自动更新 */
    wallpaperAuto() {
      let userConfig = this.$localStorage.getStore("userConfig");
      //如果正在设置,则弹出去
      if (this.isSetting == true || this.images.length == 0) {
        return;
      }
      if (
        this.hava_data_flag &&
        this.currentWallpaperIndex == this.images.length - 5
      ) {
        this.page = this.page + 1;
        this.get_data();
      }
      if (userConfig.wallpaperAutoUp == true) {
        if (this.$localStorage.getStore("lastUpdataTime")) {
          let current_time = parseInt(new Date().getTime() / 1000);
          if (!isNaN(parseInt(userConfig.updataTime))) {
            if (
              Math.abs(current_time -parseInt(this.$localStorage.getStore("lastUpdataTime"))) > parseInt(userConfig.updataTime)
            ) {
              let index = this.images[this.currentWallpaperIndex + 1]? this.currentWallpaperIndex + 1: 0;
              this.set_wallpaper(this.images[index], index);
            }
          }
        }
      }
    },

    /** 搜索按钮 */
    search_key_fn() {
      if (this.searchKey == this.$localStorage.getStore("searchKey")) {
        return;
      }
      this.$localStorage.setStore("searchKey", this.searchKey);
      destroy_all();
      this.page = 0;
      this.images = [];
      this.image_urls = [];
      this.get_data();
    },
    image_source_change(val) {
      this.image_source = val;
      this.page = 0;
      this.images = [];
      this.image_urls = [];
      this.get_data();
    },

    get_url_list(urls) {
      this.urls_deal(urls);
    },
    /*** 对获取到的地址进行处理 */
    urls_deal(urls) {
      urls.forEach(e => {
        if (this.image_urls.indexOf(e.url) == -1) {
          let obj = {
            url: e.url,
            name: "",
            tip: vue.image_tip(e.width, e.height),
            directionColumn: vue.image_direction(e.width, e.height),
            downloadUrl: e.downloadUrl,
            width: e.width,
            height: e.height,
            backgroundColor: vue.randomColor()
          };
          this.image_urls.push(e.url);
          this.images.push(obj);
        }
      });
    },

    /*** 滚动条事件,请求下一页 */
    content_scroll(event) {
      let el = event.srcElement || event.target;
      if (this.hava_data_flag == true && this.get_data_flag == false) {
        if (
          el.scrollTop + 1800 >
          el.querySelector(".content-main").clientHeight
        ) {
          this.page = this.page + 1;
          this.get_data();
        }
      }
    },
    get_data() {
      this.get_data_flag = true;
      let obj = {
        searchKey: this.searchKey,
        page: this.page,
        imageSource: this.image_source
      };
      Vue.$ipcRenderer.send("getImageUrls", obj);
    },
    haveNewVersion(newVersion) {
      this.$confirm(newVersion, "版本检测", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info"
      })
        .then(() => {
          Vue.$ipcRenderer.send("btn", {
            type: "updataNewVersion"
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.image-main-content {
  border-radius: 6px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: rotate(0deg);
}

.sanjiao {
  width: 100%;
  height: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
  background-color: transparent;
}

.sanjiao::before {
  content: "";
  width: 0;
  height: 0;
  border-width: 0 10px 10px;
  border-style: solid;
  border-color: transparent transparent rgb(37, 33, 33);
  /*透明 透明  灰*/
}

.setter-content {
  top: 44px;
}

.setter-content-mac {
  top: 54px;
}

.image-main-content-mac {
  height: calc(100% - 10px);
}

.main-content {
  // padding-top: 30px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;

  background-color: transparent;

  // background-color: red;
  .header {
    position: fixed;
    width: 100%;
    height: 96px;
    z-index: 3000;
    padding-left: 20px;
    padding-right: 20px;
    background-color: rgba(34, 34, 34, 0.9);
    overflow: hidden;

    .header-row-one {
      display: flex;
      width: 100%;
      height: 56px;
      justify-content: space-between;

      .left {
        position: relative;
        width: 100%;
        height: 100%;

        .text {
          color: rgba(255, 255, 255, 0.9);
          cursor: default;
          user-select: none;
          // z-index: 2;
          // -webkit-text-fill-color: transparent;
          // -webkit-background-clip: text;
          // -webkit-text-stroke: 2px rgba(255,255,255,0.9);
        }
      }
    }

    .iconfont {
      color: #fff;
      margin-left: 10px;
    }

    .left {
      flex: auto;
    }

    .right {
      flex: none;
      display: flex;
      align-items: center;
    }

    .header-set {
      position: relative;
    }

    .header-search {
      width: 100%;
      display: flex;
      align-items: center;
      position: relative;

      .header-search-input {
        width: 100%;
        flex: none;
      }

      .iconfont {
        position: absolute;
        right: 5px;
      }
    }
  }

  .header::before {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    filter: blur(50px);
    /* opacity: 0.9; */
    background-color: rgba(37, 31, 30, 0.9);
  }

  .image-item-img-first {
    margin-top: 95px;
  }

  .content {
    width: calc(~"100% + 15px");
    height: 100%;
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 1px;
    background-color: #222222;
    border-radius: 5px;

    .image-item {
      width: 100%;
      height: 180px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-bottom: 1px solid #bbb;

      .image-item-img {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .image-set-wallpaper {
        position: absolute;
        background-color: rgba(0, 0, 0, 0.4);
        width: auto;
        height: 33px;
        width: 120px;
        line-height: 33px;
        cursor: default;
        color: #fff;
        text-align: center;
        border-radius: 15px;

        .iconfont {
          margin-right: 8px;
        }
      }

      .image-set-wallpaper:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }

      .image-item-flag {
        position: absolute;
        top: 10px;
        right: 14px;
        display: flex;
        justify-content: flex-end;
        width: auto;
        height: 26px;

        .image-item-flag-direction {
          width: 26px;
          height: 26px;
          border-radius: 4px;
          color: #fff;
          background-color: rgba(0, 0, 0, 0.6);
          line-height: 26px;
          text-align: center;
          cursor: default;
          font-size: 12px;
          margin-right: 10px;
        }

        .image-item-tip {
          width: 26px;
          height: 26px;
          border-radius: 4px;
          color: #52b7fc;
          background-color: rgba(0, 0, 0, 0.6);
          line-height: 26px;
          text-align: center;
          cursor: default;
          font-size: 12px;
        }
      }

      .image-item-tip {
        width: 26px;
        height: 26px;
        border-radius: 4px;
        color: #52b7fc;
        background-color: rgba(0, 0, 0, 0.6);
        line-height: 26px;
        text-align: center;
        cursor: default;
        font-size: 12px;
      }
    }
  }

  .content-win {
    width: calc(~"100% + 17px");
  }

  .content-main-no {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    color: #ccc;
    font-size: 12px;
  }
}
.refresh-btn {
  position: fixed;
  z-index: 999;
  left: 16px;
  bottom: 16px;
  color: #fff;
  .iconfont {
    font-size: 24px;
  }
}
.refresh-btn-ing {
  animation: refreshbtning 1.5s linear infinite;
  transform-origin: center center;
  transform: rotate(360deg);
}
@keyframes refreshbtning {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0);
  }
}
</style>

<style lang="less">
.main-content {
  .el-input__inner {
    border: none;
    background-color: #383838;
    color: #a5a5a5;
  }

  ::-webkit-input-placeholder {
    /* WebKit browsers */
    color: #8a8484;
  }
}
</style>
