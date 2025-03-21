import { message } from "antd";
 
export default class ShowMessage {
    static success(options,ss = 2) {
        this.message('success', options,ss)
    }
 
    static warning(options,ss = 2) {
        this.message('warning', options,ss)
    }
 
    static info(options,ss = 2) {
        this.message('info', options,ss)
    }
 
    static error(options,ss = 2) {
        this.message('error', options,ss)
    }
 
    static message(type, options,ss = 2) {
        const messageDom = document.getElementsByClassName('ant-message')[0]
        // console.log(messageDom,'a');
        if (messageDom === undefined) {
            message[type](options,ss)
        } else {
            // message.closeAll()
            message.destroy()
            message[type](options,ss)
        }
    }
}