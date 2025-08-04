
import { fileSystemData, type FileSystemNode } from '../data/fileSystemData';

class FileSystemService {
    private root: FileSystemNode;

    constructor() {
        this.root = fileSystemData;
    }

    public getTree(): FileSystemNode {
        return this.root;
    }

    public getFileContent(path: string): string | null {
        const parts = path.split('/').filter(p => p);
        let currentNode = this.root;

        for (const part of parts) {
            if (!currentNode.children) {
                return null; // Path goes deeper than available children
            }
            const nextNode = currentNode.children.find(node => node.name === part);
            if (!nextNode) {
                return null; // Path part not found
            }
            currentNode = nextNode;
        }

        return currentNode.content ?? null;
    }

    public saveFileContent(path: string, newContent: string): boolean {
        const parts = path.split('/').filter(Boolean);
        let current: FileSystemNode | undefined = this.root;
        for (const part of parts) {
            if (!current?.children) return false;
            current = current.children.find(c => c.name === part);
        }
        if (current && typeof current.content === 'string') {
            current.content = newContent;
            return true;
        }
        return false;
    }
}

export const fileSystemService = new FileSystemService();
