import { Button, Dialog, LoadingOverlay } from "@/components";
import { getFormatDatetime } from "@/utils/date-util";
import { HiArrowLeft } from "react-icons/hi2";
import { UserDeletedManagementReturnType } from "../api/get-user-deleted-management";

type PropsType = {
    user: UserDeletedManagementReturnType;
    onClickBack: () => void;
    isRestoreDialogOpen: boolean;
    onClickRestore: () => void;
    onCancelRestore: () => void;
    onConfirmRestore: () => void;
    isDeleteDialogOpen: boolean;
    onClickDelete: () => void;
    onCancelDelete: () => void;
    onConfirmDelete: () => void;
    isLoading: boolean;
};

export function UserDeletedManagementDetailView(props: PropsType) {

    const {
        user,
        onClickBack,
        isRestoreDialogOpen,
        onClickRestore,
        onCancelRestore,
        onConfirmRestore,
        isDeleteDialogOpen,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isLoading,
    } = props;

    return (
        <div className="w-full min-h-full flex flex-col pb-4">
            {/* 一覧に戻る */}
            <div className="mb-4">
                <button
                    type="button"
                    onClick={onClickBack}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                >
                    <HiArrowLeft />
                    <span>一覧に戻る</span>
                </button>
            </div>

            {/* ヘッダー */}
            <div className="flex items-center pr-[10px] mb-6 sm:mb-8">
                <span className="font-bold text-[18px] sm:text-[22px]">ユーザー詳細</span>
            </div>

            {/* ユーザー情報（読み取り専用） */}
            <div className="w-full p-3 sm:p-5 border border-[#c0c0c0] rounded bg-white mb-4 sm:mb-6">
                <p className="text-base text-gray-500 font-medium mb-4">ユーザー情報</p>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">ユーザー名</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">{user.name}</span>
                        </div>
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">生年月日</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">{`${user.birthday.slice(0, 4)}-${user.birthday.slice(4, 6)}-${user.birthday.slice(6, 8)}`}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">ロール</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">{user.roleName}</span>
                        </div>
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">最終ログイン</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">
                                {user.lastLoginDate ? getFormatDatetime(new Date(user.lastLoginDate), 'yyyy-MM-dd HH:mm:ss') : 'なし'}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">登録日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">{getFormatDatetime(new Date(user.createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                        </div>
                        <div className="flex flex-1 items-center gap-2">
                            <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">更新日</span>
                            <span className="flex-1 px-3 py-2 text-base text-gray-700">{getFormatDatetime(new Date(user.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 復元エリア・物理削除エリア */}
            <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-blue-200 rounded bg-blue-50">
                    <div>
                        <p className="text-sm font-medium text-blue-700">ユーザーを復元する</p>
                        <p className="text-sm text-gray-500 mt-1">このユーザーを復元します。復元後はユーザー管理画面から参照できます。</p>
                    </div>
                    <Button
                        colorType={"blue"}
                        sizeType={"large"}
                        className="shrink-0"
                        onClick={onClickRestore}
                    >
                        復元する
                    </Button>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-red-200 rounded bg-red-50">
                    <div>
                        <p className="text-sm font-medium text-red-700">完全に削除する</p>
                        <p className="text-sm text-gray-500 mt-1">このユーザーを完全に削除します。削除後は元に戻せません。</p>
                    </div>
                    <Button
                        colorType={"red"}
                        sizeType={"large"}
                        className="shrink-0"
                        onClick={onClickDelete}
                    >
                        完全に削除する
                    </Button>
                </div>
            </div>

            {/* 復元確認ダイアログ */}
            <Dialog
                isOpen={isRestoreDialogOpen}
                onClose={onCancelRestore}
                title="ユーザーの復元"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`${user.name} を復元しますか？`}<br />
                        復元後はユーザー管理画面から参照できます。
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onCancelRestore}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onConfirmRestore}
                        >
                            復元する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* 物理削除確認ダイアログ */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={onCancelDelete}
                title="ユーザーの完全削除"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`${user.name} を完全に削除しますか？`}<br />
                        この操作は取り消せません。
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            colorType={"blue"}
                            sizeType={"medium"}
                            onClick={onCancelDelete}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType={"red"}
                            sizeType={"medium"}
                            onClick={onConfirmDelete}
                        >
                            削除する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {isLoading && <LoadingOverlay />}
        </div>
    );
}
