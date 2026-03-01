import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TodoCreate } from './todo-create';

const dummyCategoryList = [
    { id: 1, name: 'タスク', sortOrder: 1, createdAt: '', updatedAt: '' },
    { id: 2, name: 'メモ', sortOrder: 2, createdAt: '', updatedAt: '' },
];

const dummyStatusList = [
    { id: 1, name: '未着手', sortOrder: 1, createdAt: '', updatedAt: '' },
    { id: 2, name: '着手中', sortOrder: 2, createdAt: '', updatedAt: '' },
    { id: 3, name: '完了', sortOrder: 3, createdAt: '', updatedAt: '' },
];

const meta: Meta<typeof TodoCreate> = {
    title: 'features/todo-create',
    component: TodoCreate,
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof TodoCreate>;

export const Default: Story = {
    render: () => {
        const { register, formState: { errors } } = useForm<{
            title: string;
            content: string;
            categoryId: number;
            statusId?: number;
        }>({
            defaultValues: {
                title: '',
                content: '',
                categoryId: 1,
                statusId: 1,
            },
        });
        return (
            <TodoCreate
                register={register}
                errors={errors}
                clickCreate={async () => {
                    alert('作成ボタンが押されました');
                }}
                categoryList={dummyCategoryList}
                statusList={dummyStatusList}
                selectedCategoryId={1}
            />
        );
    },
};

export const WithValidationErrors: Story = {
    render: () => {
        const { register, formState: { errors }, setError } = useForm<{
            title: string;
            content: string;
            categoryId: number;
            statusId?: number;
        }>({
            defaultValues: {
                title: '',
                content: '',
                categoryId: 1,
                statusId: 1,
            },
        });

        useEffect(() => {
            setError('title', { message: 'タイトルを入力してください' });
            setError('content', { message: 'タスク内容を入力してください' });
        }, [setError]);

        return (
            <TodoCreate
                register={register}
                errors={errors}
                clickCreate={async () => { }}
                categoryList={dummyCategoryList}
                statusList={dummyStatusList}
                selectedCategoryId={1}
            />
        );
    },
};
