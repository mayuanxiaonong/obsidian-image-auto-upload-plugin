import { MarkdownView, App } from "obsidian";
import { parse } from "path";

interface Image {
  path: string;
  name: string;
  source: string;
}
// ![](./dsa/aa.png) local image should has ext
// ![](https://dasdasda) internet image should not has ext
const REGEX_FILE = /\!\[([^\]]*?)\]\(([^\)]*?)\)/g;
const REGEX_WIKI_FILE = /\!\[\[((?!]]).*?)?\]\]/g;
export default class Helper {
  app: App;

  constructor(app: App) {
    this.app = app;
  }
  getFrontmatterValue(key: string, defaultValue: any = undefined) {
    const file = this.app.workspace.getActiveFile();
    if (!file) {
      return undefined;
    }
    const path = file.path;
    const cache = this.app.metadataCache.getCache(path);

    let value = defaultValue;
    if (cache?.frontmatter && cache.frontmatter.hasOwnProperty(key)) {
      value = cache.frontmatter[key];
    }
    return value;
  }

  getEditor() {
    const mdView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (mdView) {
      return mdView.editor;
    } else {
      return null;
    }
  }
  getValue() {
    const editor = this.getEditor();
    return editor?.getValue();
  }

  setValue(value: string) {
    const editor = this.getEditor();
    const { left, top } = editor.getScrollInfo();
    const position = editor.getCursor();

    editor.setValue(value);
    editor.scrollTo(left, top);
    editor.setCursor(position);
  }

  // get all file urls, include local and internet
  getAllFiles(): Image[] {
    const editor = this.getEditor();
    let value = editor.getValue();
    return this.getImageLink(value);
  }
  getImageLink(value: string): Image[] {
    const matches = value.matchAll(REGEX_FILE);
    const WikiMatches = value.matchAll(REGEX_WIKI_FILE);

    let fileArray: Image[] = [];

    for (const match of matches) {
      const source = match[0];

      let name = match[1];
      let path = match[2];
      if (name === undefined) {
        name = match[3];
      }
      if (path === undefined) {
        path = match[4];
      }

      fileArray.push({
        path: path,
        name: name,
        source: source,
      });
    }

    for (const match of WikiMatches) {
      const REG_TRIM = /^[\s\|]+|[\s\|]+$/g;
      const source = match[0];
      const path = match[1].replace(REG_TRIM, '');
      let name = parse(path).name;
      // let size = parseInt(source.match(/^(.*?)(\|\s*(\d+)\s*)?\]\]$/)[3]) || undefined
  
      let m2 = match[2]?.replace(/^[\s\|]+|[\s\|]+$/g, '')
      if (m2 && !m2.match(/^\d+$/)) {
          name = m2.match(/^(.*?)(\|\s*\d+)?$/)[1]?.replaceAll(REG_TRIM, '')
      }
      fileArray.push({
        path: path,
        name: name,
        source: source,
      });
    }

    return fileArray;
  }

  hasBlackDomain(src: string, blackDomains: string) {
    if (blackDomains.trim() === "") {
      return false;
    }
    const blackDomainList = blackDomains.split(",").filter(item => item !== "");
    let url = new URL(src);
    const domain = url.hostname;

    return blackDomainList.some(blackDomain => domain.includes(blackDomain));
  }
}
