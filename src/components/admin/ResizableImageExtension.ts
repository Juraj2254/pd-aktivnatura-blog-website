import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ResizableImage } from "./ResizableImage";

export const ResizableImageExtension = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width") || element.style.width || "auto",
        renderHTML: (attributes) => {
          if (!attributes.width || attributes.width === "auto") {
            return {};
          }
          return { width: attributes.width, style: `width: ${attributes.width}` };
        },
      },
      align: {
        default: "center",
        parseHTML: (element) => {
          const parent = element.parentElement;
          if (parent?.style.textAlign) return parent.style.textAlign;
          if (element.getAttribute("data-align")) return element.getAttribute("data-align");
          return "center";
        },
        renderHTML: (attributes) => {
          return { "data-align": attributes.align };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImage);
  },
});
