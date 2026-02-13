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
            { name: 'ホーム', path: '/' },
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
