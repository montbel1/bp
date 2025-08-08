'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  AlertCircle,
  Info,
  Save,
  Download,
  Upload
} from 'lucide-react';

interface RiskFactor {
  id: string;
  category: string;
  factor: string;
  weight: number;
  score: number;
  description: string;
  mitigation: string;
}

interface RiskAssessment {
  clientId: string;
  clientName: string;
  assessmentDate: string;
  overallRisk: 'low' | 'medium' | 'high';
  totalScore: number;
  maxScore: number;
  riskPercentage: number;
  factors: RiskFactor[];
  recommendations: string[];
  reviewer: string;
  nextReviewDate: string;
}

const riskFactors: RiskFactor[] = [
  // Business Risk Factors
  {
    id: '1',
    category: 'Business Risk',
    factor: 'New Business (< 2 years)',
    weight: 3,
    score: 0,
    description: 'Businesses less than 2 years old have higher risk',
    mitigation: 'Request additional documentation and references'
  },
  {
    id: '2',
    category: 'Business Risk',
    factor: 'Complex Business Structure',
    weight: 2,
    score: 0,
    description: 'Multiple entities, partnerships, or complex ownership',
    mitigation: 'Require detailed organizational charts and documentation'
  },
  {
    id: '3',
    category: 'Business Risk',
    factor: 'Industry Risk',
    weight: 2,
    score: 0,
    description: 'High-risk industries (gambling, adult entertainment, etc.)',
    mitigation: 'Enhanced due diligence and monitoring'
  },
  {
    id: '4',
    category: 'Business Risk',
    factor: 'Geographic Risk',
    weight: 1,
    score: 0,
    description: 'Operating in high-risk jurisdictions',
    mitigation: 'Verify compliance with local regulations'
  },
  
  // Financial Risk Factors
  {
    id: '5',
    category: 'Financial Risk',
    factor: 'Unusual Transaction Patterns',
    weight: 4,
    score: 0,
    description: 'Large cash transactions or unusual payment methods',
    mitigation: 'Request detailed transaction documentation'
  },
  {
    id: '6',
    category: 'Financial Risk',
    factor: 'Inconsistent Financial Records',
    weight: 3,
    score: 0,
    description: 'Missing or inconsistent financial documentation',
    mitigation: 'Require complete financial records before engagement'
  },
  {
    id: '7',
    category: 'Financial Risk',
    factor: 'High Revenue Volatility',
    weight: 2,
    score: 0,
    description: 'Significant year-over-year revenue fluctuations',
    mitigation: 'Request detailed explanations for fluctuations'
  },
  {
    id: '8',
    category: 'Financial Risk',
    factor: 'Cash-Intensive Business',
    weight: 2,
    score: 0,
    description: 'Business primarily operates with cash transactions',
    mitigation: 'Enhanced documentation requirements'
  },
  
  // Compliance Risk Factors
  {
    id: '9',
    category: 'Compliance Risk',
    factor: 'Previous Tax Issues',
    weight: 4,
    score: 0,
    description: 'History of tax liens, audits, or penalties',
    mitigation: 'Review all previous tax issues before engagement'
  },
  {
    id: '10',
    category: 'Compliance Risk',
    factor: 'Regulatory Violations',
    weight: 4,
    score: 0,
    description: 'History of regulatory violations or investigations',
    mitigation: 'Require detailed explanation and resolution documentation'
  },
  {
    id: '11',
    category: 'Compliance Risk',
    factor: 'International Operations',
    weight: 2,
    score: 0,
    description: 'Operations in multiple countries or jurisdictions',
    mitigation: 'Verify compliance with all applicable regulations'
  },
  {
    id: '12',
    category: 'Compliance Risk',
    factor: 'Complex Tax Situations',
    weight: 3,
    score: 0,
    description: 'Multiple tax jurisdictions, trusts, or complex structures',
    mitigation: 'Require specialized expertise and additional review'
  },
  
  // Relationship Risk Factors
  {
    id: '13',
    category: 'Relationship Risk',
    factor: 'Client Communication Issues',
    weight: 2,
    score: 0,
    description: 'Poor responsiveness or uncooperative behavior',
    mitigation: 'Establish clear communication protocols'
  },
  {
    id: '14',
    category: 'Relationship Risk',
    factor: 'Unrealistic Expectations',
    weight: 2,
    score: 0,
    description: 'Client has unrealistic expectations about services or outcomes',
    mitigation: 'Clear engagement letter with realistic expectations'
  },
  {
    id: '15',
    category: 'Relationship Risk',
    factor: 'Pressure for Aggressive Positions',
    weight: 4,
    score: 0,
    description: 'Client pressures for aggressive tax positions',
    mitigation: 'Document all advice and maintain professional standards'
  },
  {
    id: '16',
    category: 'Relationship Risk',
    factor: 'Conflicts of Interest',
    weight: 4,
    score: 0,
    description: 'Potential conflicts with existing clients or firm',
    mitigation: 'Full conflict check and disclosure process'
  }
];

