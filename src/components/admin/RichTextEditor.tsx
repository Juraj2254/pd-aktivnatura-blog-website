import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import FontFamily from "@tiptap/extension-font-family";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  RemoveFormatting,
  Type,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Upload } from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [imageTab, setImageTab] = useState<string>("upload");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // Disabled headings
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Force re-render toolbar on selection or transaction changes so isActive() stays in sync
  const [toolbarRefreshKey, setToolbarRefreshKey] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const onChange = () => setToolbarRefreshKey((k) => k + 1);
    editor.on('selectionUpdate', onChange);
    editor.on('transaction', onChange);
    editor.on('update', onChange);
    editor.on('focus', onChange);
    editor.on('blur', onChange);
    return () => {
      editor.off('selectionUpdate', onChange);
      editor.off('transaction', onChange);
      editor.off('update', onChange);
      editor.off('focus', onChange);
      editor.off('blur', onChange);
    };
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    
    setLinkUrl("");
    setIsLinkDialogOpen(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (!editor) return;
    
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
    }
    
    setImageUrl("");
    setIsImageDialogOpen(false);
  }, [editor, imageUrl]);

  const handleImageUploaded = useCallback((url: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url }).run();
      setIsImageDialogOpen(false);
    }
  }, [editor]);

  const setFontSize = useCallback((size: string) => {
    if (editor) {
      editor.chain().focus().setMark('textStyle', { fontSize: size }).run();
    }
  }, [editor]);

  const applyTextColor = useCallback(() => {
    if (editor && textColor) {
      editor.chain().focus().setColor(textColor).run();
    }
  }, [editor, textColor]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({
    onClick,
    isActive = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      aria-pressed={isActive}
      data-state={isActive ? "on" : "off"}
      className={cn(
        "h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-accent transition-all focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background",
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm ring-1 ring-primary/20"
      )}
      title={title}
    >
      {children}
    </Button>
  );

  return (
    <div className="w-full max-w-4xl border border-input rounded-md bg-background">
      {/* Toolbar */}
      <div key={toolbarRefreshKey} className="border-b border-input p-1.5 sm:p-2 flex flex-wrap gap-0.5 sm:gap-1 sticky top-0 z-10 bg-background">
        {/* Text Formatting */}
        <div className="flex gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-input">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
        </div>

        {/* Font Size Dropdown */}
        <div className="flex gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-input items-center">
          <Select onValueChange={setFontSize}>
            <SelectTrigger className="w-[80px] sm:w-[100px] h-7 sm:h-8 text-xs bg-background">
              <Type className="h-3 w-3 mr-1" />
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent side="bottom" align="start" className="z-50">
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
              <SelectItem value="28px">28px</SelectItem>
              <SelectItem value="32px">32px</SelectItem>
              <SelectItem value="36px">36px</SelectItem>
              <SelectItem value="40px">40px</SelectItem>
              <SelectItem value="44px">44px</SelectItem>
              <SelectItem value="48px">48px</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color Picker */}
        <div className="flex gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-input">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0"
                title="Text Color"
              >
                <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="space-y-3">
                <Label htmlFor="text-color">Text Color</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="text-color"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-full cursor-pointer"
                  />
                  <Button onClick={applyTextColor} size="sm">
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Lists */}
        <div className="flex gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-input">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
        </div>

        {/* Text Alignment */}
        <div className="flex gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-input">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            title="Justify"
          >
            <AlignJustify className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
        </div>

        {/* Links and Images */}
        <div className="flex gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-input">
          <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-accent"
                title="Add Link"
              >
                <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Link</DialogTitle>
                <DialogDescription>
                  Enter the URL you want to link to
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="link-url">URL</Label>
                  <Input
                    id="link-url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={(e) => e.key === "Enter" && addLink()}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={addLink}>Add Link</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-accent"
                title="Add Image"
              >
                <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Dodaj Sliku</DialogTitle>
                <DialogDescription>
                  Uploadujte sliku ili unesite URL
                </DialogDescription>
              </DialogHeader>
              <div className="pt-4">
                <Tabs value={imageTab} onValueChange={setImageTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="upload">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </TabsTrigger>
                    <TabsTrigger value="url">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      URL
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="upload" className="space-y-4 mt-4">
                    <ImageUpload
                      onImageUploaded={handleImageUploaded}
                      label="Odaberi sliku"
                    />
                  </TabsContent>
                  
                  <TabsContent value="url" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => e.key === "Enter" && addImage()}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                        Otkaži
                      </Button>
                      <Button onClick={addImage}>Dodaj</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Utility */}
        <div className="flex gap-0.5 sm:gap-1 pr-1.5 sm:pr-2 border-r border-input">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
        </div>

        <div className="flex gap-0.5 sm:gap-1">
          <MenuButton
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <RemoveFormatting className="h-3 w-3 sm:h-4 sm:w-4" />
          </MenuButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[250px] sm:min-h-[400px] md:min-h-[500px] overflow-y-auto bg-background">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none p-3 sm:p-4 focus:outline-none text-sm sm:text-base text-foreground [&_.ProseMirror]:min-h-[250px] [&_.ProseMirror]:sm:min-h-[400px] [&_.ProseMirror]:md:min-h-[500px] [&_.ProseMirror]:text-foreground [&_.ProseMirror]:caret-foreground"
        />
      </div>
    </div>
  );
}
