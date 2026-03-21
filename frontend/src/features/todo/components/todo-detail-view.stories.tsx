import type { Meta, StoryObj } from '@storybook/react';
import { TodoDetailView } from './todo-detail-view';

const dummyStatusList = [
    { id: 1, name: '未着手', sortOrder: 1, createdAt: '', updatedAt: '' },
    { id: 2, name: '着手中', sortOrder: 2, createdAt: '', updatedAt: '' },
    { id: 3, name: '完了', sortOrder: 3, createdAt: '', updatedAt: '' },
];

const dummyCategoryList = [
    { id: 1, name: 'タスク', sortOrder: 1, createdAt: '', updatedAt: '' },
    { id: 2, name: 'メモ', sortOrder: 2, createdAt: '', updatedAt: '' },
];

const dummyPriorityList = [
    { id: 1, name: '低', sortOrder: 1, createdAt: '', updatedAt: '' },
    { id: 2, name: '中', sortOrder: 2, createdAt: '', updatedAt: '' },
    { id: 3, name: '高', sortOrder: 3, createdAt: '', updatedAt: '' },
];

const dummyTaskBase = {
    id: 1,
    title: 'サンプルタスク',
    content: 'これはサンプルのタスク内容です。\n複数行にわたる内容も表示できます。',
    userId: 1,
    isFavorite: false,
    deleteFlg: false,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
};

const dummyTask = {
    ...dummyTaskBase,
    categoryId: 1,
    categoryName: 'タスク',
    statusId: 1,
    statusName: '未着手',
    priorityId: 2,
    priorityName: '中',
    dueDate: '2026-12-31',
};

const commonProps = {
    statusList: dummyStatusList,
    categoryList: dummyCategoryList,
    priorityList: dummyPriorityList,
    isDeleteDialogOpen: false,
    onClickBack: () => {},
    onClickEdit: () => {},
    onClickDelete: () => {},
    onCancelDelete: () => {},
    onConfirmDelete: () => {},
    onFavoriteToggle: () => {},
    isLoading: false,
};

const meta: Meta<typeof TodoDetailView> = {
    title: 'features/todo/TodoDetailView',
    component: TodoDetailView,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof TodoDetailView>;

export const Default: Story = {
    args: {
        ...commonProps,
        task: dummyTask,
    },
};

export const MemoCategory: Story = {
    args: {
        ...commonProps,
        task: {
            ...dummyTaskBase,
            categoryId: 2,
            categoryName: 'メモ',
            statusId: null,
            statusName: 'なし',
            priorityId: null,
            priorityName: 'なし',
            dueDate: null,
        },
    },
};

export const OverdueDueDate: Story = {
    args: {
        ...commonProps,
        task: {
            ...dummyTask,
            dueDate: '2025-01-01',
        },
    },
};

export const WarningDueDate: Story = {
    args: {
        ...commonProps,
        task: {
            ...dummyTask,
            dueDate: '2026-03-18',
        },
    },
};

export const DeleteDialogOpen: Story = {
    args: {
        ...commonProps,
        task: dummyTask,
        isDeleteDialogOpen: true,
    },
};
