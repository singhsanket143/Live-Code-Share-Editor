import { Editor } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

export default function CodeShare() {

    const monacoRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    function handleSetup(editor: editor.IStandaloneCodeEditor) {
        // 1. Attach the editor to the ref
        monacoRef.current = editor;

        // 2. Initialise a shared YJS object
        const sharedObject = new Y.Doc(); // This is a shared YJS document

        // 3. Create a socket provider to share the YJS document
        const provider: WebsocketProvider =  new WebsocketProvider(
            import.meta.env.VITE_WS_URL,
            "random-room-name",
            sharedObject
        );

        // 4. Connect the document to the monaco editor
        const monacoBinding = new MonacoBinding(
            sharedObject.getText("monaco"), 
            monacoRef.current!.getModel()!,
            new Set([monacoRef.current!]),
        );

        console.log("Connected to the websocket provider", provider, monacoBinding);

    }

    return (
        <>
            <Editor 
                height={"100vh"}
                language={"javascript"}
                defaultValue="// Welcome to the live code share"
                theme="vs-dark"
                onMount={handleSetup}
            />
        </>
    )

}