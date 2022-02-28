import { useState, useEffect } from "react";

export function useDocumentSelection() {
  const [documentSelection, setDocumentSelection] = useState<string | null>(
    null
  );
  useEffect(() => {
    // Handler called by event listener
    function handle() {
      setDocumentSelection(document.getSelection()?.toString() ?? null);
    }

    // Add event listener
    document.addEventListener("selectionchange", handle);

    // Call handler right away so state gets updated with initial value
    handle();

    // Remove event listener on cleanup
    return () => document.removeEventListener("selectionchange", handle);
  }, []); // Empty array ensures that effect is only run on mount
  return documentSelection;
}
