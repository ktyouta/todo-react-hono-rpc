export const paths = {
    home: {
        path: '/',
        getHref: () => paths.home.path,
    },
    todo: {
        path: '/todo'
    },
    todoDetail: {
        path: '/todo/:id',
        getHref: (id: number) => `${paths.todo.path}/${id}`
    },
    todoCreate: {
        path: 'todo-create'
    },
    login: {
        path: '/login',
        getHref: (redirectTo?: string) => `${paths.login.path}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ``}`,
    },
    signup: {
        path: '/signup',
        getHref: (redirectTo?: string) => `${paths.signup.path}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ``}`,
    },
    todoManagement: {
        path: '/todo-management',
    },
    todoManagementDetail: {
        path: '/todo-management/:id',
        getHref: (id: number) => `/todo-management/${id}`,
    },
    todoDeletedManagement: {
        path: '/todo-deleted-management',
    },
    todoDeletedManagementDetail: {
        path: '/todo-deleted-management/:id',
        getHref: (id: number) => `/todo-deleted-management/${id}`,
    },
    updateUser: {
        path: '/update-user',
        getHref: (redirectTo?: string) => `${paths.updateUser.path}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ``}`,
    },
    updatePassword: {
        path: '/update-password',
        getHref: (redirectTo?: string) => `${paths.updatePassword.path}${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ``}`,
    },
    userCreate: {
        path: '/user-create',
    },
    roleCreate: {
        path: '/role-create',
    },
    roleManagement: {
        path: '/role-management',
    },
    roleManagementDetail: {
        path: '/role-management/:id',
        getHref: (id: number) => `/role-management/${id}`,
    },
    userManagement: {
        path: '/user-management',
    },
    userManagementDetail: {
        path: '/user-management/:id',
        getHref: (id: number) => `/user-management/${id}`,
    },
    userDeletedManagement: {
        path: '/user-deleted-management',
    },
    userDeletedManagementDetail: {
        path: '/user-deleted-management/:id',
        getHref: (id: number) => `/user-deleted-management/${id}`,
    },
    todoTrash: {
        path: '/todo-trash',
    },
    todoTrashDetail: {
        path: '/todo-trash/:id',
        getHref: (id: number) => `/todo-trash/${id}`,
    },
} as const;