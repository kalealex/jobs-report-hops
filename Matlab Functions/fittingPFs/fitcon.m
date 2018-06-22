function [params,err] = fitcon(funName,params,freeList,varargin)
% [params,err] = fitcon(funName,params,freeList,var1,var2,var3,...)
%
% Helpful interface to matlab's 'fmincon' function.
%
% INPUTS
%  'funName': function to be optimized.  \
%             Must have form err = <funName>(params,var1,var2,...)
%
%  params   : structure of parameter values for fitted function
%             can have field: params.options which sets options for
%             fminsearch program (see OPTIMSET)
%
%  freeList : cell array containing list of parameter names (strings) to be
%             free strings in this cell array can contain  either varable
%             names (as in 'fit.m'), or they can contain inequalities to
%             restrict variable ranges.  For example, the following are
%             valid.  
%
%             {'x>0','x<pi','0<x','0>x>10','z(1:2)>exp(1)','0<y<1'}  
%   
%  var<n>   : extra variables to be sent into fitted function
%
% OUTPUTS
%  params   : structure for best fitting parameters 
%  err      : error value at minimum
%
% Requires the functions:
%
% params2varcon, var2params, fitFunction 
%
% Written by Geoffrey M. Boynton, 9/26/14
% Adapted from 'fit.m' written by gmb in the summer of '00

%% turn free parameters in to vars, lower and upper bounds

if isfield(params,'options')
  options = params.options;
else
  options = [];
end
options.Display = 'off'; %suppress fmincon's annoying output 

if isempty(freeList)
  freeList = fieldnames(params);
end

[vars,lb,ub,varList] = params2varcon(params,freeList);

if ~isfield(params,'shutup')
  disp(sprintf('Fitting "%s" with %d free parameters.',funName,length(vars)));
end

vars = fmincon('fitFunction',vars,[],[],[],[],lb,ub,[],options,funName,params,varList,varargin);

%get final parameters
params=  var2params(vars,params,varList);

%evaluate the function

evalStr = sprintf('err = %s(params',funName);
for i=1:length(varargin)
  evalStr= [evalStr,',varargin{',num2str(i),'}'];
end
evalStr = [evalStr,');'];
eval(evalStr);







