import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Save,
  Eye,
  Send,
  X,
  Plus
} from "lucide-react";

interface PostEditorProps {
  initialData?: {
    title: string;
    content: string;
    excerpt: string;
    tags: string[];
    coverImage?: string;
    status: "draft" | "published";
  };
  onSave?: (data: any) => void;
  onPublish?: (data: any) => void;
  onPreview?: (data: any) => void;
  isLoading?: boolean;
}

export default function PostEditor({
  initialData,
  onSave,
  onPublish,
  onPreview,
  isLoading = false
}: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    tags: initialData?.tags || [],
    coverImage: initialData?.coverImage || "",
    status: initialData?.status || "draft" as "draft" | "published"
  });
  
  const [newTag, setNewTag] = useState("");
  const [isPublished, setIsPublished] = useState(formData.status === "published");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
      console.log('Tag added:', newTag.trim());
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
    console.log('Tag removed:', tagToRemove);
  };

  const handleSave = () => {
    const dataToSave = {
      ...formData,
      status: "draft" as const
    };
    onSave?.(dataToSave);
    console.log('Post saved as draft:', dataToSave);
  };

  const handlePublish = () => {
    const dataToPublish = {
      ...formData,
      status: "published" as const
    };
    onPublish?.(dataToPublish);
    console.log('Post published:', dataToPublish);
  };

  const handlePreview = () => {
    onPreview?.(formData);
    console.log('Preview requested:', formData);
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => console.log('Bold formatting') },
    { icon: Italic, label: "Italic", action: () => console.log('Italic formatting') },
    { icon: Underline, label: "Underline", action: () => console.log('Underline formatting') },
    { icon: List, label: "Bullet List", action: () => console.log('Bullet list') },
    { icon: ListOrdered, label: "Numbered List", action: () => console.log('Numbered list') },
    { icon: Link, label: "Insert Link", action: () => console.log('Insert link') },
    { icon: Image, label: "Insert Image", action: () => console.log('Insert image') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {initialData ? 'Edit Post' : 'Create New Post'}
          </h1>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={handlePreview}
              disabled={isLoading}
              data-testid="button-preview"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            
            <Button
              variant="outline"
              onClick={handleSave}
              disabled={isLoading}
              data-testid="button-save-draft"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              onClick={handlePublish}
              disabled={isLoading || !formData.title || !formData.content}
              data-testid="button-publish"
            >
              <Send className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Input
                data-testid="input-title"
                placeholder="Enter your post title..."
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="text-2xl font-bold border-none px-0 placeholder:text-muted-foreground focus-visible:ring-0"
                disabled={isLoading}
              />
            </div>

            {/* Cover Image */}
            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                data-testid="input-cover-image"
                placeholder="https://example.com/image.jpg"
                value={formData.coverImage}
                onChange={(e) => handleInputChange('coverImage', e.target.value)}
                disabled={isLoading}
              />
              {formData.coverImage && (
                <div className="aspect-[16/9] overflow-hidden rounded-md border">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Content Editor */}
            <Card>
              <CardHeader className="pb-3">
                {/* Toolbar */}
                <div className="flex items-center space-x-1">
                  {toolbarButtons.map((button, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={button.action}
                      className="h-8 w-8 p-0"
                      data-testid={`button-${button.label.toLowerCase().replace(' ', '-')}`}
                    >
                      <button.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <Separator />
              </CardHeader>
              
              <CardContent>
                <Textarea
                  data-testid="textarea-content"
                  placeholder="Start writing your story..."
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="min-h-[400px] border-none resize-none focus-visible:ring-0 text-base leading-relaxed"
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Publish Settings</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="publish-toggle">Publish immediately</Label>
                  <Switch
                    id="publish-toggle"
                    checked={isPublished}
                    onCheckedChange={setIsPublished}
                    data-testid="switch-publish"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(value) => 
                    handleInputChange('status', value)
                  }>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Tags</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    data-testid="input-new-tag"
                    placeholder="Add a tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    onClick={addTag}
                    disabled={!newTag.trim()}
                    data-testid="button-add-tag"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                        data-testid={`button-remove-tag-${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Excerpt</h3>
              </CardHeader>
              <CardContent>
                <Textarea
                  data-testid="textarea-excerpt"
                  placeholder="Write a brief description of your post..."
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  className="min-h-[100px] resize-none"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {formData.excerpt.length}/160 characters
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}