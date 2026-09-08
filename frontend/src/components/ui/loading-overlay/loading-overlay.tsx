import { Spinner } from '../spinner/spinner';

export function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <Spinner className="size-8 sm:size-12" />
        </div>
    );
}
