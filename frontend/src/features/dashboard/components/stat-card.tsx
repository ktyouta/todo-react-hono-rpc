type StatCardVariant = 'default' | 'red' | 'yellow';

type PropsType = {
    value: number;
    label: string;
    variant?: StatCardVariant;
};

const variantStyles: Record<StatCardVariant, { card: string; value: string }> = {
    default: {
        card: 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700',
        value: 'text-gray-800 dark:text-gray-100',
    },
    red: {
        card: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
        value: 'text-red-600 dark:text-red-400',
    },
    yellow: {
        card: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
        value: 'text-yellow-600 dark:text-yellow-400',
    },
};

export function StatCard({ value, label, variant = 'default' }: PropsType) {
    const styles = variantStyles[variant];
    return (
        <div className={`border rounded-lg p-4 flex flex-col gap-1 ${styles.card}`}>
            <p className="text-base text-gray-500 dark:text-gray-400">{label}</p>
            <p className={`text-3xl font-bold ${styles.value}`}>{value}</p>
        </div>
    );
}
