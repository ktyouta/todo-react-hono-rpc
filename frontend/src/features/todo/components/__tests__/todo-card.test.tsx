import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { TodoCard } from "../todo-card";

type EntryType = React.ComponentProps<typeof TodoCard>['entry'];

const dummyEntry: EntryType = {
    id: 1,
    title: "12345678901234567890123456789011234567890123456789012345678901234567890123456789012345678901234567890123456789012345678902345678901234567890",
    content: null,
    categoryId: 1,
    categoryName: "タスク",
    statusId: 1,
    statusName: "未着手",
    priorityId: 2,
    priorityName: "中",
    dueDate: null,
    userId: 1,
    isFavorite: false,
    deleteFlg: false,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
};

describe("TodoCard", () => {
    test("タイトルにline-clampとbreak-wordsの両方のクラスが付与されている", () => {
        render(
            <TodoCard
                entry={dummyEntry}
                onClick={() => { }}
                onFavoriteToggle={() => { }}
                isBulkMode={false}
                isSelected={false}
                onSelect={() => { }}
            />
        );

        const title = screen.getByText(dummyEntry.title);
        expect(title).toHaveClass("line-clamp-2");
        expect(title).toHaveClass("break-words");
    });
});
