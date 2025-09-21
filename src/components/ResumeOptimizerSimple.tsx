import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ResumeOptimizerSimple = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resume Optimizer - Test</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a test version of the Resume Optimizer component.</p>
        </CardContent>
      </Card>
    </div>
  );
};
