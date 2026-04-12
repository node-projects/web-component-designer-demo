import { sleep } from "@node-projects/web-component-designer";

export async function saveData(data: string | Uint8Array | Blob, fileName: string, fileType: string | null = null, caseSensitive: boolean = false): Promise<string> {
    let file = fileName.replace(/[&\\#,+()$~%'":*?<>{}]/g, '').replaceAll('/', '_');
    if (!caseSensitive) file = file.toLowerCase();
    file += (fileType ? '.' + fileType : '');

    let mimeType = 'application/octet-stream';

    switch (fileType) {
        case 'json':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'application/json';
            break;
        case 'csv':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'text/csv;charset=utf-8;';
            break;
        case 'txt':
        case 'log':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'text/plain;charset=utf-8;';
            break;
        case 'xml':
            // add UTF8 BOM to file
            data = '\ufeff' + data;
            mimeType = 'text/xml;charset=utf-8;';
            break;
        case 'xlsx':
            if (typeof data === 'string') data = '\ufeff' + data;
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            break;
        default:
            if (typeof data === 'string') {
                const array = new Uint8Array(data.length);
                for (let i = 0; i < data.length; i++) {
                    array[i] = data.charCodeAt(i);
                }
                data = <any>array;
            }
    }

    // File System Access API
    if ('showSaveFilePicker' in window) {
        try {
            const handle = await (window as any).showSaveFilePicker({
                suggestedName: file,
                types: [
                    {
                        description: fileType?.toUpperCase() + ' Files',
                        accept: { [mimeType]: ['.' + (fileType ?? '')] }
                    }
                ]
            });

            const writable = await handle.createWritable();
            if (typeof data === 'string') {
                await writable.write(new Blob([data], { type: mimeType }));
            } else {
                await writable.write(data); // Uint8Array
            }
            await writable.close();
            console.log('File saved successfully via File System Access API');
            return handle.name;
        } catch (err) {
            console.error('Saving error via File System Access API:', err);
        }
    }

    // Fallback for browsers without File System Access API
    const blob = typeof data === 'string' ? new Blob([data], { type: mimeType }) : data instanceof Uint8Array ? new Blob([(<any>data).buffer], { type: mimeType }) : data;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.style.display = 'none';
    a.download = file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    await sleep(300);

    return file;
}