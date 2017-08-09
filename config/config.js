module.exports = {
    appid: 'wx56dcb601dac325b4',
    secret: '16ab8277bb0ca5b3a86161f932f421c1',

    baseUrl: 'https://tjyx.weifengkeji.top/',
    api: {
        baseUrl: 'https://tjyx.weifengkeji.top/api/v1'
    },

    /**
     * 配送渠道
     */
    channel: {
        delivery: 0,
        self: 1
    },

    /**
     * 订单状态
     */
    orderStatus: {
        waiting: 1,
        cancelled: 2,
        init: 5,
        sent: 10,
        received: 15, 
        refund_requested: 20,
        refunded: 25
    }
}
