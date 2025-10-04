import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { EntryFormData } from '../types';
import { siteOptions, AccountType } from '../data/siteOptions';

// UI Components (Corrected Paths - should resolve 'Failed to resolve import "./components/ui/button"')
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Progress } from '../components/ui/progress';

// ASSET CORRECTION: Use the public path for the logo
// NOTE: Assuming '/logogreen.png' is the correct URL for /home/project/public/logogreen.png
const cbreLogoPath = '/logogreen.png';

import { 
  Calendar, 
  Building2, 
  MapPin, 
  User, 
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Briefcase,
  Shield,
  Zap
} from 'lucide-react';

// 1. Validation Schema
const schema = yup.object({
  account: yup.string().required('Account is required'),
  site: yup.string().required('Site is required'),
  pmTaskName: yup.string().required('PM Task Name is required'),
  serviceProvider: yup.string().required('Service Provider is required'),
  serviceCompletedBy: yup.string().required('Name is required'),
  dateOfMaintenance: yup.string().required('Date of Maintenance is required'),
}).required();

interface QuickSuggestion {
  account: string;
  site: string;
  task: string;
}

export default function EntryPage() {
  const navigate = useNavigate();
  const { setFormData, formData } = useApp();

  const { register, handleSubmit, watch, setValue, formState: { errors, isValid } } = useForm<EntryFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: formData || {
      account: '',
      site: '',
      pmTaskName: '',
      serviceProvider: '',
      serviceCompletedBy: '',
      dateOfMaintenance: '',
    },
  });

  const allFields = watch();
  const selectedAccount = watch('account');

  // UI State & Constants
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const quickSuggestions: QuickSuggestion[] = [
    { account: 'Tech Corporation', site: 'Building A - North Wing', task: 'Monthly HVAC Inspection' },
    { account: 'Downtown Plaza', site: 'Main Tower - Floors 1-5', task: 'Elevator Maintenance Check' },
    { account: 'Metro Office Complex', site: 'West Building - Lobby', task: 'Fire Safety System Review' }
  ];

  // Calculate progress based on RHF state
  useEffect(() => {
    const formFields: (keyof EntryFormData)[] = ['account', 'site', 'pmTaskName', 'serviceProvider', 'serviceCompletedBy', 'dateOfMaintenance'];
    const filledFields = formFields.filter(field => !!allFields[field]).length;
    setProgress((filledFields / formFields.length) * 100);
  }, [allFields]);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);


  // Submission handler
  const onSubmit = (data: EntryFormData) => {
    setFormData(data);
    navigate('/dashboard');
  };

  // Quick Fill handler (uses setValue to update RHF state)
  const handleQuickFill = (suggestion: QuickSuggestion) => {
    setValue('account', suggestion.account, { shouldValidate: true, shouldDirty: true });
    setValue('site', suggestion.site, { shouldValidate: true, shouldDirty: true });
    setValue('pmTaskName', suggestion.task, { shouldValidate: true, shouldDirty: true });
    setValue('serviceProvider', 'Professional Maintenance Services', { shouldValidate: true, shouldDirty: true });
    setValue('dateOfMaintenance', new Date().toISOString().split('T')[0], { shouldValidate: true, shouldDirty: true });
  };
  
  // Site filtering logic
  const availableSites = selectedAccount ? siteOptions[selectedAccount as AccountType] || [] : [];
  
  // Helper to determine if a field is completed (no errors and has a value)
  const isFieldCompleted = useCallback((fieldName: keyof EntryFormData) => {
    return !!allFields[fieldName] && !errors[fieldName];
  }, [allFields, errors]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-blue-600/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative z-10 min-h-screen p-4">
        <div className="max-w-md mx-auto">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mb-6">
              {/* Logo */}
                <img src={cbreLogoPath} alt="CBRE Logo" className="w-20 h-auto mx-auto mb-4" />
            </div>

            {/* Quick Fill Suggestions */}
            <div className="mb-6 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Report Generator</span>
                </h3>
            </div>

            {/* Progress Indicator */}
            {progress > 0 && (
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Completion Progress</span>
                  <span className="text-emerald-700">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-emerald-600 [&>div]:to-emerald-500" />
              </div>
            )}
          </div>
            
          {/* Form Card */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl shadow-black/10 p-6 space-y-6 border border-white/50">
            
            {/* Account Field (Select) */}
            <div className="space-y-3">
              <Label htmlFor="account" className="text-gray-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Account</span>
                {isFieldCompleted('account') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </Label>
              <Select 
                  value={allFields.account} 
                  onValueChange={(value) => {
                      setValue('account', value, { shouldValidate: true, shouldDirty: true });
                      setValue('site', '', { shouldValidate: true, shouldDirty: true });
                  }}
              >
                <SelectTrigger className="w-full h-14 bg-white/80 border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm">
                  <SelectValue placeholder="Choose your account" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-200/60 backdrop-blur-lg">
                    {Object.keys(siteOptions).map((account) => (
                        <SelectItem key={account} value={account}>{account}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
                {errors.account && (
                  <p className="text-red-500 mt-2 text-xs font-medium">{errors.account.message}</p>
                )}
            </div>

            {/* Site Field (Select) */}
            <div className="space-y-3">
              <Label htmlFor="site" className="text-gray-900 flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Site Location</span>
                {isFieldCompleted('site') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </Label>
              <Select 
                  value={allFields.site} 
                  onValueChange={(value) => setValue('site', value, { shouldValidate: true, shouldDirty: true })}
                  disabled={!selectedAccount || availableSites.length === 0}
              >
                <SelectTrigger className="w-full h-14 bg-white/80 border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
                  <SelectValue placeholder={!selectedAccount ? "Select an Account first" : "Choose site location"} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-gray-200/60 backdrop-blur-lg">
                    {availableSites.map(site => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors.site && (
                  <p className="text-red-500 mt-2 text-xs font-medium">{errors.site.message}</p>
                )}
            </div>

            {/* PM Task Name Field (Input) */}
            <div className="space-y-3">
              <Label htmlFor="pmTaskName" className="text-gray-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Maintenance Task</span>
                {isFieldCompleted('pmTaskName') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </Label>
              <Input
                id="pmTaskName"
                type="text"
                placeholder="Enter maintenance task details"
                {...register('pmTaskName')}
                className="w-full h-14 bg-white/80 border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 px-4 transition-all duration-200 shadow-sm text-gray-900 placeholder:text-gray-400"
              />
              {errors.pmTaskName && (
                  <p className="text-red-500 mt-2 text-xs font-medium">{errors.pmTaskName.message}</p>
                )}
            </div>

            {/* Service Provider Field (Input) */}
            <div className="space-y-3">
              <Label htmlFor="serviceProvider" className="text-gray-900 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-orange-600" />
                <span>Service Provider</span>
                {isFieldCompleted('serviceProvider') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </Label>
              <Input
                id="serviceProvider"
                type="text"
                placeholder="Enter service provider company name"
                {...register('serviceProvider')}
                className="w-full h-14 bg-white/80 border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 px-4 transition-all duration-200 shadow-sm text-gray-900 placeholder:text-gray-400"
              />
              {errors.serviceProvider && (
                  <p className="text-red-500 mt-2 text-xs font-medium">{errors.serviceProvider.message}</p>
                )}
            </div>

            {/* Service Completed By Field (Input) */}
            <div className="space-y-3">
              <Label htmlFor="serviceCompletedBy" className="text-gray-900 flex items-center space-x-2">
                <User className="w-4 h-4 text-indigo-600" />
                <span>Technician Name</span>
                {isFieldCompleted('serviceCompletedBy') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </Label>
              <Input
                id="serviceCompletedBy"
                type="text"
                placeholder="Enter technician's full name"
                {...register('serviceCompletedBy')}
                className="w-full h-14 bg-white/80 border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 px-4 transition-all duration-200 shadow-sm text-gray-900 placeholder:text-gray-400"
              />
              {errors.serviceCompletedBy && (
                  <p className="text-red-500 mt-2 text-xs font-medium">{errors.serviceCompletedBy.message}</p>
                )}
            </div>

            {/* Date of Maintenance Field (Input Date) */}
            <div className="space-y-3">
              <Label htmlFor="dateOfMaintenance" className="text-gray-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Maintenance Date</span>
                {isFieldCompleted('dateOfMaintenance') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </Label>
              <div className="relative">
                <Input
                  id="dateOfMaintenance"
                  type="date"
                  {...register('dateOfMaintenance')}
                  className="w-full h-14 bg-white/80 border-gray-200/60 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 px-4 pr-12 transition-all duration-200 shadow-sm text-gray-900 placeholder:text-gray-400 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
              {errors.dateOfMaintenance && (
                  <p className="text-red-500 mt-2 text-xs font-medium">{errors.dateOfMaintenance.message}</p>
                )}
            </div>

            {/* Continue Button */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={!isValid}
                className={`w-full h-16 rounded-2xl transition-all duration-300 ${
                  isValid 
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xl shadow-emerald-700/25 hover:shadow-emerald-700/40 hover:scale-[1.02] active:scale-[0.98]' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-lg shadow-gray-200/20'
                }`}
              >
                {isValid ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">Start Inspection</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Complete all fields to continue</span>
                  </div>
                )}
              </Button>
            </div>

            {/* Completion Status */}
            {isValid && (
              <div className="flex items-center justify-center space-x-2 text-sm text-emerald-700 bg-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 mt-4">
                <CheckCircle2 className="w-5 h-5" />
                <span>Ready to begin Report Preparation</span>
                <Sparkles className="w-4 h-4" />
              </div>
            )}
          </form>

          {/* Bottom spacing for iOS-style layout */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}
