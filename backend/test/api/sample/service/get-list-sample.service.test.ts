import { describe, it, expect, vi, beforeEach } from "vitest";
import { GetListSampleEntity } from "../../../../src/api/sample/entity";
import { GetListSampleService } from "../../../../src/api/sample/service";
import type { IGetListSampleRepository } from "../../../../src/api/sample/repository";

describe("GetListSampleService (get-list)", () => {
  let mockRepository: IGetListSampleRepository;
  let service: GetListSampleService;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
    };
    service = new GetListSampleService(mockRepository);
  });

  it("findAll - エンティティ配列を返すこと", async () => {
    vi.mocked(mockRepository.findAll).mockResolvedValue([
      {
        id: 1,
        name: "テスト1",
        description: "説明1",
        deleteFlg: "0",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
      {
        id: 2,
        name: "テスト2",
        description: null,
        deleteFlg: "0",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    ]);

    const result = await service.findAll();

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(GetListSampleEntity);
    expect(result[0].id).toBe(1);
    expect(result[1].description).toBeNull();
  });
});
