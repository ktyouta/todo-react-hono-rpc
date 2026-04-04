import { Button, Dialog, LoadingOverlay } from "@/components";
import { getFormatDatetime } from "@/utils/date-util";
import { HiArrowLeft } from "react-icons/hi2";
import { useRoleManagementDetail } from "../hooks/use-role-management-detail";

type PropsType = ReturnType<typeof useRoleManagementDetail>;

export function RoleManagementDetailView(props: PropsType) {
    const {
        role,
        onClickBack,
        onClickEdit,
        isDeleteDialogOpen,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isDeleteLoading,
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
            <div className="flex items-center pr-[10px] mb-10">
                <span className="font-bold text-[18px] sm:text-[22px]">ロール詳細</span>
                <div className="flex-1" />
                {!role.isImmutable && (
                    <Button
                        colorType="green"
                        sizeType="large"
                        className="px-4 sm:px-8 bg-cyan-500 hover:bg-cyan-600"
                        onClick={onClickEdit}
                    >
                        編集
                    </Button>
                )}
            </div>

            {/* ロール情報（名前・日付） */}
            <div className="w-full p-3 sm:p-5 border border-[#c0c0c0] rounded bg-white mb-4 sm:mb-6">
                <p className="text-base text-gray-500 font-medium mb-4">ロール情報</p>
                <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">ロール名</span>
                    <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">{role.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%] mt-[20px] pt-[20px] border-t border-[#e8e8e8]">
                    <div className="flex flex-1 items-center gap-2">
                        <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">登録日</span>
                        <span className="flex-1 px-3 py-2 text-base text-gray-700">{getFormatDatetime(new Date(role.createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                    </div>
                    <div className="flex flex-1 items-center gap-2">
                        <span className="whitespace-nowrap w-[6em] text-gray-500 text-base">更新日</span>
                        <span className="flex-1 px-3 py-2 text-base text-gray-700">{getFormatDatetime(new Date(role.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                    </div>
                </div>
            </div>

            {/* パーミッション */}
            <div className="w-full p-3 sm:p-5 border border-[#c0c0c0] rounded bg-white mb-4 sm:mb-6">
                <p className="text-base text-gray-500 font-medium mb-4">パーミッション</p>
                {role.permissions.length === 0 ? (
                    <span className="text-gray-400 text-sm pl-1">なし</span>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-3">
                        {role.permissions.map((permission) => (
                            <div
                                key={permission.permissionId}
                                className="px-3 py-2.5 border border-cyan-500 bg-cyan-50 text-cyan-700 rounded text-sm"
                            >
                                {permission.screenName}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Danger Zone（isProtected なら非表示） */}
            {!role.isProtected && (
                <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-red-200 rounded bg-red-50">
                        <div>
                            <p className="text-sm font-medium text-red-700">ロールの削除</p>
                            <p className="text-sm text-gray-500 mt-1">このロールを削除します。物理削除のため復元できません。</p>
                        </div>
                        <Button
                            colorType="red"
                            sizeType="large"
                            className="shrink-0"
                            onClick={onClickDelete}
                        >
                            ロールを削除する
                        </Button>
                    </div>
                </div>
            )}

            {/* 削除確認ダイアログ */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={onCancelDelete}
                title="ロールの削除"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`「${role.name}」を削除しますか？`}<br />
                        削除後は復元できません。
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button colorType="blue" sizeType="medium" onClick={onCancelDelete}>
                            キャンセル
                        </Button>
                        <Button colorType="red" sizeType="medium" onClick={onConfirmDelete}>
                            削除する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {isDeleteLoading && <LoadingOverlay />}
        </div>
    );
}
