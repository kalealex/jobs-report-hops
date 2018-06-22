function [var,lb,ub,varStr] = params2varcon(params,freeList)
% [var,lb,ub,varStr] = params2varcon(params,freeList)
%
% Support function for 'fitcon.m'
% Written by G.M. Boynton on 9/26/14
% Adapted from 'params2var', written Summer of '00

var = [];
lb = [];
ub= [];
varStr = {};

%%
% interpret the strings in 'freeList' into a list of free parameters with
% lower and upper bounds.

for i=1:length(freeList)
    %remove spaces and '='
    j=1;
    while j<=length(freeList{i})        
        if strcmp(freeList{i}(j),' ') | strcmp(freeList{i}(j),'=')
            freeList{i} = freeList{i}([1:j-1,j+1:end]);
        end
        j=j+1;
    end
    %find '>' and '<'
    gt = findstr(freeList{i},'>');
    if length(gt) == 2  %ub > var > lb
        lbi = str2num(freeList{i}((gt(2)+1):end));
        ubi = str2num(freeList{i}(1:(gt(1)-1)));
        vari = freeList{i}((gt(1)+1):(gt(2)-1));
    end
    if length(gt) == 1 % ub > var  OR var> ub
        nLeft = str2num(freeList{i}(1:(gt-1)));
        nRight = str2num(freeList{i}((gt+1):end));
        if ~isempty(nLeft)  %ub > var
            lbi = -inf;
            ubi = nLeft;
            vari = freeList{i}((gt+1):end);
            
        elseif  ~isempty(nRight) %var > lb
            lbi = nRight;
            ubi = inf;
            vari = freeList{i}(1:(gt-1));
            
        else
            error(sprintf('Cannot parse "%s"',freeList{i}));
        end
    end
    
    lt = findstr(freeList{i},'<');
    if length(lt) == 2  %lb < var < ub
        lbi = str2num(freeList{i}(1:(lt(1)-1)));
        ubi = str2num(freeList{i}((lt(2)+1):end));
        vari = freeList{i}((lt(1)+1):(lt(2)-1));
    end
    if length(lt) == 1 % lb < var  OR var < ub
        nLeft = str2num(freeList{i}(1:(lt-1)));
        nRight = str2num(freeList{i}((lt+1):end));
        if ~isempty(nLeft)  %lb  < var
            lbi = nLeft;
            ubi = inf;
            vari = freeList{i}((lt+1):end);
            
        elseif  ~isempty(nRight) %var < ub
            ubi = nRight;
            lbi = -inf;
            vari = freeList{i}(1:(lt-1));
        else
            error(sprintf('Cannot parse "%s"',freeList{i}));
        end
    end
    
    if isempty(gt) & isempty(lt)
        lbi = -inf;
        ubi = inf;
        vari = freeList{i};
    end
    
    evalStr = sprintf('tmp = params.%s;',vari);
    varStr = [varStr,vari];
    eval(evalStr);
    oldLen = length(var);
    var = [var,tmp(:)'];
    newLen = length(var);
    lb((oldLen+1):newLen) = lbi;
    ub((oldLen+1):newLen) = ubi;
end
