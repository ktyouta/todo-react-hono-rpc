import { ReactNode, useState } from 'react';
import { NavLink } from 'react-router-dom';

type PropsType = {
    children: ReactNode;
    navigationList: {
        name: ReactNode;
        icon?: ReactNode;
        path: string;
    }[];
}

export function Dashboard(props: PropsType) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
                                <span className={`transition-opacity duration-300 ${isSidebarOpen ? 'block' : 'hidden'}`}>{e.name}</span>
                            </NavLink>
                        )
                    })
                }
            </nav>
            <div className='flex flex-col flex-1'>
                {/* ヘッダー */}
                <header className='h-14 bg-white border-b border-gray-200 flex items-center px-6'>
                    <span className='text-[26px] font-bold text-gray-800 tracking-wide'>
                        Todoリスト
                    </span>
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
