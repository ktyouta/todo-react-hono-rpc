import { LoginUserType } from '@/app/api/verify';
import { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';

type PropsType = {
    children: ReactNode;
    navigationList: {
        name: ReactNode;
        icon?: ReactNode;
        path: string;
    }[];
    loginUser: LoginUserType;
    moveUserInfoUpdate(): void;
    movePasswordUpdate(): void;
    logout(): void;
}

export function Dashboard(props: PropsType) {

    // サイドバー開閉フラグ
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // ユーザーメニュー表示フラグ
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <div className='w-full min-h-screen flex bg-gray-100'>
            {/* サイドバー */}
            <nav className={`${isSidebarOpen ? 'w-60' : 'w-20'} bg-cyan-500 shadow-md flex flex-col pt-6 transition-all duration-300 overflow-hidden`}>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`flex items-center ${isSidebarOpen ? 'justify-end' : 'justify-center'} w-full px-6 py-3 text-white/80 hover:text-white mb-[45px]`}
                    aria-label={isSidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
                >
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                    </svg>
                </button>
                {
                    // メニューリスト
                    props.navigationList.map((e) => {
                        return (
                            <NavLink
                                key={e.path}
                                to={e.path}
                                className={({ isActive }) =>
                                    `flex items-center ${isSidebarOpen ? '' : 'justify-center'} px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap 
                                ${isActive
                                        ? 'bg-white/20 text-white border-l-[3px] border-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`
                                }
                            >
                                {e.icon && <span className={`shrink-0 ${isSidebarOpen ? 'mr-3' : ''}`}>{e.icon}</span>}
                                <span className={`transition-opacity duration-300 text-[16px] ${isSidebarOpen ? 'block' : 'hidden'}`}>{e.name}</span>
                            </NavLink>
                        )
                    })
                }
            </nav>
            <div className='flex flex-col flex-1'>
                {/* ヘッダー */}
                <header className='h-14 bg-white border-b border-gray-200 flex items-center pl-6 pr-10'>
                    <span className='text-[26px] font-bold text-gray-800 tracking-wide inline-block flex-1'>
                        Todoリスト
                    </span>
                    <div className='flex items-center relative'
                        onClick={() => { setIsUserMenuOpen(true) }}
                    >
                        <span className='mr-[10px] text-[18px]'>
                            {props.loginUser.name}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                        {/* ユーザーメニュー */}
                        {
                            isUserMenuOpen &&
                            <div className='w-[250px] h-[200px] absolute top-14 right-1 text-[16px] rounded-lg bg-cyan-500 border-black p-5 z-20'>
                                <span className='block w-fit'
                                    onClick={props.moveUserInfoUpdate}
                                >
                                    ユーザー情報更新
                                </span>
                                <span className='block w-fit'
                                    onClick={props.movePasswordUpdate}
                                >
                                    パスワード更新
                                </span>
                                <span className='block w-fit'
                                    onClick={props.logout}
                                >
                                    ログアウト
                                </span>
                            </div>
                        }
                    </div>
                    {
                        isUserMenuOpen &&
                        <div className='absolute w-screen h-screen top-0 z-10 left-0'
                            onClick={() => { setIsUserMenuOpen(false) }}
                        />
                    }
                </header>
                <div className='flex flex-1'>
                    {/* メインコンテンツ */}
                    <main className='flex-1 flex flex-col p-6'>
                        {props.children}
                    </main>
                </div>
            </div>
        </div>
    );
}
