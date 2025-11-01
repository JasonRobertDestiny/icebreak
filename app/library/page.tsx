'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trash2, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { IcebreakerLibrary, IcebreakerRecord } from '@/lib/utils/icebreaker-library';
import { toast } from 'sonner';
import Link from 'next/link';

export default function LibraryPage() {
  const [records, setRecords] = useState<IcebreakerRecord[]>([]);
  const [stats, setStats] = useState({ total: 0, success: 0, in_progress: 0, pending: 0, failed: 0 });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    setRecords(IcebreakerLibrary.getAll());
    setStats(IcebreakerLibrary.getStats());
  };

  const handleUpdateStatus = (id: string, status: IcebreakerRecord['status']) => {
    IcebreakerLibrary.updateStatus(id, status);
    loadRecords();
    toast.success('状态已更新');
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      IcebreakerLibrary.delete(id);
      loadRecords();
      toast.success('已删除');
    }
  };

  const getStatusBadge = (status: IcebreakerRecord['status']) => {
    const config = {
      success: { label: '成功', className: 'bg-green-100 text-green-700' },
      in_progress: { label: '进行中', className: 'bg-blue-100 text-blue-700' },
      pending: { label: '待发送', className: 'bg-gray-100 text-gray-700' },
      failed: { label: '失败', className: 'bg-red-100 text-red-700' }
    };
    return config[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              历史记录
            </h1>
            <p className="text-gray-600 text-sm mt-1">查看你的破冰历史和成功率</p>
          </div>
          <Link href="/chat">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-sm text-gray-600">总计</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.success}</div>
            <div className="text-sm text-gray-600">成功</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.in_progress}</div>
            <div className="text-sm text-gray-600">进行中</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">待发送</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600">失败</div>
          </Card>
        </div>

        {/* Success Rate */}
        {stats.total > 0 && (
          <Card className="p-4 mb-8 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <div>
                  <div className="text-sm text-gray-600">当前成功率</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((stats.success / stats.total) * 100)}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                基于 {stats.total} 次记录
              </div>
            </div>
          </Card>
        )}

        {/* Records List */}
        {records.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">还没有记录，去生成第一个开场白吧！</p>
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                开始破冰
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const statusConfig = getStatusBadge(record.status);
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{record.emoji}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{record.category}</Badge>
                            <Badge className={statusConfig.className}>
                              {statusConfig.label}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(record.createdAt).toLocaleString('zh-CN')}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-purple-600">
                        {record.success_rate}% 成功率
                      </div>
                    </div>

                    {/* Opener */}
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {record.opener}
                    </p>

                    {/* Interests */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {record.interests.map((interest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>

                    {/* Notes */}
                    {record.notes && (
                      <div className="bg-yellow-50 rounded p-3 mb-4 text-sm text-gray-700">
                        <strong>备注：</strong> {record.notes}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {record.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(record.id, 'in_progress')}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          标记为进行中
                        </Button>
                      )}
                      {(record.status === 'pending' || record.status === 'in_progress') && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                            onClick={() => handleUpdateStatus(record.id, 'success')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            成功
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            onClick={() => handleUpdateStatus(record.id, 'failed')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            失败
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-500"
                        onClick={() => handleDelete(record.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        删除
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
