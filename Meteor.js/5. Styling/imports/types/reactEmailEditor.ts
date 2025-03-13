/**
 * This file contains the unaccessible types for react-email-editor that we need to save the data
 */

export type BodyItem = Array<{
    id: string;
    cells: number[];
    columns: Array<{
        id: string;
        contents: Array<any>;
        values: {};
    }>;
    values: {};
}>;

export type JSONTemplate = {
    counters: Record<string, number>;
    body: {
        id: string | undefined;
        rows: BodyItem;
        headers: BodyItem;
        footers: BodyItem;
        values: {};
    };
    schemaVersion?: number;
};
