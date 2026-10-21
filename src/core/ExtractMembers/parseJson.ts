import {TableRow, TableCell} from "../types.ts"
import { Builder } from "../builder.ts";


/*
 * Base class for building tables row-by-row.
 * Usage:
 * ```ts
 * @example
 * const b = new ParsingExtraction()
 *   .parse_json("json_format_text")
 * 
 * return TableRow[]
 * ```
*/


export class   ParsingExtraction
{
    parse_json(text_file: string): TableRow[]
    {
        const extracted_json = JSON.parse(text_file) as TableRow[];
    
        return extracted_json.flatMap((row) =>
            new Builder().add(...row).build()
        );
    }
    
    
    parse_csv(text_file: string): TableRow[]
    {
        return text_file
            .trim()
            .split(/\r?\n/)
            .map((row) =>
                row.match(/("(?:[^"]|"")*"|[^,]*)(,|$)/g)!
                    .map((cell) =>
                        cell
                            .replace(/,$/, "")
                            .replace(/^"|"$/g, "")
                            .replace(/""/g, '"')
                    )
        );
    }
    
    
    parse_text(text: string): TableRow[]
    {
        if (!text.trim()) 
            return [];

        return text.split(/\r?\n/).map((line) =>
            line.split("|").map((cell) => cell.trim())
        );
    }

}