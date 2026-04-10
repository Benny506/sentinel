/**
 * PCA Translation Layer: Translates abstract V1-V28 features into human-readable 
 * financial indicators for better UX and feature transparency.
 */
export const featureLabels = {
    V1: "Merchant Geometry",
    V2: "Temporal Shift",
    V3: "Transaction Velocity",
    V4: "Account Age Factor",
    V5: "Terminal Distance",
    V6: "Payment Chain Depth",
    V7: "Regional Anomaly",
    V8: "Device OS Fingerprint",
    V9: "Browser Consistency",
    V10: "Auth Attempt Recency",
    V11: "Session Duration",
    V12: "IP Geolocation Drift",
    V13: "Batch Frequency",
    V14: "Item Category Risk",
    V15: "Card Presence Flag",
    V16: "Cross-Border Ratio",
    V17: "Multi-Card Linkage",
    V18: "Midnight Activity Rate",
    V19: "Currency Conversion Factor",
    V20: "High-Value Deviation",
    V21: "Retry Density",
    V22: "Customer Tenure",
    V23: "Merchant Category Match",
    V24: "Biometric Confidence",
    V25: "Network Latency Score",
    V26: "Protocol Security Level",
    V27: "Voucher Usage Bias",
    V28: "Behavioral Entropy",
    Amount: "Monetary Value",
    Time: "Chronological Step"
};

export const featureCategories = {
    IDENTITY: {
        title: "Behavioral Pulse",
        icon: "Activity",
        features: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"]
    },
    FINGERPRINT: {
        title: "Digital Fingerprint",
        icon: "Shield",
        features: ["V8", "V9", "V10", "V11", "V12", "V13", "V14"]
    },
    CONTEXT: {
        title: "Contextual Risk",
        icon: "Layers",
        features: ["V15", "V16", "V17", "V18", "V19", "V20", "V21"]
    },
    PROTOCOL: {
        title: "System Integrity",
        icon: "Zap",
        features: ["V22", "V23", "V24", "V25", "V26", "V27", "V28"]
    },
    METADATA: {
        title: "Transaction Metadata",
        icon: "BarChart3",
        features: ["Amount", "Time"]
    }
};

export const getLabel = (key) => featureLabels[key] || key;
