'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  Building2,
  Gavel,
  Calculator,
  Stethoscope,
  FileText,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  Settings,
  Zap
} from 'lucide-react';

interface WorkflowTest {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  steps: number;
}

interface TestResult {
  step: string;
  action: string;
  status: 'PASSED' | 'FAILED';
  expectedResult: string;
  actualResult: any;
  validation: boolean;
  error?: string;
}

interface WorkflowResult {
  workflow: string;
  description: string;
  totalSteps: number;
  passedSteps: number;
  failedSteps: number;
  allStepsPassed: boolean;
  results: TestResult[];
}

const workflowTests: WorkflowTest[] = [
  {
    id: 'dental-practice-setup',
    name: 'Complete Dental Practice Setup',
    description: 'End-to-end dental practice setup including company branding, industry configuration, client management, and billing',
    icon: <Stethoscope className="h-6 w-6" />,
    color: 'bg-green-500',
    steps: 10
  },
  {
    id: 'legal-practice-setup',
    name: 'Complete Legal Practice Setup',
    description: 'End-to-end legal practice setup including case management, client billing, and document management',
    icon: <Gavel className="h-6 w-6" />,
    color: 'bg-red-500',
    steps: 10
  },
  {
    id: 'accounting-firm-setup',
    name: 'Complete Accounting Firm Setup',
    description: 'End-to-end accounting firm setup including tax preparation, client management, and financial reporting',
    icon: <Calculator className="h-6 w-6" />,
    color: 'bg-blue-500',
    steps: 10
  }
];

export default function ComprehensiveTestingPage() {
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Record<string, WorkflowResult>>({});
  const [overallProgress, setOverallProgress] = useState(0);

  const runWorkflowTest = async (workflowId: string) => {
    setRunningTests(prev => new Set(prev).add(workflowId));
    
    try {
      const response = await fetch('/api/test-data/comprehensive-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId })
      });
      
      if (response.ok) {
        const data: WorkflowResult = await response.json();
        setTestResults(prev => ({
          ...prev,
          [workflowId]: data
        }));
        
        // Update overall progress
        const totalTests = Object.keys(testResults).length + 1;
        const passedTests = Object.values(testResults).filter(r => r.allStepsPassed).length + (data.allStepsPassed ? 1 : 0);
        setOverallProgress((passedTests / totalTests) * 100);
      } else {
        const errorData = await response.json();
        setTestResults(prev => ({
          ...prev,
          [workflowId]: {
            workflow: workflowId,
            description: 'Test failed to start',
            totalSteps: 0,
            passedSteps: 0,
            failedSteps: 0,
            allStepsPassed: false,
            results: []
          }
        }));
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [workflowId]: {
          workflow: workflowId,
          description: 'Test failed to start',
          totalSteps: 0,
          passedSteps: 0,
          failedSteps: 0,
          allStepsPassed: false,
          results: []
        }
      }));
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(workflowId);
        return newSet;
      });
    }
  };

  const runAllTests = async () => {
    for (const workflow of workflowTests) {
      await runWorkflowTest(workflow.id);
      // Add delay between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  };

  const getStatusIcon = (status: 'PASSED' | 'FAILED') => {
    return status === 'PASSED' ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (status: 'PASSED' | 'FAILED') => {
    return status === 'PASSED' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comprehensive End-to-End Testing</h1>
          <p className="text-muted-foreground">
            Complete workflow testing for professional practice management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {workflowTests.length} Workflows
          </Badge>
          <Badge variant="outline" className="text-sm">
            {workflowTests.reduce((acc, w) => acc + w.steps, 0)} Total Steps
          </Badge>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Overall Test Progress
          </CardTitle>
          <CardDescription>
            Complete end-to-end workflow testing progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Test Completion</span>
              <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="w-full" />
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Passed: {Object.values(testResults).filter(r => r.allStepsPassed).length}</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Failed: {Object.values(testResults).filter(r => !r.allStepsPassed).length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>Running: {runningTests.size}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
          <CardDescription>
            Run individual workflows or all tests at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests}
              disabled={runningTests.size > 0}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Run All Tests
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setTestResults({});
                setOverallProgress(0);
              }}
            >
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {workflowTests.map((workflow) => {
          const isRunning = runningTests.has(workflow.id);
          const result = testResults[workflow.id];
          
          return (
            <Card key={workflow.id} className="relative">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${workflow.color} text-white`}>
                    {workflow.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {workflow.steps} steps • {workflow.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Test Status */}
                  {result && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Test Results</span>
                        <Badge 
                          variant={result.allStepsPassed ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {result.allStepsPassed ? 'PASSED' : 'FAILED'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>Passed: {result.passedSteps}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-red-500" />
                          <span>Failed: {result.failedSteps}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button 
                    onClick={() => runWorkflowTest(workflow.id)}
                    disabled={isRunning}
                    className="w-full"
                    variant={result?.allStepsPassed ? "outline" : "default"}
                  >
                    {isRunning ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Running...
                      </>
                    ) : result?.allStepsPassed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Re-run Test
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run Test
                      </>
                    )}
                  </Button>

                  {/* Step Results */}
                  {result && result.results.length > 0 && (
                    <div className="space-y-2">
                      <Separator />
                      <div className="text-xs font-medium">Step Results:</div>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {result.results.map((stepResult, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            {getStatusIcon(stepResult.status)}
                            <span className={`flex-1 ${getStatusColor(stepResult.status)}`}>
                              {stepResult.step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Results */}
      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Test Results</CardTitle>
            <CardDescription>
              Complete breakdown of each test step and its results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(testResults).map(([workflowId, result]) => (
                <div key={workflowId} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{result.workflow}</h3>
                    <Badge 
                      variant={result.allStepsPassed ? "default" : "destructive"}
                    >
                      {result.allStepsPassed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.results.map((stepResult, index) => (
                      <Card key={index} className="border-l-4 border-l-blue-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(stepResult.status)}
                            <CardTitle className="text-sm">{stepResult.step}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-xs">
                            <div>
                              <span className="font-medium">Action:</span> {stepResult.action}
                            </div>
                            <div>
                              <span className="font-medium">Expected:</span> {stepResult.expectedResult}
                            </div>
                            {stepResult.error && (
                              <div className="text-red-600">
                                <span className="font-medium">Error:</span> {stepResult.error}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 