import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagsInput({ value, onChange, placeholder }: TagsInputProps) {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput('');
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-background min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {value.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="gap-1 pr-1 pl-2"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="hover:bg-muted rounded-sm p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 border-0 shadow-none focus-visible:ring-0 min-w-[120px] p-0 h-6"
      />
    </div>
  );
}
