import type { Meta, StoryObj } from '@storybook/react';
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
};

export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Default: Story = {
    args: {
        navigationList: [
            {
                name: 'ホーム',
                icon: (
                    <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z' />
                    </svg>
                ),
                path: '/',
            },
            { name: 'Todo', path: '/todo' },
            { name: '設定', path: '/settings' },
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
