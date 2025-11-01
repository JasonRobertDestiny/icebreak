'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function TopicCardSkeleton() {
  return (
    <Card className="p-6 space-y-4">
      {/* 分类和emoji */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* 开场白 */}
      <Skeleton className="h-20 w-full" />

      {/* 评分指标 */}
      <div className="flex gap-4">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>

      {/* 为什么好 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>

      {/* 后续话题 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* 按钮 */}
      <div className="flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </Card>
  );
}

export function TopicCardSkeletonGrid() {
  return (
    <div className="space-y-6">
      <TopicCardSkeleton />
      <TopicCardSkeleton />
      <TopicCardSkeleton />
    </div>
  );
}
