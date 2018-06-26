## Visualizations Tested

To see the uncertainty visualizations tested in our experiments, follow this url.
https://kalealex.github.io/jobs-report-hops/Additional%20Interfaces/Conditions

## Experimental Interface

To see the interface we used to collect data for our experiments, follow this url.
https://kalealex.github.io/jobs-report-hops/Additional%20Interfaces/Experimental%20Interface/experimental-interface-all.pdf

## Data Analysis

Find supplemental materials containing the data analyses presented in the paper at the following urls.

* Experiment 1: https://kalealex.github.io/jobs-report-hops/Experiment%201/JobsReport_E1_Supplement.html
* Experiment 2: https://kalealex.github.io/jobs-report-hops/Experiment%202/JobsReport_E2_Supplement.html

You can use these R markdown documents and the anonymized data files provided in our repository to reproduce the analyses we present in the paper.

Also, note that these files contain supplementary analyses used to investigate: 

* The predictive performance of the confidence fitness model, 
* The impact of including time to complete the task as a covariate in our inferential model of JNDs, 
* The presence of biases in behavioral responses.

These markdown files walk through the thought process behind our analyses and provide many additional figures in order to help provide additional context for interpretting the findings we present in the paper.

## Contents

This repository contains analysis scripts and data for the InfoVis 2018 submission "Hypothetical Outcome Plots Help Untrained Observers Judge Trends in Ambiguous Data". Specific contents are as follows:

* Additional Interfaces: Folder containing demonstrations of stimuli and experimental interface used for data collection.
	* Conditions: Folder containing code to generate an interface demonstrating experimental stimuli.
	* Experimental Interface: Folder containing PDFs of experimental interfaces, showing what participants saw during the experiment.
* Confidence: Folder containing an R markdown file which gives a detailed explanation of the confidence fitness analysis and the strengths and limitations of this approach to confidence analysis.
* Experiment 1: Folder containing analysis scripts and data collected for Experiment 1.
	* E1-AnonymousRawData-FullSample.csv: Participant responses collected for Experiment 1, including data for six more participants (accidentally recruited) than were used for statistical inferences.
	* E1-AnonymousRawData-InferenceSample.csv: Participant responses collected for Experiment 1 and used for the statistical inferences presented in the paper.
	* E1-AnonymousStats-FullSample.csv: Estimates of dependent measures (JNDs, psychometric function spreads, and confidence fitness) for Experiment 1 data, including parameter estimates for six more participants (accidentally recruited) than were used for statistical inferences.
	* E1-AnonymousStats-InferenceSample.csv: Estimates of dependent measures (JNDs, psychometric function spreads, and confidence fitness) for Experiment 1 data, used for the statistical inferences presented in the paper.
	* JobsReport_E1_Supplement.html: Supplemental materials knit from the analysis script for Experiment 1.
	* JobsReport_E1_Supplement.Rmd: Analysis script for Experiment 1.
* Experiment 2: Directory containing analysis scripts and data collected for Experiment 2
	* E2-AnonymousRawData.csv: Participant responses collected for Experiment 2 and used for the statistical inferences presented in the paper.
	* E2-AnonymousStats.csv: Estimates of dependent measures (JNDs, psychometric function spreads, and confidence fitness) for Experiment 2 data, used for the statistical inferences presented in the paper.
	* JobsReport_E2_Supplement.html: Supplemental materials knit from the analysis script for Experiment 2.
	* JobsReport_E2_Supplement.Rmd: Analysis script for Experiment 2.
* Matlab Functions: Folder containing Matlab functions used for fitting psychometric functions and estimating confidence fitness.
	* fittingPFs: Matlab functions used for psychometric function fitting. Code is from Geoff Boynton with modifications by Alex Kale.
	* AK_confidenceMonteCarlo.m: A Matlab function used to estimate confidence fitness. Implementation by Alex Kale; algorithm inspired by Sanders et al. (2016, https://www.cell.com/neuron/pdfExtended/S0896-6273(16)30016-2).
* Uncertainty Vis In The News: Directory containing codes from our qualitative analysis of uncertainty visualizations in the news.
	* Uncertainty Vis In The News Codes.xlsx: Spreadsheet containing codes from our qualitative analysis of uncertainty visualizations in the news.