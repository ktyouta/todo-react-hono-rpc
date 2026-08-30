import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { TodoDetailView } from "../todo-detail-view";

vi.mock("../subtask-section-container", () => ({
    SubtaskSectionContainer: () => null,
}));

type TaskType = React.ComponentProps<typeof TodoDetailView>['task'];

const dummyTask: TaskType = {
    id: 1,
    title: "12345678901234567890123456789011234567890123456789012345678901234567890123456789012345678901234567890123456789012345678902345678901234567890",
    content: null,
    userId: 1,
    isFavorite: false,
    deleteFlg: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    parentId: null,
    parentTitle: null,
    ancestors: [],
    categoryId: 1,
    categoryName: "タスク",
    statusId: 1,
    statusName: "未着手",
    priorityId: 2,
    priorityName: "中",
    dueDate: null,
    subtaskCount: 0,
};

describe("TodoDetailView", () => {
    test("タイトルにbreak-wordsとmin-w-0のクラスが付与されている", () => {
        render(
            <TodoDetailView
                task={dummyTask}
                statusList={[]}
                categoryList={[]}
                priorityList={[]}
                isDeleteDialogOpen={false}
                onClickBack={() => { }}
                onClickEdit={() => { }}
                onClickDelete={() => { }}
                onCancelDelete={() => { }}
                onConfirmDelete={() => { }}
                onFavoriteToggle={() => { }}
                onClickTree={() => { }}
                isLoading={false}
            />
        );

        const title = screen.getByText(dummyTask.title);
        expect(title).toHaveClass("break-words");
        expect(title).toHaveClass("min-w-0");
    });
});
