'use client';

import { useState, KeyboardEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_TAGS = [
  '独立音乐🎵',
  '咖啡馆☕',
  'INFP',
  '健身💪',
  '读书📚',
  '旅行✈️',
  '摄影📷',
  '美食🍜',
  '电影🎬',
  '游戏🎮',
  '艺术🎨',
  '编程💻',
  '瑜伽🧘',
  '露营⛺',
  '音乐节🎪',
  '手工艺🧵',
  '宠物🐕',
  '冥想🧘‍♀️',
  '骑行🚴',
  '烘焙🍰'
];

const MAX_TAGS = 5;

interface InterestInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export default function InterestInput({ value, onChange }: InterestInputProps) {
  const [customInput, setCustomInput] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag) return;

    if (value.length >= MAX_TAGS) {
      toast.error(`最多只能选择${MAX_TAGS}个标签`);
      return;
    }

    if (value.includes(trimmedTag)) {
      toast.warning('该标签已添加');
      return;
    }

    onChange([...value, trimmedTag]);
    setCustomInput('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(customInput);
    }
  };

  const handlePresetClick = (tag: string) => {
    addTag(tag);
  };

  return (
    <div className="space-y-6">
      {/* Selected Tags Display */}
      <div className="bg-white/90 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">已选择的兴趣</h3>
          <span className="text-sm text-gray-600 font-medium">
            {value.length}/{MAX_TAGS}个标签
          </span>
        </div>

        <div className="min-h-[60px] flex flex-wrap gap-2">
          {value.length === 0 ? (
            <p className="text-gray-400 text-sm">点击下方标签或输入自定义标签</p>
          ) : (
            value.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-3 py-2 text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center gap-2"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-purple-900 transition-colors"
                  aria-label={`删除${tag}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      {/* Custom Tag Input */}
      <div className="bg-white/90 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">自定义标签</h3>
        <Input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入自定义标签，按回车添加"
          className="bg-white"
          disabled={value.length >= MAX_TAGS}
        />
        {value.length >= MAX_TAGS && (
          <p className="text-sm text-amber-600 mt-2">已达到标签上限</p>
        )}
      </div>

      {/* Preset Tags */}
      <div className="bg-white/90 rounded-xl p-6 backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">预设标签</h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_TAGS.map((tag) => {
            const isSelected = value.includes(tag);
            const isDisabled = value.length >= MAX_TAGS && !isSelected;

            return (
              <Badge
                key={tag}
                variant={isSelected ? 'default' : 'outline'}
                className={`
                  px-3 py-2 text-sm cursor-pointer transition-all
                  ${isSelected
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : isDisabled
                    ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                    : 'hover:bg-purple-50 hover:border-purple-300'
                  }
                `}
                onClick={() => !isDisabled && handlePresetClick(tag)}
              >
                {tag}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
