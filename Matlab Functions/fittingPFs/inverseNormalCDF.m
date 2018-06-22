function z = inverseNormalCDF(p)
%z = inverseNormalCDF(p)
%
%Calculates the inverse of the unit normal cumulative density function. 
%It returns the z-score corresponding to p, the area under the curve to the
%left in the unit normal distribution.  (See also Matlab's erfinv function)

%4/1/09 Written by G.M. Boynton at the University of Washington

z = sqrt(2)*erfinv(2*p-1);