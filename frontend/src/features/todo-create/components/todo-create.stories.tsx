import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TodoCreate } from './todo-create';

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
        }>({
            defaultValues: {
                title: '',
                content: '',
            },
        });
        return (
            <TodoCreate
                register={register}
                errors={errors}
                clickCreate={async () => {
                    alert('作成ボタンが押されました');
                }}
            />
        );
    },
};

export const WithValidationErrors: Story = {
    render: () => {
        const { register, formState: { errors }, setError } = useForm<{
            title: string;
            content: string;
        }>({
            defaultValues: {
                title: '',
                content: '',
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
                clickCreate={async () => {}}
            />
        );
    },
};
