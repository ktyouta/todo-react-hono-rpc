import { Button, Dialog, LoadingOverlay, Textbox } from "@/components";
import { getFormatDatetime } from "@/utils/date-util";
import { HiArrowLeft, HiLockClosed } from "react-icons/hi2";
import { useRoleManagementDetail } from "../hooks/use-role-management-detail";

type PropsType = ReturnType<typeof useRoleManagementDetail>;

export function RoleManagementDetail(props: PropsType) {
    const {
        role,
        permissionList,
        selectedPermissionIds,
        requiredPermissionIds,
        togglePermission,
        register,
        errors,
        clickSave,
        onClickBack,
        isEditMode,
        onClickEdit,
        onClickCancel,
        isSaveDialogOpen,
        onCancelSave,
        onConfirmSave,
        isSaveLoading,
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
            <div className="flex items-center pr-[10px] mb-4">
                <span className="font-bold text-[18px] sm:text-[22px]">ロール詳細</span>
                <div className="flex-1" />
                {isEditMode ? (
                    <div className="flex gap-2 sm:gap-3">
                        <Button
                            colorType="green"
                            sizeType="large"
                            className="px-4 sm:px-6 bg-gray-400 hover:bg-gray-500"
                            onClick={onClickCancel}
                        >
                            キャンセル
                        </Button>
                        <Button
                            colorType="green"
                            sizeType="large"
                            className="px-4 sm:px-10 bg-cyan-500 hover:bg-cyan-600"
                            onClick={clickSave}
                        >
                            保存
                        </Button>
                    </div>
                ) : (
                    !role.isImmutable && (
                        <Button
                            colorType="green"
                            sizeType="large"
                            className="px-4 sm:px-8 bg-cyan-500 hover:bg-cyan-600"
                            onClick={onClickEdit}
                        >
                            編集
                        </Button>
                    )
                )}
            </div>

            {/* バリデーションエラーバナー */}
            {isEditMode && Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2.5 mb-4 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                    <span>入力内容にエラーがあります。確認してください。</span>
                </div>
            )}

            {/* ロール情報 */}
            <div className="w-full p-3 sm:p-5 border border-[#c0c0c0] rounded bg-white mb-4 sm:mb-6">
                <p className="text-base text-gray-500 font-medium mb-4">ロール情報</p>

                {isEditMode ? (
                    /* 編集モード */
                    <div className="flex flex-col gap-6">
                        {/* ロール名 */}
                        <div>
                            <label className="block mb-2 text-[15px]">ロール名（1〜50文字）</label>
                            <Textbox
                                registration={register("name")}
                                className="w-full border-[#c0c0c0]"
                                type="text"
                                maxLength={50}
                                autoComplete="off"
                            />
                            {errors.name?.message && (
                                <p className="text-red-500 pl-1 mt-2 text-sm">{errors.name.message}</p>
                            )}
                        </div>

                        {/* パーミッション */}
                        <div>
                            <label className="block mb-2 text-[15px]">パーミッション</label>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-5">
                                {permissionList.map((permission) => {
                                    const isChecked = selectedPermissionIds.includes(permission.permissionId);
                                    const isRequired = requiredPermissionIds.includes(permission.permissionId);
                                    const isDisabled = isRequired && isChecked;

                                    let labelClass = "flex items-center gap-2 px-3 py-2.5 border rounded transition-colors ";
                                    if (isDisabled) {
                                        labelClass += "border-cyan-500 bg-cyan-50 text-cyan-700 cursor-not-allowed";
                                    } else if (isChecked) {
                                        labelClass += "border-cyan-500 bg-cyan-50 text-cyan-700 cursor-pointer";
                                    } else if (isRequired) {
                                        labelClass += "border-amber-400 bg-amber-50 cursor-pointer";
                                    } else {
                                        labelClass += "border-[#c0c0c0] bg-white hover:bg-gray-50 cursor-pointer";
                                    }

                                    return (
                                        <label
                                            key={permission.permissionId}
                                            className={labelClass}
                                        >
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-cyan-500 shrink-0"
                                                checked={isChecked}
                                                disabled={isDisabled}
                                                onChange={() => togglePermission(permission.permissionId)}
                                            />
                                            <span className="text-sm break-words min-w-0 flex-1">{permission.screenName}</span>
                                            {isRequired && (
                                                <span className="flex items-center gap-0.5 text-xs text-amber-600 whitespace-nowrap shrink-0">
                                                    <HiLockClosed className="size-3" />
                                                    必須
                                                </span>
                                            )}
                                        </label>
                                    );
                                })}
                            </div>
                            {errors.permissionIds?.message && (
                                <p className="text-red-500 pl-1 mt-3 text-sm">{errors.permissionIds.message}</p>
                            )}
                        </div>
                    </div>
                ) : (
                    /* 閲覧モード */
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="whitespace-nowrap w-[7em] text-gray-500 text-base">ロール名</span>
                            <span className="flex-1 px-3 py-2 bg-gray-50 border border-[#e0e0e0] rounded text-lg">{role.name}</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-gray-500 text-base">パーミッション</span>
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
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-[3%]">
                            <div className="flex flex-1 items-center gap-2">
                                <span className="whitespace-nowrap w-[7em] text-gray-500 text-base">登録日</span>
                                <span className="flex-1 px-3 py-2 text-base text-gray-700">{getFormatDatetime(new Date(role.createdAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                            </div>
                            <div className="flex flex-1 items-center gap-2">
                                <span className="whitespace-nowrap w-[7em] text-gray-500 text-base">更新日</span>
                                <span className="flex-1 px-3 py-2 text-base text-gray-700">{getFormatDatetime(new Date(role.updatedAt), 'yyyy-MM-dd HH:mm:ss')}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Danger Zone（isProtected なら非表示・編集モード中も非表示） */}
            {!role.isProtected && !isEditMode && (
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

            {/* 保存確認ダイアログ */}
            <Dialog
                isOpen={isSaveDialogOpen}
                onClose={onCancelSave}
                title="ロールの更新"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">{`「${role.name}」を更新しますか？`}</p>
                    <div className="flex justify-end gap-2">
                        <Button colorType="blue" sizeType="medium" onClick={onCancelSave}>
                            キャンセル
                        </Button>
                        <Button colorType="blue" sizeType="medium" onClick={onConfirmSave}>
                            更新する
                        </Button>
                    </div>
                </div>
            </Dialog>

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

            {(isSaveLoading || isDeleteLoading) && <LoadingOverlay />}
        </div>
    );
}
