
import osu from 'node-os-utils'
import macaddress from 'macaddress'
import { version } from '../../package'
import { md5_32 as md5 } from './md5'


const getSystemInfo = function (){
    function getMacAddress() {
        return new Promise((resolve, reject) => {
            macaddress.one((err, mac) => {
                if (err) {
                    reject()
                } else {
                    resolve(mac)
                }
            })
        })
    }
    return new Promise((resolve, reject) => {
        Promise.all([osu.osCmd.whoami(), osu.os.oos(), osu.os.arch(), getMacAddress()]).then((result) => {
            const [userName, oss, arch, mac] = result
            const time = (new Date()).getTime()
            const data = {
                username: userName.replace('\n', '').replace('\r', ''), // 用户名
                version, // 软件版本
                uid: md5(`${userName}${oss}${arch}${mac}`), // 软件唯一ID,
            }
            resolve({
                ...result,
                data
            })
        })
    })
}

export default getSystemInfo
