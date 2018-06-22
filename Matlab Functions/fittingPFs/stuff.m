% stuff.m

fileName = 'JobsReportHOPs_AMK_PilotData_forGeoff';
fileName = 'JobsReportHOPs_PilotData_forGeoff';


fitFunctionName = 'Weibull';

allData = load(fileName);

for i=1:length(allData.results)
    results = allData.results(i);
    results.intensity = log10(results.intensity);
    
    % for Weibull
     p.b = 1;
     p.t = 4;
   
    % for normalCDF
    
%    p.u = 3;
%    p.s = 1;
    
    err = fitPsychometricFunction(p,results,fitFunctionName);
    
    pBest = fitcon('fitPsychometricFunction',p,{'b>0','10>t>0'},results,fitFunctionName);
 %       pBest = fit('fitPsychometricFunction',p,{'u','s'},results,fitFunctionName);

    errBest = fitPsychometricFunction(pBest,results,fitFunctionName);
    figure(i)
    plotPsycho(results,'log odds ratio',pBest,fitFunctionName)
end
