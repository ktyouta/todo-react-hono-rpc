import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

type PropsType = {
    children: ReactNode;
    navigationList: {
        name: ReactNode;
        path: string;
    }[];
}

export function Dashboard(props: PropsType) {

    return (
        <div className='w-full min-h-screen flex flex-col'>
            <div className='h-[50px] bg-slate-500'>
                header
            </div>
            <div className='flex flex-1'>
                <nav className='w-[280px] bg-blue-400 flex flex-col items-center'>
                    {
                        props.navigationList.map((e) => {
                            return (
                                <NavLink
                                    key={e.path}
                                    to={e.path}
                                    className=""
                                >
                                    {e.name}
                                </NavLink>
                            )
                        })
                    }
                </nav>
                <div className='flex-1 flex flex-col'>
                    {props.children}
                </div>
            </div>
        </div>
    );
}