export default function RiskAssessmentTool() {
  const [selectedClient, setSelectedClient] = useState('');
  const [assessment, setAssessment] = useState<RiskAssessment | null>(null);
  const [factors, setFactors] = useState<RiskFactor[]>(riskFactors);
  const [isNewAssessment, setIsNewAssessment] = useState(false);

  const calculateRisk = () => {
    const totalScore = factors.reduce((sum, factor) => sum + (factor.score * factor.weight), 0);
    const maxScore = factors.reduce((sum, factor) => sum + (factor.weight * 3), 0);
    const riskPercentage = (totalScore / maxScore) * 100;
    
    let overallRisk: 'low' | 'medium' | 'high';
    if (riskPercentage < 30) {
      overallRisk = 'low';
    } else if (riskPercentage < 60) {
      overallRisk = 'medium';
    } else {
      overallRisk = 'high';
    }

    const recommendations = generateRecommendations(factors, overallRisk);

    return {
      totalScore,
      maxScore,
      riskPercentage,
      overallRisk,
      recommendations
    };
  };

  const generateRecommendations = (factors: RiskFactor[], riskLevel: string) => {
    const recommendations: string[] = [];
    
    if (riskLevel === 'high') {
      recommendations.push('Enhanced due diligence required');
      recommendations.push('Senior partner review mandatory');
      recommendations.push('Quarterly risk reassessment');
    } else if (riskLevel === 'medium') {
      recommendations.push('Standard due diligence procedures');
      recommendations.push('Annual risk reassessment');
    } else {
      recommendations.push('Standard engagement procedures');
      recommendations.push('Biennial risk reassessment');
    }

    // Add specific recommendations based on high-risk factors
    const highRiskFactors = factors.filter(f => f.score >= 2);
    highRiskFactors.forEach(factor => {
      recommendations.push(factor.mitigation);
    });

    return recommendations;
  };

  const handleScoreChange = (factorId: string, score: number) => {
    setFactors(prev => prev.map(factor => 
      factor.id === factorId ? { ...factor, score } : factor
    ));
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const riskCalculation = calculateRisk();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Risk Assessment Tool</h1>
          <p className="text-gray-600">Comprehensive risk evaluation for financial professionals</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Assessment
          </Button>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Save Assessment
          </Button>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  <Badge className={`${getRiskColor(riskCalculation.overallRisk)} text-lg`}>
                    {riskCalculation.overallRisk.toUpperCase()}
                  </Badge>
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riskCalculation.totalScore}/{riskCalculation.maxScore}
                </p>
              </div>
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Percentage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {riskCalculation.riskPercentage.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Risk Factors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {factors.filter(f => f.score >= 2).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assessment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Form</CardTitle>
          <CardDescription>
            Evaluate client risk factors across multiple categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Client Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Client</label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john-smith">John Smith - Acme Corporation</SelectItem>
                    <SelectItem value="maria-garcia">Maria Garcia - TechStart Inc</SelectItem>
                    <SelectItem value="david-wilson">David Wilson - RetailCo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Assessment Date</label>
                <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
            </div>

            {/* Risk Factors by Category */}
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="business">Business Risk</TabsTrigger>
                <TabsTrigger value="financial">Financial Risk</TabsTrigger>
                <TabsTrigger value="compliance">Compliance Risk</TabsTrigger>
                <TabsTrigger value="relationship">Relationship Risk</TabsTrigger>
              </TabsList>

              <TabsContent value="business" className="space-y-4">
                <div className="space-y-4">
                  {factors.filter(f => f.category === 'Business Risk').map((factor) => (
                    <div key={factor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{factor.factor}</h4>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                        </div>
                        <Badge variant="outline">Weight: {factor.weight}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="0"
                            checked={factor.score === 0}
                            onChange={() => handleScoreChange(factor.id, 0)}
                          />
                          <span className="text-sm">None</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="1"
                            checked={factor.score === 1}
                            onChange={() => handleScoreChange(factor.id, 1)}
                          />
                          <span className="text-sm">Low</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="2"
                            checked={factor.score === 2}
                            onChange={() => handleScoreChange(factor.id, 2)}
                          />
                          <span className="text-sm">Medium</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="3"
                            checked={factor.score === 3}
                            onChange={() => handleScoreChange(factor.id, 3)}
                          />
                          <span className="text-sm">High</span>
                        </div>
                      </div>
                      {factor.score > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Mitigation:</strong> {factor.mitigation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="financial" className="space-y-4">
                <div className="space-y-4">
                  {factors.filter(f => f.category === 'Financial Risk').map((factor) => (
                    <div key={factor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{factor.factor}</h4>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                        </div>
                        <Badge variant="outline">Weight: {factor.weight}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="0"
                            checked={factor.score === 0}
                            onChange={() => handleScoreChange(factor.id, 0)}
                          />
                          <span className="text-sm">None</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="1"
                            checked={factor.score === 1}
                            onChange={() => handleScoreChange(factor.id, 1)}
                          />
                          <span className="text-sm">Low</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="2"
                            checked={factor.score === 2}
                            onChange={() => handleScoreChange(factor.id, 2)}
                          />
                          <span className="text-sm">Medium</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="3"
                            checked={factor.score === 3}
                            onChange={() => handleScoreChange(factor.id, 3)}
                          />
                          <span className="text-sm">High</span>
                        </div>
                      </div>
                      {factor.score > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Mitigation:</strong> {factor.mitigation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                <div className="space-y-4">
                  {factors.filter(f => f.category === 'Compliance Risk').map((factor) => (
                    <div key={factor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{factor.factor}</h4>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                        </div>
                        <Badge variant="outline">Weight: {factor.weight}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="0"
                            checked={factor.score === 0}
                            onChange={() => handleScoreChange(factor.id, 0)}
                          />
                          <span className="text-sm">None</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="1"
                            checked={factor.score === 1}
                            onChange={() => handleScoreChange(factor.id, 1)}
                          />
                          <span className="text-sm">Low</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="2"
                            checked={factor.score === 2}
                            onChange={() => handleScoreChange(factor.id, 2)}
                          />
                          <span className="text-sm">Medium</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="3"
                            checked={factor.score === 3}
                            onChange={() => handleScoreChange(factor.id, 3)}
                          />
                          <span className="text-sm">High</span>
                        </div>
                      </div>
                      {factor.score > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Mitigation:</strong> {factor.mitigation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="relationship" className="space-y-4">
                <div className="space-y-4">
                  {factors.filter(f => f.category === 'Relationship Risk').map((factor) => (
                    <div key={factor.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{factor.factor}</h4>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                        </div>
                        <Badge variant="outline">Weight: {factor.weight}</Badge>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="0"
                            checked={factor.score === 0}
                            onChange={() => handleScoreChange(factor.id, 0)}
                          />
                          <span className="text-sm">None</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="1"
                            checked={factor.score === 1}
                            onChange={() => handleScoreChange(factor.id, 1)}
                          />
                          <span className="text-sm">Low</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="2"
                            checked={factor.score === 2}
                            onChange={() => handleScoreChange(factor.id, 2)}
                          />
                          <span className="text-sm">Medium</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={`factor-${factor.id}`}
                            value="3"
                            checked={factor.score === 3}
                            onChange={() => handleScoreChange(factor.id, 3)}
                          />
                          <span className="text-sm">High</span>
                        </div>
                      </div>
                      {factor.score > 0 && (
                        <div className="mt-2 p-2 bg-blue-50 rounded">
                          <p className="text-sm text-blue-800">
                            <strong>Mitigation:</strong> {factor.mitigation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Recommendations</CardTitle>
          <CardDescription>
            Based on the risk factors identified, here are the recommended actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Risk Level: {riskCalculation.overallRisk.toUpperCase()}</h4>
                <div className="space-y-2">
                  {riskCalculation.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Next Steps</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Schedule follow-up review in 30 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span>Document all risk factors and mitigations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span>Notify senior partner if high risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 