import fs from "fs";

export interface DB {
  read: () => Promise<any[]>;
  write: (item: any[]) => Promise<void>;
}

export class FileDB implements DB {
  private filePath: string = "";
  constructor(filePath) {
    this.filePath = filePath;
    console.log("DB running on", this.filePath);
  }
  async write(items) {
    return fs.promises.writeFile(this.filePath, JSON.stringify(items));
  }
  async read() {
    try {
      const buff = await fs.promises.readFile(this.filePath, "utf-8");
      return JSON.parse(buff);
    } catch (error) {
      if (error.code === "ENOENT") {
        return [];
      }
    }
  }
}

export class MemoryDB implements DB {
  private data: any[] = [];

  async write(items) {
    this.data = items;
  }
  async read() {
    return this.data;
  }
}
