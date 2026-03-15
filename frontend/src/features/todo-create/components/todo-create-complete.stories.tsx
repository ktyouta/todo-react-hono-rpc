import type { Meta, StoryObj } from '@storybook/react';
import { TodoCreateComplete } from './todo-create-complete';

const meta: Meta<typeof TodoCreateComplete> = {
    title: 'features/todo-create-complete',
    component: TodoCreateComplete,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof TodoCreateComplete>;

export const Default: Story = {
    args: {
        createdTitle: 'サンプルタスクのタイトル',
        clickGoToList: () => alert('一覧へボタンが押されました'),
        clickContinue: () => alert('続けて作成ボタンが押されました'),
    },
};

export const LongTitle: Story = {
    args: {
        createdTitle: 'とても長いタイトルのタスクを作成した場合のレイアウト確認用サンプルテキストです。折り返しが正しく機能するかを確認します。',
        clickGoToList: () => alert('一覧へボタンが押されました'),
        clickContinue: () => alert('続けて作成ボタンが押されました'),
    },
};
