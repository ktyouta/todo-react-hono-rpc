import type { Meta, StoryObj } from '@storybook/react';
import { HiOutlineCog6Tooth, HiOutlineClipboardDocumentList, HiOutlineHome } from 'react-icons/hi2';
import { MemoryRouter } from 'react-router-dom';
import { Dashboard } from './dashboard';

const meta: Meta<typeof Dashboard> = {
    title: 'components/layouts/dashboard',
    component: Dashboard,
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        loginUser: { id: 1, name: 'テストユーザー', birthday: '2000/01/01' },
        moveUserInfoUpdate: () => { },
        movePasswordUpdate: () => { },
        logout: () => { },
    },
};

export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
    args: {
        navigationList: [
            {
                name: 'ホーム',
                icon: <HiOutlineHome className='h-5 w-5' />,
                path: '/',
            },
            {
                name: 'Todo',
                icon: <HiOutlineClipboardDocumentList className='h-5 w-5' />,
                path: '/todo',
            },
            {
                name: '設定',
                icon: <HiOutlineCog6Tooth className='h-5 w-5' />,
                path: '/settings',
            },
        ],
        children: <div className="p-4">メインコンテンツ</div>,
    },
};

export const EmptyNavigation: Story = {
    args: {
        navigationList: [],
        children: <div className="p-4">ナビゲーションなし</div>,
    },
};
