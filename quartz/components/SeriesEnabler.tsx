import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

import * as fs from 'fs';
import * as path from 'path';

function sluggify(s: string): string {
  return s
    .split("/")
    .map((segment) =>
      segment
        .replace(/\s/g, "-")
        .replace(/&/g, "-and-")
        .replace(/%/g, "-percent")
        .replace(/\?/g, "")
        .replace(/#/g, ""),
    )
    .join("/") // always use / as sep
    .replace(/\/$/, "")
}


const listDirectory = (dirPath: string): string[] => {
  try {
    const files = fs.readdirSync(dirPath); // List files in the directory

    const mdFiles = files.filter(file => path.extname(file) === '.md').sort();

    return mdFiles;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

const SeriesEnabler: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {

  if (fileData.filePath !== undefined && fileData.filePath !== null) {
    console.log(fileData.filePath);
    const folderPath = path.join(path.dirname(fileData.filePath));
    const files = listDirectory(folderPath);
    const filename = path.basename(fileData.filePath);
    const parentDir = path.basename(path.dirname(fileData.filePath));

    const processedItems = [];

    if (files.length > 1) {
      // Read all files and get their title

      for(let i = 0; i < files.length; i++) {
        try {
          const data = fs.readFileSync(folderPath + "/" + files[i], "utf8");
          const regex = /---\s*([\s\S]+?)\s*---/;
          const match = data.match(regex);
          
          if (match && match[1]) {
            const lines = match[1].split('\n');
            const mapping: { [key: string]: string } = {};

            lines.forEach((line) => {
              const [key, value] = line.split(':').map((str) => str.trim());
              if (key && value) {
                mapping[key] = value;
              }
            });

            // TODO: process the url as in quartz

            let url = files[i].replace(/\.md$/, "");
            url = sluggify(url);

            processedItems.push({
              "url": url,
              "title": mapping.title,
              "current": filename === files[i]
            })
          }
        } catch(error) {
          console.log("error while reading file");
        }

      }

      return <table class="series-table">
      <thead style="background: var(--dark);">
        <tr>
          <td>{parentDir} ({files.length} Part Series)</td>
        </tr>
      </thead>
      <tbody>
        {processedItems.map((i, idx) => {

          return (
            <tr>
              <td><a style={i.current ? {color: "var(--dark)"} : {}} href={i.url}>{(idx+1) + ". " + i.title}</a></td>
            </tr>
          )
        }
        )}
      </tbody>
    </table>
    }
  }

  return null
}

SeriesEnabler.css = `
.series-table {
  text-align: center;
	position: relative;
	box-sizing: border-box;
	margin-left: auto;
	margin-right: auto;
	overflow-x: hidden;
	border: 1px solid var(--lightgray);
  border-spacing: 0;
  min-width: 350px;
}
.series-table thead tr td {
  font-weight: bold;
  font-size: 20px;
  text-decoration: underline;
  color: white;
}
.series-table tbody tr {
  text-align: left;
  font-size: 18px;
}
`

export default (() => SeriesEnabler) satisfies QuartzComponentConstructor
