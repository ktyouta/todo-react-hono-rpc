type Variant = 'default' | 'red' | 'yellow';

type PropsType = {
    value: number;
    label: string;
    variant?: Variant;
};

const variantStyles: Record<Variant, { card: string; value: string }> = {
    default: {
        card: 'bg-white border-gray-200',
        value: 'text-gray-800',
    },
    red: {
        card: 'bg-red-50 border-red-200',
        value: 'text-red-600',
    },
    yellow: {
        card: 'bg-yellow-50 border-yellow-200',
        value: 'text-yellow-600',
    },
};

export function StatCard({ value, label, variant = 'default' }: PropsType) {
    const styles = variantStyles[variant];
    return (
        <div className={`border rounded-lg p-4 flex flex-col gap-1 ${styles.card}`}>
            <p className="text-base text-gray-500">{label}</p>
            <p className={`text-3xl font-bold ${styles.value}`}>{value}</p>
        </div>
    );
}
