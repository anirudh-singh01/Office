// Company Environment Configuration for Synopsys.ai Copilot GTM
// This file provides fallback configuration when the external domain is not accessible

window.ENV = {
  // Use a different base URL or localhost for company environment
  baseUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://snpsai-copilot-gtm',
  apiUrl: window.location.hostname === 'localhost' ? 'http://localhost:3000/api' : 'https://snpsai-copilot-gtm/api',
  environment: 'production',
  
  // Feature flags
  features: {
    analytics: true,
    errorReporting: true,
    performanceTracking: true,
    externalTools: false // Disable external tools if domain is not accessible
  },
  
  // Tool URLs with fallback
  tools: {
    fusionCompiler: 'https://snpsai-copilot-gtm/?product=fc',
    primetime: 'https://snpsai-copilot-gtm/?product=pt',
    customCompiler: 'https://snpsai-copilot-gtm/?product=cc',
    vcs: 'https://snpsai-copilot-gtm/?product=vcs',
    dsoAi: 'https://snpsai-copilot-gtm/?product=dso',
    icValidator: 'https://snpsai-copilot-gtm/?product=icv',
    primesimPro: 'https://snpsai-copilot-gtm/?product=psim_pro',
    vcFormal: 'https://snpsai-copilot-gtm/?product=vcformal',
    vcLowPower: 'https://snpsai-copilot-gtm/?product=vclp',
    vcSpyglass: 'https://snpsai-copilot-gtm/?product=vcspyglass',
    verdi: 'https://snpsai-copilot-gtm/?product=verdi',
    synopsysCopilot: 'https://snpsai-copilot-gtm/?product=copilot'
  },
  
  // Error handling configuration
  errorHandling: {
    showFallbackContent: true,
    logErrors: true,
    retryAttempts: 3
  }
};
