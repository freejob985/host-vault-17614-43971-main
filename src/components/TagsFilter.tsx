import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Hosting } from '@/types/hosting';

interface TagsFilterProps {
  hostings: Hosting[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
}

export function TagsFilter({ hostings, selectedTags, onTagToggle, onClearAll }: TagsFilterProps) {
  // استخراج جميع التاجات الفريدة مع عدد الاستضافات لكل تاج
  const tagsWithCount = useMemo(() => {
    const tagCounts = new Map<string, number>();
    
    hostings.forEach(hosting => {
      hosting.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count); // ترتيب حسب العدد
  }, [hostings]);

  if (tagsWithCount.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">التاجات</h3>
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs h-6 px-2"
          >
            <X className="w-3 h-3 ml-1" />
            مسح الكل
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tagsWithCount.map(({ tag, count }) => {
          const isSelected = selectedTags.includes(tag);
          
          return (
            <Button
              key={tag}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => onTagToggle(tag)}
              className="h-8 px-3 text-xs font-normal"
            >
              {tag}
              <Badge 
                variant={isSelected ? "secondary" : "outline"}
                className="mr-1 text-xs h-4 px-1.5"
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <span className="text-xs text-muted-foreground">محدد:</span>
          {selectedTags.map(tag => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs h-5 px-2 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
              onClick={() => onTagToggle(tag)}
            >
              {tag}
              <X className="w-3 h-3 mr-1" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
