import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './spinner';

const meta: Meta<typeof Spinner> = {
    title: 'components/ui/spinner',
    component: Spinner,
    tags: ['autodocs'],
    argTypes: {
        className: {
            control: 'text',
            description: 'サイズ・色などを上書きする Tailwind クラス（例: "size-6 sm:size-7"）',
        },
    },
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
    args: {},
};

export const Small: Story = {
    args: {
        className: 'size-4',
    },
};

export const Large: Story = {
    args: {
        className: 'size-12',
    },
};

export const Responsive: Story = {
    args: {
        className: 'size-6 sm:size-10',
    },
};
