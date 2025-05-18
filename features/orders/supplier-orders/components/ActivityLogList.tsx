import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivityLogListProps {
  logs: ActivityLog[];
  isLoading: boolean;
}

const ActivityLogList: React.FC<ActivityLogListProps> = ({ logs, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journal d'activité</CardTitle>
        </CardHeader>
        <CardContent>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="mb-4 flex items-start">
              <div className="mr-4">
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Journal d'activité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            Aucune activité à afficher
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal d'activité</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start">
              <div className="mr-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {log.companyUser.name.charAt(0)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{log.companyUser.name}</p>
                <p className='text-xs font-mon whitespace-pre-line'>{log.action}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(log.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogList;
