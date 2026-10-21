import { Builder } from "./builder.ts";
import { ParsingExtraction } from "./ExtractMembers/parseJson.ts";
import { TableRow } from "./types.ts";


/*
    @ opt one:
    const b = Extract(filename);
    return (TableRow[])
    @ opt two:

    const csv = `Name,Age,City
            Ana,25,Casablanca
            John,30,London
    Sara,22,Paris`;
    const b = Extract();

    b.parse_csv(csv);
*/


type FileHandler = (text: string) => TableRow[];

export class Extract extends Builder
{
    protected ex = new ParsingExtraction;
    protected extensions: Map<string, FileHandler> = new Map([
        [".csv", this.ex.parse_csv],
        [".json", this.ex.parse_json],
        [".txt", this.ex.parse_text],
        [".text", this.ex.parse_text]
    ]);

    constructor(file: string) {
        super();
        this.parse_file(file);
    }

    async parse_file(file: string): Promise<TableRow[]>
    {
        const extension = [...this.extensions.keys()]
            .find(ext => file.endsWith(ext));

        if (!extension)
            throw new Error("Unsupported file extension");

        const text_file = await Deno.readTextFile(file);
        const handler = this.extensions.get(extension)!;

        return handler(text_file);
    }

    parseJson(text : string)
    {
        return (this.ex.parse_json(text));
    }

    parseCsv(text : string)
    {
        return (this.ex.parse_csv(text));
    }

    parseText(text : string)
    {
        return (this.ex.parse_text(text));
    }
}