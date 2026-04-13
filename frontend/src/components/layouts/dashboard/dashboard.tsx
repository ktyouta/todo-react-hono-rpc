import { LoginUserType } from '@/app/api/verify';
import { cn } from '@/utils/cn';
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

    // true=展開(w-60) / false=折りたたみ
    // lg未満: 展開時のみオーバーレイ表示。折りたたみ時は非表示(w-0)。ヘッダーのハンバーガーで開く。
    // lg以上: flex レイアウト内で幅のみ変化。折りたたみ時はアイコン表示(w-20)。
    // サイドバー表示フラグ
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    // ユーザーメニュー表示フラグ
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <div className='w-full min-h-screen flex bg-gray-100'>

            {/* オーバーレイ背景 (lg未満・サイドバー展開時のみ表示) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* サイドバー
                lg未満: 常に fixed。閉じた状態=w-0(非表示)、開いた状態=w-60(オーバーレイ)
                lg以上: flex レイアウト内に常時表示。閉じた状態=w-20(アイコン表示)、開いた状態=w-60。
                ※ position を切り替えないため、幅の transition が常に滑らかに動作する
            */}
            <nav className={cn(
                'flex flex-col pt-6 overflow-hidden bg-cyan-500 shadow-md transition-all duration-300',
                'fixed inset-y-0 left-0 z-40',
                'lg:relative lg:inset-auto lg:z-auto',
                isSidebarOpen ? 'w-60' : 'w-0 lg:w-20',
            )}>
                {/* ハンバーガーボタン（常に固定） */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`shrink-0 flex items-center ${isSidebarOpen ? 'justify-end' : 'justify-center'} w-full px-6 py-3 text-white/80 hover:text-white mb-[45px]`}
                    aria-label={isSidebarOpen ? 'サイドバーを閉じる' : 'サイドバーを開く'}
                >
                    <LuMenu className='h-6 w-6' />
                </button>
                {/* メニューリスト（縦スクロール可能） */}
                <div className='flex-1 overflow-y-auto'>
                    {
                        props.navigationList.map((e) => (
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
                                onClick={() => {
                                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                }}
                            >
                                {e.icon && <span className={`shrink-0 ${isSidebarOpen ? 'mr-3' : ''}`}>{e.icon}</span>}
                                <span className={`transition-opacity duration-300 text-[16px] ${isSidebarOpen ? 'block' : 'hidden'}`}>{e.name}</span>
                            </NavLink>
                        ))
                    }
                </div>
            </nav>

            {/* メインエリア
                lg未満: サイドバーは w-0 (非表示) のため pl 不要
                lg以上: flex レイアウトが幅を管理するため pl 不要
            */}
            <div className='flex flex-col flex-1 min-w-0 lg:pl-0'>
                {/* ヘッダー */}
                <header className='h-14 bg-white border-b border-gray-200 flex items-center pl-6 pr-4 sm:pr-[70px]'>
                    {/* ハンバーガーメニュー (モバイルのみ) */}
                    <button
                        className="lg:hidden mr-3 text-gray-600 hover:text-gray-800"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="メニューを開く"
                    >
                        <LuMenu className='h-6 w-6' />
                    </button>
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
                        <div className='fixed inset-0 z-10'
                            onClick={() => { setIsUserMenuOpen(false) }}
                        />
                    }
                </header>
                <div className='flex flex-1'>
                    {/* メインコンテンツ */}
                    <main className='flex-1 flex flex-col p-3 sm:p-6 overflow-x-hidden'>
                        {props.children}
                    </main>
                </div>
                <footer className='h-10 flex items-center pl-6'>
                    <span className='text-xs text-gray-400'>© 2026 Todo App. All rights reserved.</span>
                </footer>
            </div>
        </div>
    );
}
