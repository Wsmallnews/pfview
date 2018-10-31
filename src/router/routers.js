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
            icon: 'md-cog',
            title: '管理设置'
        },
        component: Main,
        children: [
            {
                path: 'admins',
                name: 'adminmanage-admins',
                meta: {
                    icon: 'md-person',
                    title: '管理员管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-admins-index',
                        meta: {
                            icon: 'md-person',
                            title: '管理员管理'
                        },
                        component: () => import('@/view/admin-manage/admins/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'adminmanage-admins-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '管理员添加'
                        },
                        component: () => import('@/view/admin-manage/admins/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'adminmanage-admins-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '管理员编辑'
                        },
                        component: () => import('@/view/admin-manage/admins/add-edit.vue')
                    },
                    {
                        path: 'resetPassword/:id',
                        name: 'adminmanage-admins-resetpassword',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-build',
                            title: '管理员重置密码'
                        },
                        component: () => import('@/view/admin-manage/admins/reset-password.vue')
                    },
                    {
                        path: 'setRole/:id',
                        name: 'adminmanage-admins-setrole',
                        meta: {
                            hideInMenu: true,
                            icon: 'ios-build',
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
                    icon: 'md-person',
                    title: '角色管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-roles-index',
                        meta: {
                            icon: 'md-person',
                            title: '角色管理'
                        },
                        component: () => import('@/view/admin-manage/roles/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'adminmanage-roles-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '角色添加'
                        },
                        component: () => import('@/view/admin-manage/roles/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'adminmanage-roles-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-person-add',
                            title: '角色编辑'
                        },
                        component: () => import('@/view/admin-manage/roles/add-edit.vue')
                    },
                    {
                        path: 'givePerm/:id',
                        name: 'adminmanage-roles-giveperm',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-settings',
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
                    icon: 'md-list-box',
                    title: '操作日志'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-adminlogs-index',
                        meta: {
                            icon: 'md-list-box',
                            title: '操作日志'
                        },
                        component: () => import('@/view/admin-manage/admin-logs/index.vue')
                    },
                ]
            },
            {
                path: 'cronLogs',
                name: 'adminmanage-cronlogs',
                meta: {
                    icon: 'md-list-box',
                    title: '计划任务'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'adminmanage-cronlogs-index',
                        meta: {
                            icon: 'md-list-box',
                            title: '计划任务'
                        },
                        component: () => import('@/view/admin-manage/cron-logs/index.vue')
                    },
                ]
            }
        ]
    },
    {
        path: '/productManage',
        name: 'productmanage',
        meta: {
            icon: 'md-apps',
            title: '产品管理'
        },
        component: Main,
        children: [
            {
                path: 'products',
                name: 'productmanage-products',
                meta: {
                    icon: 'md-apps',
                    title: '产品管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'productmanage-products-index',
                        meta: {
                            icon: 'md-apps',
                            title: '产品管理'
                        },
                        component: () => import('@/view/product-manage/products/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'productmanage-products-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '产品添加'
                        },
                        component: () => import('@/view/product-manage/products/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'productmanage-products-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '产品编辑'
                        },
                        component: () => import('@/view/product-manage/products/add-edit.vue')
                    },
                ]
            },
            {
                path: 'trash',
                name: 'productmanage-trash',
                meta: {
                    icon: 'md-trash',
                    title: '回收站'
                },
                component: () => import('@/view/product-manage/products/index.vue')
            },
            {
                path: 'categorys',
                name: 'productmanage-categorys',
                meta: {
                    icon: 'md-briefcase',
                    title: '分类管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'productmanage-categorys-index',
                        meta: {
                            icon: 'md-briefcase',
                            title: '分类列表'
                        },
                        component: () => import('@/view/product-manage/categorys/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'productmanage-categorys-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '分类添加'
                        },
                        component: () => import('@/view/product-manage/categorys/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'productmanage-categorys-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '分类编辑'
                        },
                        component: () => import('@/view/product-manage/categorys/add-edit.vue')
                    },
                ]
            }
        ]
    },

    {
        path: '/regions',
        name: 'regions',
        meta: {
            icon: 'md-locate',
            title: '地域管理'
        },
        component: Main,
        children: [
            {
                path: 'index',
                name: 'regions-index',
                meta: {
                    icon: 'md-locate',
                    title: '地域管理'
                },
                component: () => import('@/view/regions/index.vue')
            },
            {
                path: 'add',
                name: 'regions-add',
                meta: {
                    hideInMenu: true,
                    icon: 'md-add',
                    title: '地域添加'
                },
                component: () => import('@/view/regions/add-edit.vue')
            },
            {
                path: 'edit/:id',
                name: 'regions-edit',
                meta: {
                    hideInMenu: true,
                    icon: 'md-brush',
                    title: '地域编辑'
                },
                component: () => import('@/view/regions/add-edit.vue')
            }
        ]
    },
    {
        path: '/sellers',
        name: 'sellers',
        meta: {
            icon: 'md-person',
            title: '销售管理'
        },
        component: Main,
        children: [
            {
                path: 'index',
                name: 'sellers-index',
                meta: {
                    icon: 'md-person',
                    title: '销售列表'
                },
                component: () => import('@/view/sellers/index.vue')
            },
            {
                path: 'add',
                name: 'sellers-add',
                meta: {
                    hideInMenu: true,
                    icon: 'md-add',
                    title: '销售添加'
                },
                component: () => import('@/view/sellers/add-edit.vue')
            },
            {
                path: 'edit/:id',
                name: 'sellers-edit',
                meta: {
                    hideInMenu: true,
                    icon: 'md-brush',
                    title: '销售编辑'
                },
                component: () => import('@/view/sellers/add-edit.vue')
            },
            {
                path: 'resetPassword/:id',
                name: 'sellers-resetpassword',
                meta: {
                    hideInMenu: true,
                    icon: 'ios-build',
                    title: '销售重置密码'
                },
                component: () => import('@/view/sellers/reset-password.vue')
            },
        ]
    },

    {
        path: '/customerManage',
        name: 'customermanage',
        meta: {
            icon: 'md-people',
            title: '客户管理'
        },
        component: Main,
        children: [
            {
                path: 'institutions',
                name: 'customermanage-institutions',
                meta: {
                    icon: 'md-home',
                    title: '机构管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'customermanage-institutions-index',
                        meta: {
                            icon: 'md-home',
                            title: '机构管理'
                        },
                        component: () => import('@/view/customer-manage/institutions/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'customermanage-institutions-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '机构添加'
                        },
                        component: () => import('@/view/customer-manage/institutions/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'customermanage-institutions-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '机构编辑'
                        },
                        component: () => import('@/view/customer-manage/institutions/add-edit.vue')
                    },
                ]
            },
            {
                path: 'customers',
                name: 'customermanage-customers',
                meta: {
                    icon: 'md-people',
                    title: '客户管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index/:ins_id?',
                        name: 'customermanage-customers-index',
                        meta: {
                            icon: 'md-people',
                            title: '客户管理'
                        },
                        component: () => import('@/view/customer-manage/customers/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'customermanage-customers-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '客户添加'
                        },
                        component: () => import('@/view/customer-manage/customers/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'customermanage-customers-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '客户编辑'
                        },
                        component: () => import('@/view/customer-manage/customers/add-edit.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '/dataManage',
        name: 'datamanage',
        meta: {
            icon: 'md-people',
            title: '数据管理'
        },
        component: Main,
        children: [
            {
                path: 'achievements',
                name: 'datamanage-achievements',
                meta: {
                    icon: 'md-home',
                    title: '业绩管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'datamanage-achievements-index',
                        meta: {
                            icon: 'md-home',
                            title: '业绩管理'
                        },
                        component: () => import('@/view/data-manage/achievements/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'datamanage-achievements-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '业绩录入'
                        },
                        component: () => import('@/view/data-manage/achievements/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'datamanage-achievements-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '业绩编辑'
                        },
                        component: () => import('@/view/data-manage/achievements/add-edit.vue')
                    },
                ]
            },
            {
                path: 'salarys',
                name: 'datamanage-salarys',
                meta: {
                    icon: 'md-home',
                    title: '工资管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'datamanage-salarys-index',
                        meta: {
                            icon: 'md-home',
                            title: '工资管理'
                        },
                        component: () => import('@/view/data-manage/salarys/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'datamanage-salarys-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '业绩录入'
                        },
                        component: () => import('@/view/data-manage/salarys/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'datamanage-salarys-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '业绩编辑'
                        },
                        component: () => import('@/view/data-manage/salarys/add-edit.vue')
                    },
                ]
            },
            {
                path: 'reimburs',
                name: 'datamanage-reimburs',
                meta: {
                    icon: 'md-home',
                    title: '报销管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index',
                        name: 'datamanage-reimburs-index',
                        meta: {
                            icon: 'md-home',
                            title: '报销管理'
                        },
                        component: () => import('@/view/data-manage/reimburs/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'datamanage-reimburs-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '报销录入'
                        },
                        component: () => import('@/view/data-manage/reimburs/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'datamanage-reimburs-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '报销编辑'
                        },
                        component: () => import('@/view/data-manage/reimburs/add-edit.vue')
                    },
                ]
            }
        ]
    },

    {
        path: '/kpiManage',
        name: 'kpimanage',
        meta: {
            icon: 'md-people',
            title: 'KPI管理'
        },
        component: Main,
        children: [
            {
                path: 'kpiRules',
                name: 'kpimanage-kpirules',
                meta: {
                    icon: 'md-home',
                    title: 'KPI 策略管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index/:seller_id?',
                        name: 'kpimanage-kpirules-index',
                        meta: {
                            icon: 'md-home',
                            title: 'KPI 策略管理'
                        },
                        component: () => import('@/view/kpi-manage/kpi-rules/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'kpimanage-kpirules-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '策略添加'
                        },
                        component: () => import('@/view/kpi-manage/kpi-rules/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'kpimanage-kpirules-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '策略编辑'
                        },
                        component: () => import('@/view/kpi-manage/kpi-rules/add-edit.vue')
                    },
                ]
            },
            {
                path: 'kpiResults',
                name: 'kpimanage-kpiresults',
                meta: {
                    icon: 'md-home',
                    title: 'KPI 结果'
                },
                component: () => import('@/view/kpi-manage/kpi-results/index.vue')
            }
        ]
    },

    {
        path: '/prizeManage',
        name: 'prizemanage',
        meta: {
            icon: 'md-people',
            title: '奖金管理'
        },
        component: Main,
        children: [
            {
                path: 'prizeRules',
                name: 'prizemanage-prizerules',
                meta: {
                    icon: 'md-home',
                    title: '奖金策略管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index/:seller_id?',
                        name: 'prizemanage-prizerules-index',
                        meta: {
                            icon: 'md-home',
                            title: '奖金策略管理'
                        },
                        component: () => import('@/view/prize-manage/prize-rules/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'prizemanage-prizerules-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '策略添加'
                        },
                        component: () => import('@/view/prize-manage/prize-rules/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'prizemanage-prizerules-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '策略编辑'
                        },
                        component: () => import('@/view/prize-manage/prize-rules/add-edit.vue')
                    },
                ]
            },
            {
                path: 'prizeResults',
                name: 'prizemanage-prizeresults',
                meta: {
                    icon: 'md-home',
                    title: '奖金结果'
                },
                component: () => import('@/view/prize-manage/prize-results/index.vue')
            }
        ]
    },

    {
        path: '/commissionManage',
        name: 'commissionmanage',
        meta: {
            icon: 'md-people',
            title: '佣金管理'
        },
        component: Main,
        children: [
            {
                path: 'commissionRules',
                name: 'commissionmanage-commissionrules',
                meta: {
                    icon: 'md-home',
                    title: '佣金策略管理'
                },
                component: parentView,
                children: [
                    {
                        path: 'index/:seller_id?',
                        name: 'commissionmanage-commissionrules-index',
                        meta: {
                            icon: 'md-home',
                            title: '佣金策略管理'
                        },
                        component: () => import('@/view/commission-manage/commission-rules/index.vue')
                    },
                    {
                        path: 'add',
                        name: 'commissionmanage-commissionrules-add',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-add',
                            title: '策略添加'
                        },
                        component: () => import('@/view/commission-manage/commission-rules/add-edit.vue')
                    },
                    {
                        path: 'edit/:id',
                        name: 'commissionmanage-commissionrules-edit',
                        meta: {
                            hideInMenu: true,
                            icon: 'md-brush',
                            title: '策略编辑'
                        },
                        component: () => import('@/view/commission-manage/commission-rules/add-edit.vue')
                    },
                ]
            },
            {
                path: 'commissionResults',
                name: 'commissionmanage-commissionresults',
                meta: {
                    icon: 'md-home',
                    title: '佣金结果'
                },
                component: () => import('@/view/commission-manage/commission-results/index.vue')
            }
        ]
    },

    {
        path: '/weeks',
        name: 'weeks',
        meta: {
            icon: 'md-locate',
            title: '行动日历'
        },
        component: Main,
        children: [
            {
                path: 'index',
                name: 'weeks-index',
                meta: {
                    icon: 'md-locate',
                    title: '行动日历'
                },
                component: () => import('@/view/weeks/index.vue')
            },
            {
                path: 'edit/:id',
                name: 'weeks-edit',
                meta: {
                    hideInMenu: true,
                    icon: 'md-brush',
                    title: '日历编辑'
                },
                component: () => import('@/view/weeks/add-edit.vue')
            }
        ]
    },
    // {
    //     path: '/settings',
    //     name: 'settings',
    //     meta: {
    //         icon: 'md-locate',
    //         title: '系统设置'
    //     },
    //     component: Main,
    //     children: [
    //         {
    //             path: 'index',
    //             name: 'settings-index',
    //             meta: {
    //                 icon: 'md-locate',
    //                 title: '系统设置'
    //             },
    //             component: () => import('@/view/settings/index.vue')
    //         },
    //     ]
    // },
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
