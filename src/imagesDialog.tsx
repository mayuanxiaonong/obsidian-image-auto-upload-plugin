import { App, FileView, Modal, TFile } from "obsidian";
import { VscChevronUp, VscFile, VscGripper } from "react-icons/vsc";
import * as ReactDOM from "react-dom/client";
import * as React from "react";
import * as _ from "lodash";

interface Image {
    path: string;
    name: string;
    source: string;
  }

interface FileItem {
    file: TFile;
    local: Image[];
    remote: Image[];
    expanded?: boolean
}

export class ImageModal extends Modal {


  constructor(app: App, files: FileItem[]) {
    super(app);
    const root = ReactDOM.createRoot(this.contentEl);
    this.titleEl.innerHTML = `All Image Files`;


    const FileContent: React.FC = () => {
        const [expanded, setExpanded] = React.useState(false);
        const [fileType, setFileType] = React.useState<"local" | "remote">("local")

        return (
            <div className="file-dialog-content">
                <select value={fileType} onChange={(e) => setFileType(e.target.value as any)}>
                    <option value="local">Local Images</option>
                    <option value="remote">Remote Images</option>
                </select>
                {
                    _.sortBy(
                        Object.entries(_.groupBy(files.filter((f) => f[fileType].length > 0), (file) => file.file.parent.path)),
                        (v) => v[0]
                    ).map((v) => (
                        <>
                            <div className="file-dialog-h2-container">
                                <h2 className="file-dialog-h2">{v[0]}</h2>
                                {<span>{v[1].length}</span>}
                                <button type="button">
                                    <VscChevronUp />
                                    {/* {expanded ? <VscChevronUp /> : <VscChevronDown />} */}
                                </button>
                            </div>
                            {v[1].map((file) => (
                                <div className="file-item">
                                    <div className="file-item-dragicon">
                                        <VscGripper />
                                    </div>
                                    <div className="file-item-itemicon">
                                        <VscFile />
                                    </div>
                                    <div className="file-item-name">{file.file.name}</div>
                                    {<span>{file[fileType].length}</span>}
                                    <button type="button" onClick={() => {
                                        let leaf = app.workspace.getLeavesOfType("markdown").find((l) => (l.view as FileView)?.file?.path === file.file.path)
                                        if (leaf) {
                                            app.workspace.setActiveLeaf(leaf)
                                        } else {
                                            leaf = app.workspace.getLeaf()
                                            leaf.openFile(file.file)
                                        }
                                        this.close()
                                    }}>
                                        Open
                                    </button>
                                    {/* <button type="button" title={file[fileType][0].path.startsWith("http") ? "Download all images" : "Upload all images"}
                                    onClick={() => helper.downloadAllImageFiles(file.file)}
                                    >
                                        {file[fileType][0].path.startsWith("http")}
                                        {file[fileType][0].path.startsWith("http") ? <VscCloudDownload /> : <VscCloudUpload />}
                                    </button> */}
                            </div>
                            ))}
                        </>
                    ))
                }
            </div>
        )
    }

    root.render(
        <div className="file-dialog">
            <FileContent />

            <div className="file-dialog-row">
                <div className="file-dialog-row-grow" />
                <button type="button" className="mod-cta" onClick={() => this.close()}>
                    OK
                </button>
            </div>
        </div>
    );
  }

//   onComplete: ReorderDialogProps["onComplete"] = async (newItems) => {
//     for (const { item, name } of newItems) {
//       await this.plugin.app.fileManager.renameFile(
//         item,
//         `${item.parent.path}/${name}`
//       );
//     }
//     this.close();
//   };
}
