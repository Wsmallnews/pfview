import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
    {
        path: '/login',
        name: 'login',
        meta: {
          title: 'Login - 登录',
          hideInMenu: true
        },
        component: () => import('@/view/login/login.vue')
    },
    {
        path: '/',
        name: '_home',
        redirect: '/home',
        component: Main,
        meta: {
            hideInMenu: true,
            notCache: true
        },
        children: [
            {
                path: '/home',
                name: 'home',
                meta: {
                    hideInMenu: true,
                    title: '首页',
                    notCache: true,
                    icon: 'md-home'
                },
                component: () => import('@/view/single-page/home')
            }
        ]
    },
    {
        path: '/adminManage',
        name: 'adminmanage',
        meta: {
            icon: 'md-cloud-upload',
            title: '管理设置'
        },
        component: Main,
        children: [
            {
                path: 'admins',
                name: 'adminmanage-admins',
                meta: {
                    icon: 'ios-document',
                    title: '管理员管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-admins-index',
                        meta: {
                            icon: 'ios-document',
                            title: '管理员管理'
                        },
                        component: () => import('@/view/admin-manage/admins/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'adminmanage-admins-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-document',
                            title: '管理员添加'
                        },
                        component: () => import('@/view/admin-manage/admins/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'adminmanage-admins-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-document',
                            title: '管理员编辑'
                        },
                        component: () => import('@/view/admin-manage/admins/add-edit.vue')
                    },
                    {
                        path: 'resetPassword/:id',
                        name: 'adminmanage-admins-resetpassword',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-document',
                            title: '管理员编辑'
                        },
                        component: () => import('@/view/admin-manage/admins/reset-password.vue')
                    },
                    {
                        path: 'setRole/:id',
                        name: 'adminmanage-admins-setrole',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-document',
                            title: '设置角色'
                        },
                        component: () => import('@/view/admin-manage/admins/set-role.vue')
                    },
                ]
            },
            {
                path: 'roles',
                name: 'adminmanage-roles',
                meta: {
                    icon: 'ios-document',
                    title: '角色管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-roles-index',
                        meta: {
                            icon: 'ios-document',
                            title: '角色管理'
                        },
                        component: () => import('@/view/admin-manage/roles/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'adminmanage-roles-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-document',
                            title: '角色添加'
                        },
                        component: () => import('@/view/admin-manage/roles/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'adminmanage-roles-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-document',
                            title: '角色编辑'
                        },
                        component: () => import('@/view/admin-manage/roles/add-edit.vue')
                    },
                    {
                        path: 'givePerm/:id',
                        name: 'adminmanage-roles-giveperm',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-document',
                            title: '分配权限'
                        },
                        component: () => import('@/view/admin-manage/roles/give-perm.vue')
                    },
                ]
            },
            {
                path: 'adminLogs',
                name: 'adminmanage-adminlogs',
                meta: {
                    icon: 'ios-document',
                    title: '操作日志'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-adminlogs-index',
                        meta: {
                            icon: 'ios-document',
                            title: '操作日志'
                        },
                        component: () => import('@/view/admin-manage/admin-logs/index.vue')
                    },
                ]
            }
        ]
    },







    {
        path: '/401',
        name: 'error_401',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/401.vue')
    },
    {
        path: '/500',
        name: 'error_500',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/500.vue')
    },
    {
        path: '*',
        name: 'error_404',
        meta: {
            hideInMenu: true
        },
        component: () => import('@/view/error-page/404.vue')
    }
]
