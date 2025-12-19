import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AlignLeft, AlignCenter, AlignRight, GripHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResizableImage({ node, updateAttributes, selected }: NodeViewProps) {
  const [isResizing, setIsResizing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    startX.current = e.clientX;
    startWidth.current = imageRef.current?.offsetWidth || 300;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX.current;
      const newWidth = Math.max(100, startWidth.current + diff);
      updateAttributes({ width: `${newWidth}px` });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [updateAttributes]);

  const setAlignment = useCallback((align: string) => {
    updateAttributes({ align });
  }, [updateAttributes]);

  const align = node.attrs.align || "center";
  const width = node.attrs.width || "auto";

  return (
    <NodeViewWrapper 
      className={cn(
        "relative my-4 group",
        align === "left" && "flex justify-start",
        align === "center" && "flex justify-center",
        align === "right" && "flex justify-end"
      )}
    >
      <div className="relative inline-block">
        {/* Image */}
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          style={{ width: width !== "auto" ? width : undefined }}
          className={cn(
            "rounded-lg transition-all max-w-full",
            selected && "ring-2 ring-primary ring-offset-2",
            isResizing && "select-none"
          )}
          draggable={false}
        />

        {/* Controls - show when selected */}
        {selected && (
          <>
            {/* Alignment toolbar */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-white dark:bg-neutral-800 border rounded-lg shadow-lg p-1 z-10">
              <Button
                type="button"
                size="sm"
                variant={align === "left" ? "default" : "ghost"}
                className="h-7 w-7 p-0"
                onClick={() => setAlignment("left")}
                title="Poravnaj lijevo"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant={align === "center" ? "default" : "ghost"}
                className="h-7 w-7 p-0"
                onClick={() => setAlignment("center")}
                title="Centriraj"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="sm"
                variant={align === "right" ? "default" : "ghost"}
                className="h-7 w-7 p-0"
                onClick={() => setAlignment("right")}
                title="Poravnaj desno"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Resize handle */}
            <div
              onMouseDown={handleMouseDown}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-12 bg-white dark:bg-neutral-800 border rounded-md shadow-lg cursor-ew-resize flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors z-10"
              title="Povuci za promjenu veličine"
            >
              <GripHorizontal className="h-4 w-4 text-gray-500 rotate-90" />
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
