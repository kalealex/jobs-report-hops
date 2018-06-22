function y = Weibull(p,x)
%y = Weibull(p,x)
%
%Parameters:  p.b slope
%             p.t threshold yeilding ~80% correct
%             x   intensity values.

g = 0.5;  %chance performance
e = (.5)^(1/3);  %threshold performance ( ~80%)

%here it is.
k = (-log( (1-e)/(1-g)))^(1/p.b);
y = 1- (1-g)*exp(- (k*x/p.t).^p.b);
