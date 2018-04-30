module.exports = (function () {
    var config = {
        'development': {
            'api': 'http://dev.rednose.com.br',
            'token': 'ZQMMVHIHZSKDRRDXWXVAOXZCLJTRVEKNDVZRBCRGGQYDPVPOESBNUFUKOSFAXHKP'
        },
        'production': {
            'api': 'https://dev.rednose.com.br',
            'token': 'CGRGDHIQTJVZYUBEAFJYMUMREHPQHBUSCYNWGEOHTENXDRJMVPBQZDIXKCRGLCPX'
        },
    };

    var ENV = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';
    return config[ENV];

})();
