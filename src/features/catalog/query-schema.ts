import { z } from "zod";

import {
  storyLifecycles,
  storySortOrders,
  type CatalogQuery,
} from "./model.ts";
import { normalizeQueryWhitespace } from "./search-normalization.ts";

const categorySlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const pagePattern = /^[1-9]\d*$/;

export const categorySlugSchema = z.string().regex(categorySlugPattern, {
  error: "Slug phải gồm chữ thường, số và dấu gạch ngang đơn.",
});

const queryFields = {
  q: z
    .string()
    .trim()
    .max(100)
    .transform(normalizeQueryWhitespace)
    .optional()
    .default(""),
  category: z.preprocess(
    (value) => (value === "" ? undefined : value),
    categorySlugSchema.optional(),
  ),
  status: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.enum(storyLifecycles).optional(),
  ),
  sort: z.enum(storySortOrders).optional().default("updated"),
  page: z
    .string()
    .regex(pagePattern)
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default(1),
} as const;

const searchQuerySchema = z.strictObject(queryFields);
const categoryQuerySchema = z.strictObject({
  status: queryFields.status,
  sort: queryFields.sort,
  page: queryFields.page,
});

type ParsedQueryFields = {
  readonly q?: string;
  readonly category?: string;
  readonly status?: CatalogQuery["status"];
  readonly sort: CatalogQuery["sort"];
  readonly page: number;
};

const searchQueryKeys = new Set(["q", "category", "status", "sort", "page"]);
const categoryQueryKeys = new Set(["status", "sort", "page"]);

export interface QueryValidationIssue {
  readonly field: string;
  readonly code: "duplicate" | "unsupported" | "invalid";
  readonly message: string;
}

export type QueryParseResult =
  | { readonly success: true; readonly data: CatalogQuery }
  | { readonly success: false; readonly issues: readonly QueryValidationIssue[] };

function fieldMessage(field: string): string {
  switch (field) {
    case "q":
      return "Từ khóa phải là chuỗi không quá 100 ký tự.";
    case "category":
      return "Thể loại phải là slug hợp lệ.";
    case "status":
      return "Trạng thái phải là ongoing, completed hoặc hiatus.";
    case "sort":
      return "Thứ tự phải là updated, newest hoặc title.";
    case "page":
      return "Trang phải là số nguyên từ 1 đến 100.";
    default:
      return "Giá trị truy vấn không hợp lệ.";
  }
}

function parseQuery(
  input: Readonly<Record<string, unknown>>,
  allowedKeys: ReadonlySet<string>,
  schema: z.ZodType<ParsedQueryFields>,
): QueryParseResult {
  const issues: QueryValidationIssue[] = [];
  const scalarInput: Record<string, string | undefined> = {};

  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {
      success: false,
      issues: [
        {
          field: "_query",
          code: "invalid",
          message: "Tham số truy vấn phải là một đối tượng.",
        },
      ],
    };
  }

  for (const [field, value] of Object.entries(input)) {
    if (!allowedKeys.has(field)) {
      issues.push({
        field,
        code: "unsupported",
        message: "Tham số truy vấn không được hỗ trợ.",
      });
      continue;
    }

    if (Array.isArray(value)) {
      issues.push({
        field,
        code: "duplicate",
        message: "Tham số truy vấn chỉ được xuất hiện một lần.",
      });
      continue;
    }

    if (typeof value !== "string") {
      issues.push({
        field,
        code: "invalid",
        message: fieldMessage(field),
      });
      continue;
    }

    scalarInput[field] = value;
  }

  const result = schema.safeParse(scalarInput);

  if (!result.success) {
    const seen = new Set(issues.map((issue) => issue.field));
    for (const issue of result.error.issues) {
      const pathField = issue.path[0];
      const field = typeof pathField === "string" ? pathField : "_query";
      if (seen.has(field)) {
        continue;
      }
      seen.add(field);
      issues.push({
        field,
        code: "invalid",
        message: fieldMessage(field),
      });
    }
  }

  if (issues.length > 0) {
    return { success: false, issues };
  }

  if (!result.success) {
    return {
      success: false,
      issues: [
        {
          field: "_query",
          code: "invalid",
          message: "Tham số truy vấn không hợp lệ.",
        },
      ],
    };
  }

  return {
    success: true,
    data: {
      q: result.data.q ?? "",
      category: result.data.category,
      status: result.data.status,
      sort: result.data.sort,
      page: result.data.page,
    },
  };
}

export function parseSearchQuery(
  input: Readonly<Record<string, unknown>>,
): QueryParseResult {
  return parseQuery(input, searchQueryKeys, searchQuerySchema);
}

export function parseCategoryQuery(
  input: Readonly<Record<string, unknown>>,
): QueryParseResult {
  return parseQuery(input, categoryQueryKeys, categoryQuerySchema);
}

export function hasCatalogSearchCriteria(query: CatalogQuery): boolean {
  return (
    query.q.length > 0 ||
    query.category !== undefined ||
    query.status !== undefined
  );
}
