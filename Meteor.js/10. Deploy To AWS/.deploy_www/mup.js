module.exports = {
    servers: {
        one: {
            // note since we do not have a static IP yet, this will change every time the server boots up
            host: '13.245.87.151',
            username: 'ubuntu',
            pem: './key.pem',
        },
    },

    app: {
        // TODO: change app name and path
        name: 'microblogging-tutorial',
        path: '../',

        servers: {
            one: {},
        },

        // All options are optional.
        buildOptions: {
            // Set to true to skip building mobile apps
            // but still build the web.cordova architecture. (recommended)
            serverOnly: true,

            executable: 'meteor',
        },

        env: {
            // TODO: Change to your app's url
            // If you are using ssl, it needs to start with https://
            ROOT_URL: 'http://18.208.136.109',
            MONGO_URL: process.env.MONGO_URL,
        },
        deployCheckWaitTime: 120,

        docker: {
            image: 'momenysr/meteor:root',
        },

        enableUploadProgressBar: true,
    },
};
