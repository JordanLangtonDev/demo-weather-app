'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

export function PlanInfo() {
  return (
    <Card className="shadow-md border-amber-200 bg-amber-50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-amber-800 flex items-center gap-2">
          <Info className="w-5 h-5" />
          API Plan Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-amber-700">
            <p className="mb-3">
              This app uses the Weatherstack API. Different features are available based on your subscription plan.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-amber-800">Free Plan (1,000 calls/month)</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Current weather data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span>Weather forecasts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="w-3 h-3 text-red-600" />
                    <span>Historical weather data</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-amber-800">Paid Plans</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Standard: 3-day forecast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Professional: 7-day forecast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span>Business: 14-day forecast</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
              Current: Free Plan
            </Badge>
            
            <a
              href="https://weatherstack.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 underline"
            >
              View Plans
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
