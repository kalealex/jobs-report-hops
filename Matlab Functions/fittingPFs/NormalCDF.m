function y = NormalCDF(p,x)
%y = Normal(p,x)
%
%Parameters:  p.s standard deviation
%             p.u mean
%             [p.g guess rate]
%             [p.l lapse rate]
%             x   intensity values.

if ~isfield(p,'g') || ~isfield(p,'l')
    y = NormalCumulative(x,p.u,p.s^2);
else
    y = NormalCumulative(x,p.u,p.s^2,p.g,p.l);
end
