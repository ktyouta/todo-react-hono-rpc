import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TodoDetailEditType } from '../types/todo-detail-edit-type';
import { TodoDetailEdit } from './todo-detail-edit';

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

const dummyTask = {
    id: 1,
    title: 'サンプルタスク',
    content: 'これはサンプルのタスク内容です。\n複数行にわたる内容も表示できます。',
    categoryId: 1,
    categoryName: 'タスク',
    statusId: 1,
    statusName: '未着手',
    priorityId: 2,
    priorityName: '中',
    dueDate: '2026-12-31',
    userId: 1,
    isFavorite: false,
    deleteFlg: false,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-03-01T12:00:00.000Z',
};

const meta: Meta<typeof TodoDetailEdit> = {
    title: 'features/todo/TodoDetailEdit',
    component: TodoDetailEdit,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof TodoDetailEdit>;

export const Default: Story = {
    render: () => {
        const { register, control, formState: { errors } } = useForm<TodoDetailEditType>({
            defaultValues: {
                title: dummyTask.title,
                content: dummyTask.content ?? '',
                category: dummyTask.categoryId,
                status: dummyTask.statusId ?? undefined,
                priority: dummyTask.priorityId ?? undefined,
                dueDate: dummyTask.dueDate ?? null,
            },
        });
        return (
            <TodoDetailEdit
                task={dummyTask}
                statusList={dummyStatusList}
                categoryList={dummyCategoryList}
                priorityList={dummyPriorityList}
                onClickBack={() => {}}
                onClickCancel={() => {}}
                clickSave={async () => {}}
                register={register}
                control={control}
                errors={errors}
                selectedCategoryId={1}
                isLoading={false}
            />
        );
    },
};

export const MemoCategory: Story = {
    render: () => {
        const { register, control, formState: { errors } } = useForm<TodoDetailEditType>({
            defaultValues: {
                title: 'サンプルメモ',
                content: 'メモの内容です。',
                category: 2,
                dueDate: null,
            },
        });
        return (
            <TodoDetailEdit
                task={{
                    ...dummyTask,
                    categoryId: 2,
                    categoryName: 'メモ',
                    statusId: null,
                    statusName: 'なし',
                    priorityId: null,
                    priorityName: 'なし',
                    dueDate: null,
                }}
                statusList={dummyStatusList}
                categoryList={dummyCategoryList}
                priorityList={dummyPriorityList}
                onClickBack={() => {}}
                onClickCancel={() => {}}
                clickSave={async () => {}}
                register={register}
                control={control}
                errors={errors}
                selectedCategoryId={2}
                isLoading={false}
            />
        );
    },
};

export const WithValidationErrors: Story = {
    render: () => {
        const { register, control, formState: { errors }, setError } = useForm<TodoDetailEditType>({
            defaultValues: {
                title: '',
                content: '',
                category: 1,
                status: 1,
                priority: 1,
                dueDate: null,
            },
        });

        useEffect(() => {
            setError('title', { message: 'タイトルを入力してください' });
            setError('content', { message: 'タスク内容を入力してください' });
        }, [setError]);

        return (
            <TodoDetailEdit
                task={dummyTask}
                statusList={dummyStatusList}
                categoryList={dummyCategoryList}
                priorityList={dummyPriorityList}
                onClickBack={() => {}}
                onClickCancel={() => {}}
                clickSave={async () => {}}
                register={register}
                control={control}
                errors={errors}
                selectedCategoryId={1}
                isLoading={false}
            />
        );
    },
};
