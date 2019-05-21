const vFilters = {
    orgFilter: (val) => {
        let returnName = ''
        switch (val) {
            case '10':
                return returnName= '家用空调'
            case '11':
                return returnName = '冰箱'
            case '12':
                return returnName = '洗衣机'
            case '13':
                return returnName = '中央空调'
            case '14':
                return returnName = '环境电器'
            case '15':
                return returnName = '生活电器'
            case '16':
                return returnName = '微清'
            case '17':
                return returnName = '厨房和热水'
            case '18':
                return returnName = '美的集团'
            case '19':
                return returnName = '代理商'
            case '20':
                return returnName = '清洁电器'
            case '21':
                return returnName = '高端品牌'
            default:
                break;
        }
    },

    formaTime(dateeee) {
        var time = new Date(dateeee);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        return y+'-'+ (m>9?m:'0'+m) +'-'+(d>9?d:'0'+d)
    },

    dynamicTFilter: (val) => {
        let dynamicType = ''
        switch (val) {
            case '1':
                return dynamicType= '提出了新问题'
            case '2':
                return dynamicType = '回答了问题'
            case '3':
                return dynamicType = '点赞了回答'
            default:
                break;
        }
    },

}

export default vFilters
