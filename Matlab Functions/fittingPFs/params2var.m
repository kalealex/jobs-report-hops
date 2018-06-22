function var = params2var(params,freeList)
%var = params2var(params,freeList)
%
%Support function for 'fit.m'
%Written by G.M Boynton, Summer of '00

var = [];
for i=1:length(freeList)
  evalStr = sprintf('tmp = params.%s;',freeList{i});
  eval(evalStr);
  var = [var,tmp(:)'];
end
