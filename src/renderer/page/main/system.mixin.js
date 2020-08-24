import { getSystemInfo, utils } from '$render/utils'
import { postRegister, apiStatisticActive } from '$render/api'

const { version, deletePath } = utils

let time = 0
const ActiveDayTime = 60 * 60 * 1000 // 1小时


export default {
    mounted() {
        this.$nextTick(() => {
            // 安装量的统计
            this.firstInstall()
            this.systemMainEvent()

            this.statisticActiveDayNumber()

            this.$once('hook:beforeDestroy', () => {
                this.$ipcRenderer.removeAllListeners('intervalTime')
                clearTimeout(time)
            })
        })
    },
    methods: {

        // 绑定系统事件
        systemMainEvent(){
            /**
             * 定时器
             */
            this.$ipcRenderer.on('intervalTime', (event, arg) => {
                // 自动设置壁纸
                this.wallpaperAuto()
                // 第一次注册
                this.firstInstall()

                this.autoClearDownloadFiles()
            })
        },

        /**
         * 检测首次安装
         * @function firstInstall
         */
        async firstInstall() {
            if (this.$localStorage.getStore('first_install_flag_v1.1.1') !== 'strawberrywallpaper') {
                await getSystemInfo().then(({ data }) => {
                    postRegister(data).then((res) => {
                        this.$localStorage.setStore('osInfo', data)
                        this.$localStorage.setStore('osInfoUid', data.uid)
                        this.$localStorage.setStore('first_install_flag_v1.1.1', 'strawberrywallpaper')
                    })
                }) 
            }
        },

        /**
         * 统计日活
         */
        statisticActiveDayNumber(){
            const uid = this.$localStorage.getStore('osInfoUid')
            apiStatisticActive({
                uid,
                version
            }).finally(() => {
                time = setTimeout(() => {
                    clearTimeout(time)
                    this.statisticActiveDayNumber()
                }, ActiveDayTime)
            })
        },

        /**
         * 自动清空下载目录
         */
        autoClearDownloadFiles(){
            const nowDate = +new Date()
            const lastCleararnDownloadFilesTime = this.$localStorage.getStore('lastCleararnDownloadFilesTime')
            if (!lastCleararnDownloadFilesTime) {
                this.$localStorage.setStore('lastCleararnDownloadFilesTime', nowDate)
            }

            // 7天 自动清除已下载
            if (nowDate - lastCleararnDownloadFilesTime >= (this.config.autoClearnDownloadFilesTime) * 24 * 60 * 60 * 1000) {
                this.$localStorage.setStore('lastCleararnDownloadFilesTime', nowDate)
                // 删除默认文件下的所有内容
                deletePath(this.config.downloadImagePath)
            }
        }, 

        /** 壁纸自动更新 */
        async wallpaperAuto() {
            // 如果正在设置,则弹出去
            if (this.isSetting === true || this.images.length === 0) {
                return
            }
        
            // 如果设置了自动设置壁纸
            if (this.config.wallpaperAutoUp === true) {
                // 自动设置壁纸的时候还剩下5张就请求下一页
                if (this.currentWallpaperIndex === this.images.length - 5) {
                    this.page = this.page + 1
                    await this.getData()
                }
            
                const currentTime = +new Date()
                const lastUpdataTime = this.$localStorage.getStore('lastUpdataTime') || 0
                const updataTime = this.config.updataTime || 0
                if (Math.abs(currentTime - lastUpdataTime) > updataTime) {
                    const index = this.images[this.currentWallpaperIndex] ? this.currentWallpaperIndex : 0
                    this.setWallpaper(this.images[index], index)
                }
            }
        },
    }
}
