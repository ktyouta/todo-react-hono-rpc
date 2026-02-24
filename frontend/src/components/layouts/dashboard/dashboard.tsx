import { LoginUserType } from '@/app/api/verify';
import { ReactNode, useState } from 'react';
import { HiOutlineUserCircle } from 'react-icons/hi2';
import { IoTriangle } from "react-icons/io5";
import { LuMenu } from "react-icons/lu";
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
                    <LuMenu className='h-6 w-6' />
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
                                        ? 'bg-white/20 text-white shadow-[inset_3px_0px_0px_white]'
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
                <header className='h-14 bg-white border-b border-gray-200 flex items-center pl-6 pr-[70px]'>
                    <span className='text-[26px] font-bold text-gray-800 tracking-wide inline-block flex-1'>
                        Todoリスト
                    </span>
                    {/* ユーザーアイコン */}
                    <div className='flex items-center relative'
                        onClick={() => { setIsUserMenuOpen(true) }}
                    >
                        <span className='mr-[10px] text-[18px] cursor-pointer'>
                            {props.loginUser.name}
                        </span>
                        <HiOutlineUserCircle className="size-8 cursor-pointer mr-[12px]" />
                        <IoTriangle className={`size-4 cursor-pointer ${isUserMenuOpen ? 'rotate-0' : 'rotate-180'}`} />
                        {/* ユーザーメニュー */}
                        {
                            isUserMenuOpen &&
                            <div className='w-64 absolute top-12 right-0 text-sm rounded-lg bg-white border border-gray-200 shadow-lg z-20 py-2'>
                                <button className='block w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors'
                                    onClick={props.moveUserInfoUpdate}
                                >
                                    ユーザー情報更新
                                </button>
                                <button className='block w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors'
                                    onClick={props.movePasswordUpdate}
                                >
                                    パスワード更新
                                </button>
                                <div className='border-t border-gray-200 my-2' />
                                <button className='block w-full text-left px-5 py-3 text-gray-700 hover:bg-gray-100 transition-colors'
                                    onClick={props.logout}
                                >
                                    ログアウト
                                </button>
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
