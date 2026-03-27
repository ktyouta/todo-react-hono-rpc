import { Button, Dialog, LoadingOverlay, Select, Textbox } from "@/components";
import { getFormatDatetime } from "@/utils/date-util";
import { Controller } from "react-hook-form";
import { HiArrowLeft } from "react-icons/hi2";
import { useUserManagementDetail } from "../hooks/use-user-management-detail";

type PropsType = ReturnType<typeof useUserManagementDetail>;

export function UserManagementDetail(props: PropsType) {
    const {
        user,
        onClickBack,
        roleForm,
        clickSaveRole,
        isRoleDialogOpen,
        onCancelSaveRole,
        onConfirmSaveRole,
        isRoleLoading,
        passwordForm,
        clickSavePassword,
        isPasswordDialogOpen,
        onCancelSavePassword,
        onConfirmSavePassword,
        isPasswordLoading,
        isDeleteDialogOpen,
        onClickDelete,
        onCancelDelete,
        onConfirmDelete,
        isDeleteLoading,
        roleList,
        loginUser,
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

            {/* ロール変更 */}
            <div className="w-full p-3 sm:p-5 border border-[#c0c0c0] rounded bg-white mb-4 sm:mb-6">
                <p className="text-base text-gray-500 font-medium mb-4">ロール変更</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:flex-1 sm:max-w-xs">
                        <Controller
                            name="roleId"
                            control={roleForm.control}
                            render={({ field }) => (
                                <Select
                                    value={String(field.value)}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    options={[
                                        ...roleList.map((u) => ({ value: String(u.id), label: u.name })),
                                    ]}
                                    className="w-full px-3 py-2.5 text-base border-[#c0c0c0]"
                                />
                            )}
                        />
                        {roleForm.formState.errors.roleId && (
                            <p className="text-sm text-red-500 mt-1">{roleForm.formState.errors.roleId.message}</p>
                        )}
                    </div>
                    <Button
                        colorType="blue"
                        sizeType="large"
                        onClick={clickSaveRole}
                        disabled={isRoleLoading}
                        className="w-full sm:w-auto shrink-0"
                    >
                        保存
                    </Button>
                </div>
            </div>

            {/* パスワードリセット */}
            <div className="w-full p-3 sm:p-5 border border-[#c0c0c0] rounded bg-white mb-4 sm:mb-6">
                <p className="text-base text-gray-500 font-medium mb-4">パスワードリセット</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="w-full sm:flex-1 sm:max-w-xs">
                        <Textbox
                            type="password"
                            placeholder="新しいパスワード（8文字以上）"
                            className="w-full h-auto py-2.5 border-[#c0c0c0]"
                            {...passwordForm.register('newPassword')}
                        />
                        {passwordForm.formState.errors.newPassword && (
                            <p className="text-sm text-red-500 mt-1">{passwordForm.formState.errors.newPassword.message}</p>
                        )}
                    </div>
                    <div className="w-full sm:flex-1 sm:max-w-xs">
                        <Textbox
                            type="password"
                            placeholder="確認用パスワード"
                            className="w-full h-auto py-2.5 border-[#c0c0c0]"
                            {...passwordForm.register('confirmPassword')}
                        />
                        {passwordForm.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500 mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <Button
                        colorType="blue"
                        sizeType="large"
                        onClick={clickSavePassword}
                        disabled={isPasswordLoading}
                        className="w-full sm:w-auto shrink-0"
                    >
                        設定
                    </Button>
                </div>
            </div>

            {/* 削除エリア */}
            <div className="mt-4 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3 sm:p-5 border border-red-200 rounded bg-red-50">
                    <div>
                        <p className="text-sm font-medium text-red-700">ユーザーの削除</p>
                        <p className="text-sm text-gray-500 mt-1">このユーザーを削除します。削除後は削除済みユーザー一覧から復元できます。</p>
                    </div>
                    <Button
                        colorType="red"
                        sizeType="large"
                        className="shrink-0"
                        onClick={onClickDelete}
                    >
                        ユーザーを削除する
                    </Button>
                </div>
            </div>

            {/* ロール変更確認ダイアログ */}
            <Dialog
                isOpen={isRoleDialogOpen}
                onClose={onCancelSaveRole}
                title="ロールの変更"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`${user.name} のロールを変更しますか？`}
                        {
                            user.id !== loginUser?.id &&
                            <>
                                <br /><span className="text-red-600">※他ユーザーのロールを変更します</span>
                            </>
                        }
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button colorType="blue" sizeType="medium" onClick={onCancelSaveRole}>
                            キャンセル
                        </Button>
                        <Button colorType="blue" sizeType="medium" onClick={onConfirmSaveRole}>
                            変更する
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* パスワードリセット確認ダイアログ */}
            <Dialog
                isOpen={isPasswordDialogOpen}
                onClose={onCancelSavePassword}
                title="パスワードのリセット"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`${user.name} のパスワードをリセットしますか？`}
                        {
                            user.id !== loginUser?.id &&
                            <>
                                <br /><span className="text-red-600">※他のユーザーのパスワードを変更します</span>
                            </>
                        }
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button colorType="blue" sizeType="medium" onClick={onCancelSavePassword}>
                            キャンセル
                        </Button>
                        <Button colorType="blue" sizeType="medium" onClick={onConfirmSavePassword}>
                            リセットする
                        </Button>
                    </div>
                </div>
            </Dialog>

            {/* 削除確認ダイアログ */}
            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={onCancelDelete}
                title="ユーザーの削除"
                size="small"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">
                        {`${user.name} を削除しますか？`}<br />
                        削除後は削除済みユーザー一覧から復元できます。
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

            {(isDeleteLoading || isRoleLoading || isPasswordLoading) && <LoadingOverlay />}
        </div>
    );
}
