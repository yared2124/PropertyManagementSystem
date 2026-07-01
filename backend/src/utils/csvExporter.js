import { format } from "fast-csv";
import { Writable } from "stream";

export const generateCSV = (data, columns) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const writable = new Writable({
      write(chunk, encoding, callback) {
        chunks.push(chunk);
        callback();
      },
    });
    const csvStream = format({
      headers: columns.map((c) => c.header),
      writeHeaders: true,
    });
    csvStream.pipe(writable);
    for (const row of data) {
      const csvRow = {};
      for (const col of columns) {
        csvRow[col.header] = row[col.key] ?? "";
      }
      csvStream.write(csvRow);
    }
    csvStream.end();
    writable.on("finish", () => resolve(Buffer.concat(chunks)));
    writable.on("error", reject);
  });
};
