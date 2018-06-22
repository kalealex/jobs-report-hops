function plotPsycho(results,intensityName,p,functionName,binIntensity)
% plotPsycho(results,intensityName,p,functionName,binIntensity)

if ~exist('intensityName','var')
    intensityName= 'Intensity';
end
if ~exist('binIntensity','var')
    binIntensity = false;
end

% AMK added option to bin intensities
if binIntensity % use binned intensity values for more readable plots
    binBounds = linspace(min(results.intensity),max(results.intensity),round(length(results.intensity)/5)+1); % number of bins = round(length(results.intensity)/5)
    intensities = (binBounds(2:end) - binBounds(1:end-1))./2 + binBounds(1:end-1); % use middle value for each bin as intensities to plot

    % Then we'll loop through these intensities calculating the proportion of
    % times that 'response' is equal to 1:

    nCorrect = zeros(1,length(intensities));
    nTrials = zeros(1,length(intensities));

    for i=1:length(intensities)
        id = results.intensity >= binBounds(i) & results.intensity <  binBounds(i+1) & isreal(results.response);
        nTrials(i) = sum(id);
        nCorrect(i) = sum(results.response(id));
    end

    pCorrect = nCorrect./nTrials;

    clf
    hold on

    sd = pCorrect.*(1-pCorrect)./sqrt(nTrials);  %pq/sqrt(n)
    errorbar((intensities),100*pCorrect,100*sd,'bo','MarkerFaceColor','b');%,'MarkerSize',nTrials(i));
else % use actual intensities sampled for plotting
    intensities = unique(results.intensity);

    % Then we'll loop through these intensities calculating the proportion of
    % times that 'response' is equal to 1:

    nCorrect = zeros(1,length(intensities));
    nTrials = zeros(1,length(intensities));

    for i=1:length(intensities)
        id = results.intensity == intensities(i) & isreal(results.response);
        nTrials(i) = sum(id);
        nCorrect(i) = sum(results.response(id));
    end

    pCorrect = nCorrect./nTrials;

    clf
    hold on

    sd = pCorrect.*(1-pCorrect)./sqrt(nTrials);  %pq/sqrt(n)
    errorbar((intensities),100*pCorrect,100*sd,'bo','MarkerFaceColor','b');%,'MarkerSize',nTrials(i));
end

if exist('p','var')
    %plot the parametric psychometric function 
    x = linspace(min(results.intensity),max(results.intensity),101);
    evalStr = sprintf('y=%s(p,x);',functionName);
    eval(evalStr)
    plot((x),100*y,'r-','LineWidth',2);

end


ylim  = get(gca,'YLim');
xlim = get(gca,'XLim');

if strcmp(functionName,'Weibull')
    pThresh = 100*(1/2)^(1/3);  
elseif strcmp(functionName,'NormalCDF')
    if ~isfield(p,'g') || ~isfield(p,'l')
        pThresh = 75; % % correct at the mean of the normal cdf
    else
        pThresh = 100*mean([p.g (1 - p.l)]); 
    end
end


if exist('p','var')
    if strcmp(functionName,'Weibull') % AMK added conditional
        plot([xlim(1),(p.t),(p.t)],[pThresh,pThresh,ylim(1)],'k-');
        title(sprintf('Threshold: %5.4g',p.t));
    elseif strcmp(functionName,'NormalCDF')
        plot([xlim(1),(p.u),(p.u)],[pThresh,pThresh,ylim(1)],'k-');
        title(sprintf('Threshold: %5.4g',p.u));
    end
end

set(gca,'XTick',(intensities));

%set(gca,'YLim',[0,100]);
xlabel(intensityName);
ylabel('Percent Correct');










