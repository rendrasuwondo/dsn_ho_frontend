export default {
    // Target Deployment
    target: 'server',

    // SSR
    ssr: true,

    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: 'erp-ho-frontend',
        bodyAttrs: {
            class: 'sidebar-mini'
        },
        htmlAttrs: {
            lang: 'en',
        },
        meta: [{
            charset: 'utf-8',
        },
        {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1',
        },
        {
            hid: 'description',
            name: 'description',
            content: '',
        },
        {
            name: 'format-detection',
            content: 'telephone=no',
        },
        ],
        link: [{
            rel: 'icon',
            type: 'image/x-icon',
            href: '/favicon.ico',
        },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap',
        },
        ],
        script: [{
            src: '/js/jquery/jquery.min.js',
        },
        {
            src: '/js/bootstrap/js/bootstrap.bundle.min.js',
        },
        {
            src: '/js/adminlte.min.js',
        },
        {
            src: '/js/demo.js',
        },
        ],
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/css/fontawesome-free/css/all.min.css',
        '@/assets/css/adminlte.min.css',
        // '@/assets/css/loading.css',

    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
      { src: '@/plugins/vue-number-format.js', ssr: true },
      { src: '@/plugins/chart.js', ssr: false }
    ],
            //   { src: '@/plugins/chart.js',ssr:false}],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/bootstrap
        'bootstrap-vue/nuxt',
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        //https://auth.nuxtjs.org/
        '@nuxtjs/auth-next',
        //https://github.com/maulayyacyber/nuxt-vue-multiselect
        'nuxt-multiselect',
        //https://github.com/avil13/vue-sweetalert2
        'vue-sweetalert2/nuxt',
        // Simple usage
        'cookie-universal-nuxt',
    ],
    middleware: ['auth'],

    auth: {
        strategies: {
            local: {
                token: {
                    property: 'token',
                    required: true,
                    type: 'Bearer',
                },
                user: {
                    property: false,
                    // property: 'employee',
                    // autoFetch: true
                },

                endpoints: {
                    login: {
                        url: '/api/admin/login',
                        method: 'post',
                    },
                    logout: {
                        url: '/api/admin/logout',
                        method: 'post',
                    },
                    user: {
                        url: '/api/admin/user',
                        method: 'get',
                    },
                },
            },
        },
        redirect: {
            login: '/erp_ho/login',
            logout: '/erp_ho/login',
            callback: '/erp_ho/login',
            home: '/erp_ho/main/dashboard',
        },

    },

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
         baseURL: 'http://192.168.202.119:8004',
        //   baseURL: 'http://localhost:8000'
    },

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {},

    publicRuntimeConfig: {
      grievanceBaseURL: 'http://192.168.202.118:86/grievance',
      // grievanceBaseURL: 'http://localhost/grievance',
    },

    // router: {
    //     base: process.env.MODE == "DEV" ? "/elhm" : "/elhm",
    //     /* mode: 'hash', */

    //   },

}
